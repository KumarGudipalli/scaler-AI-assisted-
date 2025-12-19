// src/ai/webSearch.js

export async function searchWeb(query) {
  try {
    const res = await fetch(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(
        query
      )}&format=json&no_redirect=1&no_html=1`
    );

    const data = await res.json();

    // DuckDuckGo returns a short abstract when available
    if (data.AbstractText) {
      return data.AbstractText;
    }

    // Fallback: concatenate related topics
    if (data.RelatedTopics?.length) {
      return data.RelatedTopics.slice(0, 5)
        .map((item) => item.Text)
        .join("\n");
    }

    return "No relevant recent information found.";
  } catch (error) {
    console.error("Web search failed:", error);
    return "Failed to fetch web results.";
  }
}
