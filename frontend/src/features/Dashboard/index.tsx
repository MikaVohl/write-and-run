import { useSession, useSessionImage } from "@/api";
import { cn } from "@/lib/utils";
import { Navigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CodeEditorSection } from "./components/CodeEditor";
import { CompilerOutput } from "./components/CompilerOutput";
import { TabView } from "./components/TabView";
import { useCompiler } from "./hooks/useCompiler";
import { useImageProcessing } from "./hooks/useImageProcessing";
import { LanguageDrop } from "./components/LanguageDropdown";
import { supabase } from '@/supabaseClient';
import { useTestsGeneration } from "./hooks/useTestGeneration";
import { useEffect, useState } from "react";
import { Language } from "@/types/types";
import LoadingAnimation from "@/components/LoadingAnimation";
import { useNavigate } from 'react-router-dom';
import { useErrorToast } from "@/components/ErrorToast";

const SessionDashboard = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  const queryClient = useQueryClient();
  const [localCode, setLocalCode] = useState<string>('');
  const { showError } = useErrorToast();

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
    onSuccess: async (newCode: string, reason: string, status: number) => {
      if (newCode === '' || status != 1) {
        showError(reason);
        return;
      }
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
    if (!isSessionLoading && !session) {
      navigate('/home');
    }

    if (session?.code) {
      setLocalCode(session.code);
    }
  }, [session?.code, isSessionLoading]);

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
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Main split view */}
      <div className="flex-1 min-h-0 grid grid-cols-10 divide-x divide-gray-200">
        {/* Left Panel - Document Viewer */}
        <div className="h-full col-span-4 overflow-hidden">
          <TabView
            className="h-full"
            imageUrl={imageUrl}
            code={localCode}
            language={session?.language as Language}
            prompt={session?.prompt!}
            analysis={session?.analysis!}
            status={session?.status!}
          />
        </div>

        <div className="h-full col-span-6 overflow-hidden flex flex-col">
          <div className="relative flex-1 min-h-0">
            {showProcessingOverlay && (
              <div className="absolute inset-0 bg-white/80 dark:bg-neutral-900/80 z-50 flex flex-col items-center justify-center gap-4">
                <LoadingAnimation />
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {isGeneratingTests
                    ? "Generating tests..."
                    : "Processing image and detecting code..."
                  }
                </p>
              </div>
            )}
            <CodeEditorSection
              handleLanguageSelect={handleLanguageChange}
              language={session?.language || ''}
              code={localCode}
              isCompiling={isCompiling}
              onCodeChange={handleCodeChange}
              onRun={handleRunClick}
              makeTests={handleMakeTests}
            />
          </div>
        </div>
      </div>

      {/* Compiler Output - Fixed to bottom */}
      <div className={cn(
        "w-full border-t border-gray-200",
        isCompilerExpanded ? 'h-80' : 'h-10'
      )}>
        <CompilerOutput
          output={compilerOutput}
          isExpanded={isCompilerExpanded}
          onToggle={() => setIsCompilerExpanded(!isCompilerExpanded)}
        />
      </div>
    </div>
  );
};

export default SessionDashboard;