import { useSession, useSessionImage } from "@/api";
import { cn } from "@/lib/utils";
import { useParams } from "react-router-dom";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CodeEditorSection } from "./components/CodeEditor";
import { CompilerOutput } from "./components/CompilerOutput";
import { LoadingState } from "./components/LoadingState";
import { TabView } from "./components/TabView";
// import { Language } from "@/types/types";
import { useCompiler } from "./hooks/useCompiler";
import { useImageProcessing } from "./hooks/useImageProcessing";
import { LanguageDrop } from "./components/LanguageDropdown";
import { supabase } from '@/supabaseClient';

const SessionDashboard = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const apiUrl = import.meta.env.VITE_API_URL;
  const queryClient = useQueryClient();

  // Session and Image Queries
  const {
    data: session,
    isLoading: isSessionLoading,
  } = useSession(sessionId!);

  const {
    data: sessionImage,
    isLoading: isImageLoading,
  } = useSessionImage(sessionId!);

  // Compiler State
  const {
    compilerOutput,
    isCompiling,
    isCompilerExpanded,
    setIsCompilerExpanded,
    compile
  } = useCompiler();

  // Image Processing
  const { imageUrl, isProcessing, error: processingError } = useImageProcessing({
    session,
    sessionImage,
  });

  // Session Update Mutation
  const updateSessionMutation = useMutation({
    mutationFn: async ({ field, value }: { field: string, value: any }) => {
      const { error } = await supabase
        .from('sessions')
        .update({ [field]: value })
        .eq('id', sessionId!);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions', sessionId] });
    },
    onError: (error) => {
      console.error('Error updating session:', error);
    }
  });

  // Tests Generation Mutation
  const generateTestsMutation = useMutation({
    mutationFn: async (code: string) => {
      if (!session?.language) throw new Error('No language selected');

      const response = await fetch(`${apiUrl}generatetests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language: session.language.toLowerCase(),
        }),
      });

      if (!response.ok) throw new Error('Failed to generate tests');
      return response.json();
    },
    onSuccess: async (data) => {
      await updateSessionMutation.mutateAsync({
        field: 'code',
        value: data.code
      });
    },
    onError: (error) => {
      console.error('Failed to generate tests:', error);
    }
  });

  // Event Handlers
  const handleCodeChange = async (code: string) => {
    await updateSessionMutation.mutateAsync({
      field: 'code',
      value: code
    });
  };

  const handleLanguageChange = async (language: LanguageDrop) => {
    await updateSessionMutation.mutateAsync({
      field: 'language',
      value: language.id
    });
  };

  const handleRunClick = () => {
    if (!session?.language) return;
    compile({
      code: session.code!,
      language: session.language
    });
  };

  const handleMakeTests = () => {
    if (!session?.code) return;
    generateTestsMutation.mutate(session.code);
  };

  // Loading States
  if (isSessionLoading || isImageLoading) {
    return <LoadingState />;
  }

  // Error States
  if (processingError) {
    console.error('Image processing error:', processingError);
    // You might want to show an error UI here
  }

  return (
    <div className="flex flex-col h-full">
      <div className={cn(
        "grid grid-cols-2 divide-x divide-gray-200 transition-all duration-200",
        isCompilerExpanded ? 'h-[calc(100%-300px)]' : 'h-[calc(100%-40px)]'
      )}>
        <div className="flex flex-col h-full">
          <div className="flex-1 min-h-0 overflow-hidden">
            <TabView
              imageUrl={imageUrl}
              problemStatement={"MOCK DATA"}
            />
          </div>
        </div>
        <div className="h-full overflow-hidden">
          <CodeEditorSection
            handleLanguageSelect={handleLanguageChange}
            language={session?.language!}
            code={session?.code || ''}
            isCompiling={isCompiling || isProcessing}
            onCodeChange={handleCodeChange}
            onRun={handleRunClick}
            makeTests={handleMakeTests}
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