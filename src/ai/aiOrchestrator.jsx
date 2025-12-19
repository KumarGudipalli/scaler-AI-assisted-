import { searchWeb } from "./webSearch";
import { summarizeWithAI } from "./summarize";

export async function runAI(prompt) {
  const needsSearch = prompt.toLowerCase().includes("latest");

  if (needsSearch) {
    const webResult = await searchWeb(prompt);
    const summary = await summarizeWithAI(webResult);
    return summary;
  }

  // fallback → normal AI edit
  return await summarizeWithAI(prompt);
}
