import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import CompilerCode from '@/components/CompileCode/CompileCode';

interface CompilerOutputProps {
    output: string;
    isExpanded: boolean;
    onToggle: () => void;
}

export const CompilerOutput = ({ output, isExpanded, onToggle }: CompilerOutputProps) => {
    return (
        <div className={cn(
            "flex flex-col h-full bg-neutral-100",
            "transition-all duration-200"
        )}>
            <div className="flex-none flex items-center justify-between px-4 py-2 border-b border-neutral-200">
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={onToggle}
                    >
                        {isExpanded ?
                            <ChevronDown className="h-4 w-4" /> :
                            <ChevronUp className="h-4 w-4" />
                        }
                    </Button>
                    <span className="text-sm font-medium text-neutral-600">
                        Compiler output
                    </span>
                </div>
            </div>

            {isExpanded && (
                <div className="flex-1 min-h-0 overflow-auto">
                    <CompilerCode compilerOutput={output} />
                </div>
            )}
        </div>
    );
};