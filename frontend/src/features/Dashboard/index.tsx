import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateSession, useSession, useSessionImage } from '@/api';
import { supabase } from '@/supabaseClient';
import { LoadingState } from './components/LoadingState';
import { CompilerOutput } from './components/CompilerOutput';
import { CodeEditorSection } from './components/CodeEditor';
import { TabView } from './components/TabView';
import { cn } from '@/lib/utils';

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
  const [isCompilerExpanded, setIsCompilerExpanded] = useState(true);

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
        await updateSessionMutation.mutateAsync(data.code);
        setEditorCode(data.code);
      } catch (error) {
        console.error('Error processing image:', error);
      }
    };

    processImage();
  }, [imageUrl, sessionId, session?.status, updateSessionMutation]);

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
      if (!(data.stdout == "")) {
        setCompilerOutput(data.stdout|| "No output");
      } else {

        const commaIndex = data.stderr.indexOf(","); // Find the position of the first comma
        const rest = commaIndex !== -1 ? data.stderr.substring(commaIndex + 1).trim() : "";

        setCompilerOutput( rest.trim() || "Compilation error occurred");
      }
    } catch (error) {
      console.error('Error occurred while compiling:', error);
      setCompilerOutput("An error occurred while compiling.");
    } finally {
      setIsCompiling(false);
    }
  };

  if (isSessionLoading || isImageLoading) {
    return <LoadingState />;
  }
  const getMainContentHeight = () => {
    return isCompilerExpanded ? 'h-[calc(100%-300px)]' : 'h-[calc(100%-40px)]';
  };

  return (
    <div className="flex flex-col h-full">
      {/* Main content area */}
      <div className={cn(
        "grid grid-cols-2 divide-x divide-neutral-800 transition-all duration-200",
        getMainContentHeight()
      )}>
        <div className="flex flex-col h-full">
          <div className="flex-1 min-h-0 overflow-hidden">
            <TabView imageUrl={imageUrl} problemStatement={"MOCK DATA"} />
          </div>
        </div>

        <div className="h-full overflow-hidden">
          <CodeEditorSection
            language={session?.language?.toLowerCase() || 'python'}
            code={editorCode}
            isCompiling={isCompiling}
            onCodeChange={setEditorCode}
            onRun={handleRunClick}
          />
        </div>
      </div>

      <CompilerOutput
        output={compilerOutput}
        isExpanded={isCompilerExpanded}
        onToggle={() => setIsCompilerExpanded(!isCompilerExpanded)}
      />
    </div>
  );
};

export default SessionDashboard;