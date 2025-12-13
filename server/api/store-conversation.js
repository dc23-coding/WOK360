// Backend API for storing conversations in Supabase
// Place in: pages/api/store-conversation.js

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId, userMessage, assistantMessage, timestamp } = req.body;

  if (!userId || !userMessage || !assistantMessage) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Store conversation in Supabase
    const { data, error } = await supabase
      .from("ask_cle_conversations")
      .insert([
        {
          user_id: userId,
          user_message: userMessage,
          assistant_message: assistantMessage,
          created_at: timestamp,
        },
      ]);

    if (error) {
      throw error;
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Error storing conversation:", error);
    return res
      .status(500)
      .json({ error: error.message || "Internal server error" });
  }
}
