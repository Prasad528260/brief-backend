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

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MAX_CHARS = 12000;

export async function generateWithOpenAI(text) {
  if (text.length > MAX_CHARS) {
    throw new Error("Input text too long");
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: summaryPrompt(text),
      },
    ],
    temperature: 0.2,
    max_tokens: 800,
  });

  const raw = response.choices[0].message.content.trim();

  try {
    return JSON.parse(raw);
  } catch {
    throw new Error("Invalid JSON from AI");
  }
}
