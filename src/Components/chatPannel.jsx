import { useState } from "react";
import MessageBubble from "./MessageBubble";
import { searchWeb } from "../ai/webSearch";
import { summarizeWithAI } from "../ai/summarize";

export default function ChatAssistant({ onApplyEdit }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  function needsWebSearch(prompt) {
    // Very simple check: if the user asks for "latest" info

    const key = prompt.toLowerCase();
    return (
      key.includes("latest") ||
      key.includes("news") ||
      key.includes("recent") ||
      key.includes("summary") ||
      key.includes("find")
    );
  }

  const updateLastMessage = (newContent) => {
    setMessages((prev) => {
      if (prev.length === 0)
        return [{ role: "assistant", content: newContent }];
      const updated = [...prev];
      updated[updated.length - 1] = { role: "assistant", content: newContent };
      return updated;
    });
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    try {
      setLoading(true);
      const userMessage = input;
      const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

      setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
      setInput("");

      // TOOL-USING AI PATH
      if (needsWebSearch(userMessage)) {
        // 1️⃣ Searching message
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "🔎 Searching the web..." },
        ]);
        await sleep(600);

        // 2️⃣ Web search
        const webResult = await searchWeb(userMessage);

        // 3️⃣ Summarizing message
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "🧠 Summarizing results..." },
        ]);
        await sleep(600);

        // 4️⃣ AI summary
        const prompt = `
You are an AI assistant.

Summarize the following web search results for the user's query:
"${userMessage}"

Search results:
${webResult}

- Keep it concise (1-3 sentences)
- Focus on key information
- Do NOT say "No recent information" even if results are limited
- Return only the summary text suitable for inserting into an editor
`;

        const summary = await summarizeWithAI(prompt);

        // 5️⃣ Final message
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: summary },
        ]);

        // 6️⃣ Insert into editor
        onApplyEdit(summary);

        return;
      }

      // NORMAL CHAT PATH (no tools)
      const API_KEY = import.meta.env.VITE_OPEN_AI_KEY;

      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            // {
            //   role: "system",
            //   content: SYSTEM_PROMPT,
            // },
            { role: "user", content: userMessage },
          ],
        }),
      });

      const data = await res.json();
      const aiMessage = data.choices[0].message.content;

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: aiMessage },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-150 h-full border-l bg-gray-200 rounded-lg flex flex-col">
      <div className="p-3 border-b font-medium bg-white">AI Assistant</div>

      {/* Chat messages */}
      <div className="flex-1 p-2 overflow-y-auto space-y-2">
        {messages.map((m, i) => (
          <MessageBubble
            key={i}
            message={m}
            loading={loading}
            onApplyEdit={onApplyEdit}
          />
        ))}
      </div>

      {/* Input box */}
      <div className="p-2 border-t flex gap-2 bg-white">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={sendMessage}
          className={`bg-blue-500 text-white px-4 rounded flex items-center gap-2 
    ${
      input.trim() === "" || loading
        ? "opacity-50 cursor-not-allowed"
        : "cursor-pointer"
    }`}
          disabled={input.trim() === "" || loading}
        >
          {loading && (
            <svg
              className="w-4 h-4 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          )}
          {loading ? "Loading..." : "Send"}
        </button>
      </div>
    </div>
  );
}
