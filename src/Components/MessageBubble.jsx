import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MessageBubble({  message, onApplyEdit }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] p-3 rounded-lg break-words
        ${isUser ? "bg-blue-500 text-white" : "bg-red-200 text-gray-900"}`}
      >
        {/* Message content */}
        {message.role === "assistant" ? (
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          </div>
        ) : (
          <p>{message.content}</p>
        )}
        {/* Optional AI edit suggestion */}
        {!isUser && message.edit && (
          <div className="mt-2 p-2 border bg-white rounded text-sm">
            <p className="font-medium">Suggested Edit:</p>
            <p className="text-gray-700">{message.edit.replacement}</p>
            <button
              onClick={() => onApplyEdit(message.edit.replacement)}
              className="mt-1 text-blue-500 hover:underline"
            >
              Apply
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
