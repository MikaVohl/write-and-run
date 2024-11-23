import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from "@/components/ui/skeleton";
import CodeEditor from '@/components/CodeEditor/CodeEditor';
import { useState, useEffect } from 'react';
import CompilerCode from '@/components/CompileCode/CompileCode';
import { useParams } from 'react-router-dom';
import { updateSession, useSession, useSessionImage } from '@/api';
import { supabase } from '@/supabaseClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UpdateSessionInput {
  id: string;
  detected_code?: string;
  code?: string;
  language?: string;
  status?: 'pending' | 'processing' | 'completed' | 'failed';
}

const SessionDashboard = () => {
  const queryClient = useQueryClient();
  const { sessionId } = useParams<{ sessionId: string }>();
  const { data: session, isLoading: isSessionLoading } = useSession(sessionId!);
  const { data: sessionImage, isLoading: isImageLoading } = useSessionImage(sessionId!);

  const [editorCode, setEditorCode] = useState<string>("");
  const [compilerOutput, setCompilerOutput] = useState<string>("");
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  const updateSessionMutation = useMutation({
    mutationFn: (code: string) => {
      const updateData: UpdateSessionInput = {
        id: sessionId!,
        detected_code: code,
        code: code,
        status: 'completed'
      };
      return updateSession(updateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions', sessionId] });
    },
  });

  useEffect(() => {
    if (session?.code) {
      setEditorCode(session.code);
    }
    if (session?.compilation_output) {
      setCompilerOutput(session.compilation_output);
    }
  }, [session]);

  useEffect(() => {
    const getSignedUrl = async () => {
      if (!sessionImage || !session?.user_id) return;

      const filePath = `${session.user_id}/${sessionImage.id}.${sessionImage.ext}`;
      const { data: urlData, error: urlError } = await supabase
        .storage
        .from('code-images')
        .createSignedUrl(filePath, 3600);

      if (urlError) {
        console.error('Error getting signed URL:', urlError);
        return;
      }

      if (urlData?.signedUrl) {
        setImageUrl(urlData.signedUrl);
      }
    };

    getSignedUrl();
  }, [sessionImage, session?.user_id]);

  useEffect(() => {
    const processImage = async () => {
      if (!imageUrl || !sessionId || session?.status !== 'pending') return;

      try {
        const response = await fetch('http://localhost:3000/api/imgtocode', {
          method: 'POST',
          body: JSON.stringify({ img_url: imageUrl }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Updated to pass the code to the mutation
        await updateSessionMutation.mutateAsync(data.code);
        setEditorCode(data.code);
      } catch (error) {
        console.error('Error processing image:', error);
      }
    };

    processImage();
  }, [imageUrl, sessionId, session?.status, updateSessionMutation]);

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

            <Card className="flex flex-col h-full">
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
                <CardContent className="p-0 flex-1">
                    <CodeEditor
                        language={session?.language?.toLowerCase() || 'python'}
                        code={editorCode}
                        onChange={handleCodeChange}
                    />
                </CardContent>
            </Card>
        </div>
    );
};

export default SessionDashboard;