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
    const config = languageConfigs[language.toLowerCase()] || languageConfigs.python;
    const lines = code.split('\n');
    
    // Count non-empty lines
    const nonEmptyLines = lines.filter(line => line.trim().length > 0);
    
    // Count comment lines
    const commentLines = lines.filter(line => {
      const trimmed = line.trim();
      
      // Check for line comments
      if (config.lineComments.some(comment => trimmed.startsWith(comment))) {
        return true;
      }
      
      // Check for block comments
      if (trimmed.startsWith(config.blockCommentStart) || 
          trimmed.startsWith('*') || 
          trimmed.endsWith(config.blockCommentEnd)) {
        return true;
      }
      
      return false;
    });
    
    // Count functions
    const functionMatches = config.functionPatterns.reduce((acc, pattern) => {
      const matches = code.match(pattern) || [];
      return acc.concat(matches);
    }, [] as string[]);
    
    // Calculate complexity score
    const complexityScore = Math.min(100, Math.round(
      (nonEmptyLines.length * 2) +
      (code.split('if').length * 3) +
      (code.split('for').length * 4) +
      (code.split('while').length * 4) +
      (code.split('try').length * 2) +
      (code.split('switch').length * 3) + // Added for C/Java
      (code.split('case').length * 2) +   // Added for C/Java
      (code.split('elif').length * 3) +   // For Python
      (code.split('elsif').length * 3) +  // For Bash
      (code.split('&&').length * 1) +     // For Bash/C/Java
      (code.split('||').length * 1)       // For Bash/C/Java
    ));

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