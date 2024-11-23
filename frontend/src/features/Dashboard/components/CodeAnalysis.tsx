import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
    Code,
    Hash,
    FileCode,
    LucideGitCommit,
    Braces,
    BarChart
} from "lucide-react";

interface CodeAnalysisProps {
    code?: string;
    language?: string;
}

interface MetricItem {
    icon: any;
    label: string;
    value: string | number;
}

const useCodeMetrics = (code: string = '') => {
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

export const CodeAnalysis = ({ code = '', language = '' }: CodeAnalysisProps) => {
    const stats = useCodeMetrics(code);

    const metrics: MetricItem[] = [
        { icon: FileCode, label: "Total Lines", value: stats.totalLines },
        { icon: Code, label: "Code Lines", value: stats.codeLines },
        { icon: Hash, label: "Comments", value: stats.commentLines },
        { icon: LucideGitCommit, label: "Functions", value: stats.functions },
        { icon: Braces, label: "Characters", value: stats.characters },
        { icon: BarChart, label: "Complexity", value: `${stats.complexity}/100` }
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {metrics.map((metric, index) => (
                <Card key={index} className="bg-white dark:bg-neutral-900">
                    <CardContent className="pt-6">
                        <div className="flex flex-col space-y-2">
                            <div className="flex items-center space-x-2 text-neutral-500">
                                <metric.icon className="h-4 w-4" />
                                <span className="text-sm font-medium">{metric.label}</span>
                            </div>
                            <span className="text-2xl font-bold">{metric.value}</span>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};