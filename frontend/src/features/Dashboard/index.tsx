import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Maximize2, RotateCcw, Share2 } from 'lucide-react';

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
    return (
        <div className="">
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Your Upload</CardTitle>
                            <div className="flex gap-2">
                                <Button variant="outline" size="icon">
                                    <Maximize2 className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="icon">
                                    <RotateCcw className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="icon">
                                    <Share2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                                <img
                                    src={imageUrl}
                                    alt="Original code"
                                    className="w-full object-cover"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Output</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <pre className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm whitespace-pre-wrap">
                                {output}
                            </pre>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Detected Code */}
                <Card className="h-full">
                    <CardHeader className="flex flex-row items-center justify-between border-b">
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">main.c</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button variant="outline" size="icon">
                                <Maximize2 className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon">
                                <Share2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <pre className="p-4 font-mono text-sm">
                            <code className="language-c">{detectedCode}</code>
                        </pre>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default SessionDashboard;