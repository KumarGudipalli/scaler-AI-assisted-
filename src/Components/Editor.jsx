import { useRef, useState } from "react";
import FloatingToolbar from "./FloatingToolbar";
import AIPopup from "./AIPopup";

export default function Editor({ editorText, setEditorText, textAreaRef }) {
  const [selectedText, setSelectedText] = useState("");
  const [selectionRange, setSelectionRange] = useState(null);
  const [toolbarPos, setToolbarPos] = useState(null);
  const [aiResult, setAiResult] = useState(null);

  const handleSelect = () => {
    const textarea = textAreaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    if (start === end) {
      setToolbarPos(null);
      return;
    }

    setSelectedText(textarea.value.slice(start, end));
    setSelectionRange({ start, end });

    const rect = textarea.getBoundingClientRect();
    setToolbarPos({
      top: rect.top - 50 + window.scrollY,
      left: rect.left + rect.width / 6,
    });
  };

  const handleAIResult = (result) => {
    setToolbarPos(null);
    setAiResult(result);
  };

  const handleConfirm = () => {
    const { start, end } = selectionRange;
    setEditorText(
      editorText.slice(0, start) + aiResult + editorText.slice(end)
    );
    setAiResult(null);
  };

  return (
    <div className="flex flex-col w-full min-h-[600px] relative p-6 bg-white">
      {toolbarPos && (
        <FloatingToolbar
          position={toolbarPos}
          selectedText={selectedText}
          onResult={handleAIResult}
        />
      )}

      {aiResult && (
        <AIPopup
          original={selectedText}
          generated={aiResult}
          onConfirm={handleConfirm}
          onReject={() => setAiResult(null)}
        />
      )}

      <textarea
        ref={textAreaRef}
        value={editorText}
        onSelect={handleSelect}
        onChange={(e) => setEditorText(e.target.value)}
        className="flex-1 w-full resize-none outline-none text-lg"
        placeholder="Start writing..."
      />
    </div>
  );
}
