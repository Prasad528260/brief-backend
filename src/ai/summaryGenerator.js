import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();
import { summaryPrompt } from "./prompt.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function generateGroqSummary(text) {
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


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateWithGemini(text) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
  });

  const response = await model.generateContent(summaryPrompt(text));

  const raw = response.response.text().trim();

  try {
    return JSON.parse(raw);
  } catch {
    throw new Error("Invalid JSON from AI");
  }
}