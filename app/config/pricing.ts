export const creditPacks = [
  { id: "credits_100", credits: 100, priceCents: 500, perCredit: "0.05" },
  { id: "credits_500", credits: 500, priceCents: 2000, perCredit: "0.04", badge: "Popular" },
  { id: "credits_2000", credits: 2000, priceCents: 6000, perCredit: "0.03", badge: "Best value" },
  { id: "credits_5000", credits: 5000, priceCents: 12500, perCredit: "0.025" },
] as const;

export const subscriptionPlans = [
  {
    id: "plan_creator",
    name: "Creator",
    credits: 500,
    priceCentsMonthly: 900,
    priceCentsYearly: 700,
  },
  {
    id: "plan_pro",
    name: "Pro",
    credits: 2000,
    priceCentsMonthly: 2900,
    priceCentsYearly: 2400,
  },
] as const;

export function getCreditPack(id: string) {
  return creditPacks.find((p) => p.id === id);
}

export function getSubscriptionPlan(id: string) {
  return subscriptionPlans.find((p) => p.id === id);
}
