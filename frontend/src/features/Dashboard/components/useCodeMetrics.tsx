import { useMemo } from 'react';

interface LanguagePatterns {
  lineComments: string[];
  blockCommentStart: string;
  blockCommentEnd: string;
  functionPatterns: RegExp[];
}

const languageConfigs: Record<string, LanguagePatterns> = {
  python: {
    lineComments: ['#'],
    blockCommentStart: '"""',
    blockCommentEnd: '"""',
    functionPatterns: [
      /def\s+\w+\s*\([^)]*\)/g,
      /lambda\s+[^:]+:/g
    ]
  },
  java: {
    lineComments: ['//'],
    blockCommentStart: '/*',
    blockCommentEnd: '*/',
    functionPatterns: [
      /(?:public|private|protected|static|\s) +[\w\<\>\[\]]+\s+(\w+) *\([^)]*\) *\{?/g,
      /\w+\s*\([^)]*\)\s*{/g
    ]
  },
  c: {
    lineComments: ['//'],
    blockCommentStart: '/*',
    blockCommentEnd: '*/',
    functionPatterns: [
      /\w+\s+\w+\s*\([^)]*\)\s*{/g,
      /\w+\s*\([^)]*\)\s*{/g
    ]
  },
  bash: {
    lineComments: ['#'],
    blockCommentStart: ':<<',
    blockCommentEnd: '',
    functionPatterns: [
      /function\s+\w+\s*\(\)/g,
      /\w+\s*\(\)\s*{/g
    ]
  }
};

const useCodeMetrics = (code: string = '', language: string) => {
  return useMemo(() => {
    if (!language){ return; }
    const config = languageConfigs[language.toLowerCase()] || languageConfigs.python;
    const lines = code.split('\n');

    // Count non-empty lines
    const nonEmptyLines = lines.filter(line => line.trim().length > 0);

    // Count comment lines, including inline comments
    let inBlockComment = false;
    const commentLines = lines.filter(line => {
      const trimmed = line.trim();

      // Handle line comments (either standalone or inline)
      const isLineComment = config.lineComments.some(comment => trimmed.includes(comment));
      if (isLineComment) {
        const commentStartIndex = trimmed.indexOf(config.lineComments[0]);

        // Detect if it's a standalone comment or inline comment
        if (commentStartIndex === 0 || trimmed.slice(0, commentStartIndex).trim().length > 0) {
          return true; // Comment could either be standalone or inline
        }
      }

      // Handle block comments, including multi-line
      if (inBlockComment) {
        if (trimmed.endsWith(config.blockCommentEnd)) {
          inBlockComment = false;
        }
        return true;
      }

      // Detect the start of block comments
      if (trimmed.startsWith(config.blockCommentStart)) {
        inBlockComment = true;
        return true;
      }

      // Check for inline block comments (e.g., "code /* comment */ more code")
      const inlineCommentStart = trimmed.indexOf(config.blockCommentStart);
      if (inlineCommentStart !== -1) {
        return true; // Handle inline block comment
      }

      return false;
    });

    // Count functions
    const functionMatches = config.functionPatterns.reduce((acc, pattern) => {
      const matches = code.match(pattern) || [];
      return acc.concat(matches);
    }, [] as string[]);

    // Improved complexity score calculation
    let complexityScore = 0;
    let nestingDepth = 0;

    const increaseComplexityForNesting = (keyword: string, depth: number) => {
      // Increase complexity more for deeper nesting levels
      complexityScore += depth * 2; // Deeper nesting adds more complexity
    };

    // Iterate through the lines and calculate the nesting for key keywords
    const keywords = ['if', 'for', 'while', 'try', 'switch', 'case', 'elif', 'elsif', '&&', '||'];
    const nestedKeywords = ['if', 'for', 'while']; // Track nesting for these structures

    lines.forEach(line => {
      const trimmed = line.trim();

      // Check for nesting of keywords
      nestedKeywords.forEach(keyword => {
        if (trimmed.includes(keyword)) {
          nestingDepth += 1; // Increase depth when a nested structure is found
          increaseComplexityForNesting(keyword, nestingDepth);
        }
      });

      // Check for closing of structures to reduce nesting depth
      if (trimmed.includes('}') || trimmed.includes('end')) {
        nestingDepth = Math.max(0, nestingDepth - 1); // Reduce nesting depth on closing braces or end statements
      }
    });

    // Basic complexity additions based on occurrences of keywords
    complexityScore += (nonEmptyLines.length * 2); // Number of non-empty lines
    complexityScore += (code.split('if').length * 3);
    complexityScore += (code.split('for').length * 4);
    complexityScore += (code.split('while').length * 4);
    complexityScore += (code.split('try').length * 2);
    complexityScore += (code.split('switch').length * 3); // Added for C/Java
    complexityScore += (code.split('case').length * 2);   // Added for C/Java
    complexityScore += (code.split('elif').length * 3);   // For Python
    complexityScore += (code.split('elsif').length * 3);  // For Bash
    complexityScore += (code.split('&&').length * 1);     // For Bash/C/Java
    complexityScore += (code.split('||').length * 1);     // For Bash/C/Java

    // Clamp the complexity score to a reasonable range
    complexityScore = Math.min(100, complexityScore);

    return {
      totalLines: lines.length,
      codeLines: nonEmptyLines.length,
      commentLines: commentLines.length,
      characters: code.length,
      functions: new Set(functionMatches).size, // Use Set to avoid counting duplicates
      complexity: complexityScore
    };
  }, [code, language]);
};

export default useCodeMetrics;
