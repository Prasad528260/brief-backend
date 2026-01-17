export const PLAN_LIMITS = {
  free: {
    groq: 3,
    openai: 0, // blocked
  },
  premium: {
    groq: 10,
    openai: 10,
  },
};
export function checkUsageLimit(user, model) {
  const limit = PLAN_LIMITS[user.plan][model];

  if (limit === 0) {
    throw new Error("Model not allowed for your plan");
  }

  if (user.usage[model] >= limit) {
    throw new Error("Usage limit reached for this model");
  }
}

