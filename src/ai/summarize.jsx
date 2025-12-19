// src/ai/summarize.js

export async function summarizeWithAI(content) {
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_OPEN_AI_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Summarize the following content in 3–4 concise sentences. Return ONLY the summary.",
          },
          {
            role: "user",
            content,
          },
        ],
        temperature: 0.4,
      }),
    });

    const data = await res.json();

    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error("AI summarization failed:", error);
    return "Failed to generate AI summary.";
  }
}
