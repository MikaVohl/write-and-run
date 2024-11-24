import React from 'react';
import MonacoEditor from '@monaco-editor/react';

interface CompilerOutputProps {
  compilerOutput: string;
  placeholder?: string;
  className?: string;
}

const CompilerCode: React.FC<CompilerOutputProps> = ({
  compilerOutput,
  className = "h-[18rem]",
}) => {
  const editorOptions = {
    readOnly: true,
    minimap: { enabled: false },
    automaticLayout: true,
    scrollBeyondLastLine: false,
    theme: 'vs-light',
    wordWrap: 'on',
    fontSize: 14,
  };

  // const editorOptions = {
  //   selectOnLineNumbers: true,
  //   automaticLayout: true,
  //   theme: 'light',
  //   scrollBeyondLastLine: false, // Prevents extra space after the last line
  //   scrollbar: {
  //     vertical: 'auto',          // Show vertical scrollbar only when necessary
  //     horizontal: 'auto',        // Show horizontal scrollbar only when necessary
  //     useShadows: false,         // Disable shadows around the scrollbar
  //     verticalScrollbarSize: 8,
  //     horizontalScrollbarSize: 8,
  //   },
  //   minimap: {
  //     enabled: false,            // Disable the minimap if not needed
  //   },
  //   wordWrap: 'on',              // Wrap long lines to prevent horizontal scrolling
  //   fontSize: 14,
  // } as const;

  return (
    <div className={`${className}`}>
      <MonacoEditor
        value={compilerOutput}
        options={editorOptions}
        className="rounded border border-gray-300"
      />
    </div>
  );
};

export default CompilerCode;
