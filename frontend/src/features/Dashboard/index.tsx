import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    const [editorCode, setEditorCode] = useState<string>("")
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
                            <CompilerCode compilerOutput={output} />
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
                            <button style={{ fontSize: '16px' }}>
                                Run
                            </button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <CodeEditor
                            language="c"
                            code={editorCode}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default SessionDashboard;