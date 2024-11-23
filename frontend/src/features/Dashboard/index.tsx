import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from "@/components/ui/skeleton"
import CodeEditor from '@/components/CodeEditor/CodeEditor';
import { useState, useEffect } from 'react';
import CompilerCode from '@/components/CompileCode/CompileCode';
import { useParams } from 'react-router-dom';
import { useSession, useSessionImage, useUpdateSession } from '@/api';
import { supabase } from '@/supabaseClient';

const SessionDashboard = () => {
    const { sessionId } = useParams<{ sessionId: string }>();
    // TODO - Validate as UUID before Proceeding

    // TODO - Try to fetch session. If returns null, then redirect to home.    
    
    const { data: session, isLoading: isSessionLoading } = useSession(sessionId!);
    const { data: sessionImage, isLoading: isImageLoading } = useSessionImage(sessionId!);
    const updateSession = useUpdateSession(sessionId!);


    const [editorCode, setEditorCode] = useState<string>("");
    const [compilerOutput, setCompilerOutput] = useState<string>("");
    const [isCompiling, setIsCompiling] = useState<boolean>(false);
    const [imageUrl, setImageUrl] = useState<string>("");

    useEffect(() => {
        if (session?.detected_code) {
            setEditorCode(session.detected_code);
        }
        if (session?.compilation_output) {
            setCompilerOutput(session.compilation_output);
        }
    }, [session]);

    useEffect(() => {
        const getSignedUrl = async () => {
            if (sessionImage && session?.user_id) {
                const filePath = `${session.user_id}/${sessionImage.id}.png`;

                const { data, error } = await supabase
                    .storage
                    .from('code-images')
                    .createSignedUrl(filePath, 3600); // 1 hour expiry

                // console.log(JSON.stringify({ img_url: data!.signedUrl + '.png' }));
                if (session?.detected_code == null) {
                    fetch('http://localhost:3000/api/imgtocode', {
                        method: 'POST', body: JSON.stringify({ img_url: data!.signedUrl }), headers: {
                            "Content-Type": "application/json",

                        }
                    }).then((response) => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        return response.json(); // Parse the response as JSON
                    })
                        .then((data) => {
                            console.log(data); // Response JSON

                            // Update DB
                            updateSession.mutateAsync({
                                detected_code: data.code, // Set the detected code
                                code: data.code,         // Initialize editor code with detected code
                                language: data.language  // Update language if provided by API
                            });

                            setEditorCode(data.code); // Use the 'code' field from the response
                        })
                }

                if (error) {
                    console.error('Error getting signed URL:', error);
                    return;
                }

                if (data?.signedUrl) {
                    setImageUrl(data.signedUrl);
                }
            }
        };

        getSignedUrl();
    }, [sessionImage, session]);


    const handleCodeChange = (newCode: string) => {
        setEditorCode(newCode || "");
    };

    const handleRunClick = async () => {
        setIsCompiling(true);
        try {
            const response = await fetch('http://127.0.0.1:5001/api/compile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code: editorCode,
                    language: session?.language || 'python',
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setCompilerOutput(data.stdout || "No output");
            } else {
                setCompilerOutput(data.stderr || "Compilation error occurred");
            }
        } catch (error) {
            console.error('Error occurred while compiling:', error);
            setCompilerOutput("An error occurred while compiling.");
        } finally {
            setIsCompiling(false);
        }
    };

    if (isSessionLoading || isImageLoading) {
        return (
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <Skeleton className="w-full h-[300px] rounded-lg" />
                        </CardHeader>
                    </Card>

                    <Card>
                        <CardContent>
                            <Skeleton className="w-full h-[200px]" />
                        </CardContent>
                    </Card>
                </div>

                <Card className="h-full">
                    <CardHeader className="flex flex-row items-center justify-between border-b">
                        <Skeleton className="h-4 w-[100px]" />
                        <Skeleton className="h-10 w-[100px]" />
                    </CardHeader>
                    <CardContent className="p-0">
                        <Skeleton className="w-full h-[500px]" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-6">
            <div className="space-y-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        {imageUrl && (
                            <div className="w-full h-full">
                                <img
                                    src={imageUrl}
                                    alt="Code"
                                    className="w-full h-auto object-contain rounded-lg"
                                />
                            </div>
                        )}
                    </CardHeader>
                </Card>

                <Card>
                    <CardContent>
                        <CompilerCode compilerOutput={compilerOutput} />
                    </CardContent>
                </Card>
            </div>

            <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between border-b">
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">main.{session?.language?.toLowerCase() || 'c'}</span>
                    </div>
                    <div style={{ width: '15%', padding: '20px' }}>
                        <Button
                            variant="outline"
                            onClick={handleRunClick}
                            disabled={isCompiling}
                            style={{ fontSize: '16px' }}
                        >
                            {isCompiling ? "Compiling..." : "Run"}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <CodeEditor
                        language={session?.language?.toLowerCase() || 'c'}
                        code={editorCode}
                        onChange={handleCodeChange}
                    />
                </CardContent>
            </Card>
        </div>
    );
};

export default SessionDashboard;