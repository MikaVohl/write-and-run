import { Button } from '@/components/ui/button';
import CodeEditor from '@/components/CodeEditor/CodeEditor';

interface CodeEditorSectionProps {
    language: string;
    code: string;
    isCompiling: boolean;
    onCodeChange: (code: string) => void;
    onRun: () => void;
    makeTests: () => void;
}

export const CodeEditorSection = ({
    language,
    code,
    isCompiling,
    onCodeChange,
    onRun,
    makeTests
}: CodeEditorSectionProps) => {
    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-4 py-2 border-b bg-white dark:bg-neutral-900">
                <span className="text-sm text-neutral-500">{language.toLowerCase()}</span>
                <div className="flex gap-2">
                    <Button
                        onClick={onRun}
                        disabled={isCompiling}
                        className="bg-green-600 hover:bg-green-700 text-white"
                        size="sm"
                    >
                        Run
                    </Button>
                    <Button
                        onClick={makeTests}
                        variant="outline"
                        size="sm"
                    >
                        Generate Tests
                    </Button>
                </div>
            </div>
            <div className="flex-1">
                <CodeEditor
                    language={language}
                    code={code}
                    onChange={onCodeChange}
                />
            </div>
        </div>
    );
};