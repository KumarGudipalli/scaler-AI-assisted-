import { runAI } from "../ai/aiOrchestrator";

export default function FloatingToolbar({ position, selectedText, onResult }) {
  function cleanAIResponse(text) {
    return text
      .replace(/^Certainly!.*?:\s*/i, "")
      .replace(/^Here’s.*?:\s*/i, "")
      .trim();
  }

  const callAI = async (action) => {
    // Build a single prompt for the orchestrator
    const prompt = `
Task: ${action}

Rules:
- Return ONLY the edited text
- No explanations
- No introductions

Text:
${selectedText}
`;

    // 🧠 Tool-using AI (decides internally)
    const result = await runAI(prompt);

    const cleaned = cleanAIResponse(result);
    onResult(cleaned); // closes toolbar + opens popup
  };

  return (
    <div
      className="absolute z-50 flex w-180 bg-white border rounded-xl shadow-xl "
      style={{
        top: position.top,
        left: position.left,
        transform: "translateX(-50%)",
      }}
    >
      <Action label="✂️ Shorten" onClick={() => callAI("Shorten")} />
      <Action label="📏 Lengthen" onClick={() => callAI("Lengthen")} />
      <Action label="✅ Fix grammar" onClick={() => callAI("Fix grammar")} />
      <Action
        label="📊 Convert to table"
        onClick={() => callAI("Convert to table")}
      />
    </div>
  );
}

function Action({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer"
    >
      {label}
    </button>
  );
}
