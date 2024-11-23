import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Maximize2, RotateCcw, Share2 } from 'lucide-react';
import CodeEditor from '@/components/CodeEditor/CodeEditor';
import { useState } from 'react';
import CompilerCode from '@/components/CompileCode/CompileCode';
import Uploader from '@/components/Uploader/Uploader';

interface SessionDashboardProps {
    imageUrl?: string;
    detectedCode?: string;
    output?: string;
}

const SessionDashboard = ({
    imageUrl = '',
    detectedCode = `// Online C compiler to run C program online
#include <stdio.h>
int main() {
    // Write C code here
    printf("Try programiz.pro");
    return 0;
}`,
    output = "Hello World\n\n=== Code Execution Successful ==="
}) => {
    const [editorCode, setEditorCode] = useState<string>(detectedCode || ""); // Fallback to empty string if detectedCode is undefined
    const [compilerOutput, setCompilerOutput] = useState<string>(output); // initial compiler output
    const [isCompiling, setIsCompiling] = useState<boolean>(false); // to track compilation state

    // New function to handle code updates explicitly
    const handleCodeChange = (newCode: string) => {
        // Fallback to empty string if newCode is undefined or null
        setEditorCode(newCode || "");
    };

    const handleRunClick = async () => {
        setIsCompiling(true); // Set compiling state to true while waiting for the response
        try {
            // Make API call to compile and run the code
            const response = await fetch('http://127.0.0.1:5001/api/compile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code: editorCode,
                    language: 'python', // specify language, adjust based on user input if needed
                }),
            });

            const data = await response.json();
            if (response.ok) {
                // If successful, update the compiler output with the stdout
                setCompilerOutput(data.stdout || "No output");
            } else {
                // If error in compilation, set stderr as output
                setCompilerOutput(data.stderr || "Compilation error occurred");
            }
        } catch (error) {
            console.error('Error occurred while compiling:', error);
            setCompilerOutput("An error occurred while compiling.");
        } finally {
            setIsCompiling(false); // Reset compiling state
        }
    };

    return (
        <div className="">
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <Uploader />
                        </CardHeader>
                    </Card>

                    <Card>
                        <CardContent>
                            <CompilerCode compilerOutput={compilerOutput} />
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Detected Code */}
                <Card className="h-full">
                    <CardHeader className="flex flex-row items-center justify-between border-b">
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">main.c</span>
                        </div>
                        <div style={{ width: '5%', padding: '20px' }}>
                            <Button
                                variant="outline"
                                onClick={handleRunClick}
                                disabled={isCompiling} // Disable button while compiling
                                style={{ fontSize: '16px' }}
                            >
                                {isCompiling ? "Compiling..." : "Run"}
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <CodeEditor
                            language="c"
                            code={editorCode}
                            onChange={handleCodeChange} // Now works properly with the updated CodeEditor component
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default SessionDashboard;
