import Editor from "@monaco-editor/react";

const EditorView = ({ value, onChange }: EditorViewProps) => {
  return (
    <Editor
      height="100%"
      language="typescript"
      theme="light"
      loading="Loading..."
      path="schema.prisma"
      options={{
        minimap: { enabled: false },
        smoothScrolling: true,
        cursorSmoothCaretAnimation: "on",
        scrollBeyondLastLine: true,
      }}
      value={value}
      onChange={onChange}
    />
  );
};

export interface EditorViewProps {
  value: string;
  onChange: (text?: string) => void;
}

export default EditorView;
