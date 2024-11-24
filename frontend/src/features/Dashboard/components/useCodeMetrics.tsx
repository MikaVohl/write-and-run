import { useMemo } from 'react';

interface CodeMetrics {
  totalLines: number;
  codeLines: number;
  commentLines: number;
  characters: number;
  functions: number;
  complexity: number;
}

interface CommentToken {
  start: string;
  end?: string;
  isBlock: boolean;
}

interface LanguageConfig {
  comments: CommentToken[];
  functionPatterns: RegExp[];
  complexityKeywords: string[];
  blockStart?: string;
  blockEnd?: string;
}

const DEFAULT_LANGUAGE_CONFIG: LanguageConfig = {
  comments: [{ start: '//', isBlock: false }, { start: '/*', end: '*/', isBlock: true }],
  functionPatterns: [/\w+\s+\w+\s*\([^)]*\)\s*{/g],
  complexityKeywords: ['if', 'else', 'for', 'while', 'switch', 'case', 'try', 'catch'],
  blockStart: '{',
  blockEnd: '}'
};

const LANGUAGE_CONFIGS: Record<string, Partial<LanguageConfig>> = {
  python: {
    comments: [
      { start: '#', isBlock: false },
      { start: '"""', end: '"""', isBlock: true },
      { start: "'''", end: "'''", isBlock: true }
    ],
    functionPatterns: [
      /def\s+\w+\s*\([^)]*\):/g,
      /lambda\s+[^:]+:/g,
      /async\s+def\s+\w+\s*\([^)]*\):/g
    ],
    complexityKeywords: ['if', 'elif', 'else', 'for', 'while', 'try', 'except', 'with'],
    blockStart: ':',
    blockEnd: 'dedent' // Special case for Python's indentation
  },
  javascript: {
    comments: [
      { start: '//', isBlock: false },
      { start: '/*', end: '*/', isBlock: true },
      { start: '/**', end: '*/', isBlock: true } // JSDoc
    ],
    functionPatterns: [
      /function\s+\w+\s*\([^)]*\)/g,
      /\w+\s*=\s*function\s*\([^)]*\)/g,
      /\w+\s*:\s*function\s*\([^)]*\)/g,
      /(?:async\s+)?(?:function)?\s*\([^)]*\)\s*=>/g,
      /class\s+\w+/g,
      /\w+\s*=\s*class\s*\{/g
    ],
    complexityKeywords: [
      'if', 'else', 'for', 'while', 'switch', 'case',
      'try', 'catch', 'do', '&&', '||', '??', '?.'
    ]
  }
  // Add more language configurations as needed
};

function mergeConfig(language: string): LanguageConfig {
  const langConfig = LANGUAGE_CONFIGS[language.toLowerCase()];
  return langConfig ? { ...DEFAULT_LANGUAGE_CONFIG, ...langConfig } : DEFAULT_LANGUAGE_CONFIG;
}

function isInString(code: string, position: number): boolean {
  let inString = false;
  let stringChar = '';
  let escaped = false;

  for (let i = 0; i < position; i++) {
    if (escaped) {
      escaped = false;
      continue;
    }

    const char = code[i];
    if (char === '\\') {
      escaped = true;
    } else if (char === '"' || char === "'" || char === '`') {
      if (!inString) {
        inString = true;
        stringChar = char;
      } else if (char === stringChar) {
        inString = false;
      }
    }
  }

  return inString;
}

function calculateComplexity(
  code: string,
  config: LanguageConfig,
  nonEmptyLines: number
): number {
  let complexity = 0;
  let nestingLevel = 0;
  const lines = code.split('\n');

  // Base complexity from code size
  complexity += Math.log2(nonEmptyLines + 1) * 10;

  // Analyze each line
  lines.forEach(line => {
    const trimmedLine = line.trim();
    
    // Skip empty lines and full-line comments
    if (!trimmedLine || config.comments.some(comment => 
      trimmedLine.startsWith(comment.start))) {
      return;
    }

    // Track nesting level
    if (config.blockStart && trimmedLine.includes(config.blockStart)) {
      nestingLevel++;
      complexity += nestingLevel * 2;
    }
    if (config.blockEnd && trimmedLine.includes(config.blockEnd)) {
      nestingLevel = Math.max(0, nestingLevel - 1);
    }

    // Check for complexity keywords
    config.complexityKeywords.forEach(keyword => {
      // Use regex to match whole words only
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      const matches = trimmedLine.match(regex) || [];
      complexity += matches.length * (nestingLevel + 1) * 2;
    });

    // Additional complexity for logical operators
    const logicalOperators = (trimmedLine.match(/&&|\|\||[?:]/g) || []).length;
    complexity += logicalOperators * (nestingLevel + 1);
  });

  // Normalize complexity score to 0-100 range
  return Math.min(100, Math.max(0, Math.round(complexity)));
}

function countCommentLines(code: string, config: LanguageConfig): number {
  const lines = code.split('\n');
  let commentCount = 0;
  let inBlockComment = false;
  let currentBlockComment: CommentToken | null = null;

  lines.forEach(line => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return;

    // Continue counting if we're in a block comment
    if (inBlockComment) {
      commentCount++;
      if (currentBlockComment?.end && trimmedLine.includes(currentBlockComment.end)) {
        inBlockComment = false;
        currentBlockComment = null;
      }
      return;
    }

    // Check for new comments
    for (const comment of config.comments) {
      const startIndex = line.indexOf(comment.start);
      if (startIndex === -1 || isInString(line, startIndex)) continue;

      if (comment.isBlock) {
        inBlockComment = true;
        currentBlockComment = comment;
        commentCount++;
        if (comment.end && trimmedLine.includes(comment.end)) {
          inBlockComment = false;
          currentBlockComment = null;
        }
        break;
      } else {
        // Line comment
        commentCount++;
        break;
      }
    }
  });

  return commentCount;
}

function countFunctions(code: string, patterns: RegExp[]): number {
  const functionSet = new Set<string>();
  
  patterns.forEach(pattern => {
    const matches = code.match(pattern);
    if (matches) {
      matches.forEach(match => {
        // Skip if the match is inside a comment or string
        const startIndex = code.indexOf(match);
        if (!isInString(code, startIndex)) {
          functionSet.add(match.trim());
        }
      });
    }
  });

  return functionSet.size;
}

export function useCodeMetrics(code: string = '', language: string = 'javascript'): CodeMetrics {
  return useMemo(() => {
    const config = mergeConfig(language);
    const lines = code.split('\n');
    const nonEmptyLines = lines.filter(line => line.trim().length > 0).length;

    const metrics: CodeMetrics = {
      totalLines: lines.length,
      codeLines: nonEmptyLines,
      commentLines: countCommentLines(code, config),
      characters: code.length,
      functions: countFunctions(code, config.functionPatterns),
      complexity: calculateComplexity(code, config, nonEmptyLines)
    };

    return metrics;
  }, [code, language]);
}

export default useCodeMetrics;