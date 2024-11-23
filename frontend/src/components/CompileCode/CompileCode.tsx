import React from 'react';
import MonacoEditor from '@monaco-editor/react';

interface CompilerOutputProps {
  compilerOutput: string;
  placeholder?: string;
  className?: string;
}

const CompilerCode: React.FC<CompilerOutputProps> = ({
  compilerOutput,
  className = "h-64",
}) => {
  const editorOptions = {
    readOnly: true,
    minimap: { enabled: false },
    automaticLayout: true,
    scrollBeyondLastLine: false,
    theme: 'vs-light',
  };

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
