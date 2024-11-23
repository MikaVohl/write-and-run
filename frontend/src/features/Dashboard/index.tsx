import { useSession, useSessionImage } from "@/api";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { CodeEditorSection } from "./components/CodeEditor";
import { CompilerOutput } from "./components/CompilerOutput";
import { LoadingState } from "./components/LoadingState";
import { TabView } from "./components/TabView";
import { useCompiler } from "./hooks/UseCompiler";
import { useImageProcessing } from "./hooks/UseImageProcessing";
import { useSessionManager } from "./hooks/useSessionManager";
import { Language } from "@/types/types";

const SessionDashboard = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { data: session, isLoading: isSessionLoading } = useSession(sessionId!);
  const { data: sessionImage, isLoading: isImageLoading } = useSessionImage(sessionId!);

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

  useEffect(() => {
    if (session?.code) {
      setEditorCode(session.code);
    }
    // if (session?.compilation_output) {
    //   setCompilerOutput(session.compilation_output);
    // }
  }, [session]);

  if (isSessionLoading || isImageLoading) {
    return <LoadingState />;
  }

  const handleRunClick = () => {
    compile({
      code: editorCode,
      language: session?.language || Language.python
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className={cn(
        "grid grid-cols-2 divide-x divide-gray-200 transition-all duration-200",
        isCompilerExpanded ? 'h-[calc(100%-300px)]' : 'h-[calc(100%-40px)]'
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