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
} as const;

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
