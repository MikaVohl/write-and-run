import { ChevronDown, ChevronUp, X } from 'lucide-react';
import CompilerCode from '@/components/CompileCode/CompileCode';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CompilerOutputProps {
    output: string;
    isExpanded: boolean;
    onToggle: () => void;
}

export const CompilerOutput = ({ output, isExpanded, onToggle }: CompilerOutputProps) => {
    return (
        <div className={cn(
            "border-t border-neutral-800 bg-neutral-100 transition-all duration-200",
            isExpanded ? "h-[300px]" : "h-[40px]"
        )}>
            <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-800">
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
                    <span className="text-sm text-neutral-400 font-mono">Compiler output</span>
                </div>
            </div>
            {isExpanded && (
                <div className="h-[calc(100%-40px)]">
                    <CompilerCode compilerOutput={output} />
                </div>
            )}
        </div>
    );
};
