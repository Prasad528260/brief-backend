import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();
import { summaryPrompt } from "./prompt.js";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function generateStructuredSummary(text) {
  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
        content: "Return structured JSON summaries for chat conversations.",
      },
      {
        role: "user",
        content: summaryPrompt(text),
      },
    ],
    temperature: 0.3,
    max_tokens: 600,
  });

  const raw = response.choices[0].message.content.trim();

  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error("❌ JSON parse failed:", raw);
    throw new Error("Invalid JSON from AI");
  }
}
