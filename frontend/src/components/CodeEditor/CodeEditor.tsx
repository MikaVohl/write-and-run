import React, { useState, useEffect } from 'react';
import MonacoEditor from '@monaco-editor/react';

interface CodeEditorProps {
  language: string;
  code: string;
  onChange: (newCode: string) => void; // Expect onChange prop to handle code changes externally
}

const CodeEditor: React.FC<CodeEditorProps> = ({ language, code, onChange }) => {
  const [editorCode, setEditorCode] = useState<string>(code);

  useEffect(() => {
    setEditorCode(code);
  }, [code]);

  const editorOptions = {
    selectOnLineNumbers: true,
    automaticLayout: true,
    theme: 'vs-dark',
  };

  // Update the editor code when Monaco Editor content changes
  const handleEditorChange = (newValue: string | undefined) => {
    // Ensure newValue is always a string
    const updatedCode = newValue || '';
    setEditorCode(updatedCode);
    onChange(updatedCode); // Pass the updated code to the parent component
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '100%', height: '100%' }}>
        <MonacoEditor
          language={language}
          value={editorCode}
          options={editorOptions}
          onChange={handleEditorChange} // Updated to use the correct handler
        />
      </div>
    </div>
  );
};

export default CodeEditor;
