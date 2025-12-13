// This is a server-side route file - place in your backend (e.g., pages/api or server directory)
// For Next.js/Vercel, place this in: pages/api/ask-cle.js
// For other backends, adapt accordingly

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY // Use service key for server-side operations
);

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message, userId, conversationHistory } = req.body;

  if (!message || !OPENAI_API_KEY) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Build conversation context
    const systemPrompt = `You are Cle, a friendly AI guide for the World of Karma 360 application. You help users:
- Navigate the application and find rooms
- Tell stories and provide insights
- Explain features and capabilities
- Give personalized recommendations based on their interests
- Help with the light and dark wings
- Discuss music, galleries, merch, and other features

Be warm, conversational, and helpful. Keep responses concise but meaningful.`;

    const messages = [
      {
        role: "system",
        content: systemPrompt,
      },
      ...conversationHistory.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      {
        role: "user",
        content: message,
      },
    ];

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // or "gpt-4" for higher quality
        messages: messages,
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "OpenAI API error");
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    return res
      .status(500)
      .json({ error: error.message || "Internal server error" });
  }
}
