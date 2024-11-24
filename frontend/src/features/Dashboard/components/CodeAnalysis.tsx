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

import useCodeMetrics from "./useCodeMetrics";

interface CodeAnalysisProps {
    code?: string;
    language?: string;
    analysis?: string;
}

interface MetricItem {
    icon: any;
    label: string;
    value: string | number;
}

export const CodeAnalysis = ({ code = '', language = '' , analysis}: CodeAnalysisProps) => {
    const stats = useCodeMetrics(code, language);

    const metrics: MetricItem[] = [
        { icon: FileCode, label: "Total Lines", value: stats.totalLines },
        { icon: Code, label: "Code Lines", value: stats.codeLines },
        { icon: Hash, label: "Comments", value: stats.commentLines },
        { icon: LucideGitCommit, label: "Functions", value: stats.functions },
        { icon: Braces, label: "Characters", value: stats.characters },
        { icon: BarChart, label: "Complexity", value: `${stats.complexity}/100` }
    ];

    return (
        <div>
        <h2 className="text-2xl font-bold  p-6  font-medium">Code Analysis</h2>
        <div  className="gap-4 p-6  font-medium">{analysis}</div>
        
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 p-6 ">

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

        </div>
    );
};