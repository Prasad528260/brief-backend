import { PLAN_LIMITS, checkUsageLimit } from "./models.js";
import { generateGroqSummary } from "./summaryGenerator.js";
import { generateWithOpenAI } from "./summaryGenerator.js";


export async function generateSummaryForUser({ text, user, model }) {
  // 1️⃣ Check usage
  checkUsageLimit(user, model);

  // 2️⃣ Generate
  let summary;
  if (model === "openai") {
    summary = await generateWithOpenAI(text);
  } else {
    summary = await generateGroqSummary(text);
  }

  // 3️⃣ Increment usage
  user.usage[model] += 1;

  // 4️⃣ Downgrade only when OPENAI credits finish
  if (
    user.plan === "premium" &&
    model === "openai" &&
    user.usage.openai >= PLAN_LIMITS.premium.openai
  ) {
    user.plan = "free";
  }

  await user.save();
  return summary;
}

