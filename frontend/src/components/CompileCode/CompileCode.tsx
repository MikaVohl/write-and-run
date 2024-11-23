import React from 'react';
import MonacoEditor from '@monaco-editor/react';

interface CompilerOutputProps {
  compilerOutput: string;
  placeholder?: string;
  className?: string;
}

const CompilerCode: React.FC<CompilerOutputProps> = ({
  compilerOutput,
  className = "h-64 ",
}) => {
  const editorOptions = {
    readOnly: true,
    minimap: { enabled: false },
    automaticLayout: true,
    scrollBeyondLastLine: false,
    theme: 'vs-light',
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <h2 className=" font-semibold px-2 ">Compiler Output</h2>

      <MonacoEditor
        value={compilerOutput}
        options={editorOptions}
        className="rounded border border-gray-300"
      />

    </div>
  );
};

export default CompilerCode;
