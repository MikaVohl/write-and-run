import { useSession, useSessionImage } from "@/api";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { CodeEditorSection } from "./components/CodeEditor";
import { CompilerOutput } from "./components/CompilerOutput";
import { LoadingState } from "./components/LoadingState";
import { TabView } from "./components/TabView";
import { useSessionManager } from "./hooks/useSessionManager";
import { Language } from "@/types/types";
import { useCompiler } from "./hooks/useCompiler";
import { useImageProcessing } from "./hooks/useImageProcessing";
import { useTestGeneration } from "./hooks/useTestGeneration";
import { LanguageDrop } from "./components/LanguageDropdown";

const SessionDashboard = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const apiUrl = import.meta.env.VITE_API_URL;

  const {
    data: session,
    isLoading: isSessionLoading,
    error: sessionError
  } = useSession(sessionId!);

  const {
    data: sessionImage,
    isLoading: isImageLoading,
    error: imageError
  } = useSessionImage(sessionId!);

  const {
    editorCode,
    setEditorCode,
    updateSession
  } = useSessionManager(sessionId!);

  const {
    compilerOutput,
    isCompiling,
    isCompilerExpanded,
    setIsCompilerExpanded,
    compile
  } = useCompiler();

  const { imageUrl } = useImageProcessing({
    session,
    sessionImage,
    onCodeDetected: setEditorCode,
    onUpdateSession: updateSession
  });

  const { generateTests } = useTestGeneration({
    apiUrl,
    onNewCode: setEditorCode
  });

  // Effects
  useEffect(() => {
    if (session?.code && !editorCode) {
        console.log('Setting editor code:', session.code);
      setEditorCode(session.code);
    }
  }, [session, setEditorCode]);

  // Event handlers
  const handleMakeTests = async () => {
    if (!session?.language) return;
    try {
      await generateTests(editorCode, session.language as Language);
    } catch (error) {
      console.error('Failed to generate tests:', error);
    }
  };

  const handleRunClick = () => { 
    compile({
      code: editorCode,
      language: session?.language || Language.python
    });
  };

  const handleLanguageChange = (language: LanguageDrop) => {
    console.log('Language selected in grandparent:', language);
    updateSession({language: language.id }); // Update state or handle as needed
  };

  // Loading state
  if (isSessionLoading || isImageLoading) {
    return <LoadingState />;
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
            handleLanguageSelect={handleLanguageChange} // Add this line
            language={session?.language || 'Upload to detect language'}
            code={editorCode}
            isCompiling={isCompiling}
            onCodeChange={setEditorCode}
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