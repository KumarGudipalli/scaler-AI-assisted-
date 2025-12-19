import { useRef, useState } from "react";
import Editor from "./Components/Editor";
import ChatAssistant from "./Components/chatPannel";
import { BsStars } from "react-icons/bs";

export default function App() {
  const textAreaRef = useRef(null);
  const [editorText, setEditorText] = useState("");
  const [showChat, setShowChat] = useState(false);

  const onApplyEdit = (text) => {
    const textarea = textAreaRef.current;

    if (!textarea) {
      setEditorText((prev) => prev + "\n\n" + text);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    if (start !== end) {
      setEditorText((prev) => prev.slice(0, start) + text + prev.slice(end));
      requestAnimationFrame(() => {
        textarea.selectionStart = textarea.selectionEnd = start + text.length;
        textarea.focus();
      });
    } else {
      setEditorText((prev) => prev + "\n\n" + text);
    }
  };

  return (
    <>
      {/* ================= EDITOR LAYOUT ================= */}
      <div className="w-3/4 m-auto mt-14 p-4 border min-h-[600px]">
        <Editor
          editorText={editorText}
          setEditorText={setEditorText}
          textAreaRef={textAreaRef}
        />
      </div>

      {/* ================= FLOATING AI BUTTON ================= */}
      <button
        onClick={() => setShowChat((prev) => !prev)}
        className="fixed bottom-6 right-6 z-50
                   w-12 h-12 rounded-full bg-blue-600 cursor-pointer text-white
                   flex items-center justify-center
                   shadow-lg hover:scale-105 transition"
      >
        <BsStars size={20} />
      </button>

      {/* ================= FLOATING CHAT PANEL ================= */}
      <div
        className={`fixed bottom-24 right-16 z-40
         border h-120
        transition-all duration-300 ease-out
        ${
          showChat
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <ChatAssistant setShowChat={setShowChat} onApplyEdit={onApplyEdit} />
      </div>
    </>
  );
}
