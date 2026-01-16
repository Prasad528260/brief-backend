export const PLAN_LIMITS = {
  free: {
    maxSummaries: 3,
    model: "groq-3.1-8b-instant",
  },
  premium: {
    maxSummaries: 10,
    model: "gemini-2.0-flash",
  },
};
export function checkUsageLimit(user) {
  const limit = PLAN_LIMITS[user.plan].maxSummaries;

  if (user.summariesUsed >= limit) {
    if (user.plan === "free") {
      throw new Error("Free plan limit exceeded");
    } else {
      throw new Error("Premium plan limit exceeded");
    }
  }
}


