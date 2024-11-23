import React, { useState, useEffect } from 'react';
import MonacoEditor from '@monaco-editor/react';

interface CodeEditorProps {
  language: string;
  code: string;

}

const CodeEditor: React.FC<CodeEditorProps> = ({ language, code}) => {
  const [editorCode, setEditorCode] = useState<string>(code);

  useEffect(() => {
    setEditorCode(code);
  }, [code]);

  const editorOptions = {
    selectOnLineNumbers: true,
    automaticLayout: true,
    theme: 'vs-dark',
  };

  const handleEditorChange = (newCode: string | undefined) => {
    setEditorCode(newCode || '');
  };


  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '100%', height: '100%' }}>
        <MonacoEditor
          language={language}
          value={editorCode}
          options={editorOptions}
          onChange={handleEditorChange}
        />
      </div>

    </div>
  );
};

export default CodeEditor;
