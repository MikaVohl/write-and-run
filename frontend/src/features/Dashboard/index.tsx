import { useSession, useSessionImage } from "@/api";
import { cn } from "@/lib/utils";
import { useParams } from "react-router-dom";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CodeEditorSection } from "./components/CodeEditor";
import { CompilerOutput } from "./components/CompilerOutput";
import { TabView } from "./components/TabView";
import { useCompiler } from "./hooks/useCompiler";
import { useImageProcessing } from "./hooks/useImageProcessing";
import { LanguageDrop } from "./components/LanguageDropdown";
import { supabase } from '@/supabaseClient';
import { Loader2 } from "lucide-react";
import { useTestsGeneration } from "./hooks/useTestGeneration";
import { useEffect, useState } from "react";

const SessionDashboard = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const apiUrl = import.meta.env.VITE_API_URL;
  const queryClient = useQueryClient();
  const [localCode, setLocalCode] = useState<string>('');

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

  const updateCode = async (newCode: string) => {
    setLocalCode(newCode);
    await updateSessionMutation.mutateAsync({
      field: 'code',
      value: newCode
    });
  };

  // Test gen
  const {
    generateTests,
    isGeneratingTests,
  } = useTestsGeneration({
    sessionId: sessionId!,
    apiUrl,
    onSuccess: async (newCode: string) => {
      await updateCode(newCode);
    }
  });

  // Image Processing
  const { imageUrl, isProcessing } = useImageProcessing({
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
      console.log('invalidating the query')
      queryClient.invalidateQueries({ queryKey: ['sessions', sessionId] });
    },
    onError: (error) => {
      console.error('Error updating session:', error);
    }
  });

  const handleLanguageChange = async (language: LanguageDrop) => {
    await updateSessionMutation.mutateAsync({
      field: 'language',
      value: language.id
    });
  };

  useEffect(() => {
    if (session?.code) {
      setLocalCode(session.code);
    }
  }, [session?.code]);

  const handleCodeChange = (newCode: string) => {
    setLocalCode(newCode);
  };

  const handleRunClick = async () => {
    if (!session?.language) return;

    // Update both local and DB
    await updateCode(localCode);

    // Run the compilation
    compile({
      code: localCode,
      language: session.language
    });
  };

  const handleMakeTests = () => {
    if (!localCode || !session?.language) return;
    generateTests(localCode, session.language);
  };

  // Loading States
  if (isSessionLoading || isImageLoading) {
    return <></>;
  }

  const showProcessingOverlay = isProcessing ||
    session?.status === 'pending' ||
    isGeneratingTests;


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
          {showProcessingOverlay ? (
            <div className="relative h-full">
              <div className="absolute inset-0 bg-white/80 dark:bg-neutral-900/80 z-50 flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {isGeneratingTests
                    ? "Generating tests..."
                    : "Processing image and detecting code..."
                  }
                </p>
              </div>
              <CodeEditorSection
                handleLanguageSelect={handleLanguageChange}
                language={session?.language!}
                code={localCode}
                isCompiling={isCompiling}
                onCodeChange={handleCodeChange}
                onRun={handleRunClick}
                makeTests={handleMakeTests}
              />
            </div>
          ) : (
            <CodeEditorSection
              handleLanguageSelect={handleLanguageChange}
              language={session?.language!}
              code={localCode}
              isCompiling={isCompiling}
              onCodeChange={handleCodeChange}
              onRun={handleRunClick}
              makeTests={handleMakeTests}
            />
          )}
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