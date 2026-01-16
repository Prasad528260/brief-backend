import { PLAN_LIMITS, checkUsageLimit } from "./models.js"
import { generateWithGroq } from "./summaryGenerator.js";
import { generateWithGemini } from "./summaryGenerator.js";

export async function generateSummaryForUser({ text, user }) {
  // 1️⃣ Check limit
  checkUsageLimit(user);

  // 2️⃣ Choose model
  let summary;

  if (user.plan === "premium") {
    summary = await generateWithGemini(text);
  } else {
    summary = await generateWithGroq(text);
  }

  // 3️⃣ Increment usage
  user.summariesUsed += 1;
  await user.save();

  return summary;
}
