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
    theme: 'light',
    scrollBeyondLastLine: false, // Prevents extra space after the last line
    scrollbar: {
      vertical: 'auto',          // Show vertical scrollbar only when necessary
      horizontal: 'auto',        // Show horizontal scrollbar only when necessary
      useShadows: false,         // Disable shadows around the scrollbar
      verticalScrollbarSize: 8,  // Adjust the size as needed
      horizontalScrollbarSize: 8,
    },
    minimap: {
      enabled: false,            // Disable the minimap if not needed
    },
    wordWrap: 'on',              // Wrap long lines to prevent horizontal scrolling
    fontSize: '14px',
  } as const;

  // Update the editor code when Monaco Editor content changes
  const handleEditorChange = (newValue: string | undefined) => {
    // Ensure newValue is always a string
    const updatedCode = newValue || '';
    setEditorCode(updatedCode);
    onChange(updatedCode); // Pass the updated code to the parent component
  };

  return (
    <div style={{ display: 'flex', height: '100%' }}>
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
