import { Button } from '@/components/ui/button';
import CodeEditor from '@/components/CodeEditor/CodeEditor';
import LanguageDropdown from './LanguageDropdown';
import { LanguageDrop } from './LanguageDropdown';


interface CodeEditorSectionProps {
    language: string;
    code: string;
    isCompiling: boolean;
    handleLanguageSelect: (language: LanguageDrop) => void;
    onCodeChange: (code: string) => void;
    onRun: () => void;
    makeTests: () => void;
}


export const CodeEditorSection = ({
    language,
    code,
    handleLanguageSelect,
    isCompiling,
    onCodeChange,
    onRun,
    makeTests
}: CodeEditorSectionProps) => {

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-4 min-h-[3.5rem] py-2 border-b bg-white dark:bg-neutral-900">
                <LanguageDropdown language={language} onSelect={handleLanguageSelect}/>
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
                        disabled={isCompiling}
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