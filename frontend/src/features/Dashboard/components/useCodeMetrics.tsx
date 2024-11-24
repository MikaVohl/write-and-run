
import { useMemo } from 'react';

const useCodeMetrics = (code: string = '', language: string) => {
    return useMemo(() => {
        const lines = code.split('\n');
        const nonEmptyLines = lines.filter(line => line.trim().length > 0);
        const commentLines = lines.filter(line => {
            const trimmed = line.trim();
            return (
                trimmed.startsWith('//') ||
                trimmed.startsWith('#') ||
                trimmed.startsWith('/*') ||
                trimmed.startsWith('*')
            );
        });

        const complexityScore = Math.min(100, Math.round(
            (nonEmptyLines.length * 2) +
            (code.split('if').length * 3) +
            (code.split('for').length * 4) +
            (code.split('while').length * 4) +
            (code.split('try').length * 2)
        ));

        return {
            totalLines: lines.length,
            codeLines: nonEmptyLines.length,
            commentLines: commentLines.length,
            characters: code.length,
            functions: (code.match(/function|def|\w+\s*\([^)]*\)\s*{/g) || []).length,
            complexity: complexityScore
        };
    }, [code]);
};

export default useCodeMetrics;