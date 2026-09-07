"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, Zap, Crown, Rocket } from "lucide-react";

const PLANS = [
  {
    name: "Starter",
    icon: Sparkles,
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: "Perfect for exploring Fluid",
    features: [
      "50 free credits on signup",
      "Standard quality images",
      "720p video generation",
      "Community support",
      "Basic style presets",
    ],
    cta: "Get Started Free",
    highlighted: false,
  },
  {
    name: "Creator",
    icon: Zap,
    monthlyPrice: 9,
    yearlyPrice: 7,
    description: "For creators and freelancers",
    features: [
      "500 credits per month",
      "High quality images",
      "1080p video generation",
      "Priority processing",
      "All style presets",
      "Email support",
      "No watermark",
    ],
    cta: "Start Creating",
    highlighted: true,
  },
  {
    name: "Pro",
    icon: Crown,
    monthlyPrice: 29,
    yearlyPrice: 24,
    description: "For professionals and teams",
    features: [
      "2,000 credits per month",
      "Ultra high quality images",
      "4K video generation",
      "Fastest processing queue",
      "All style presets + custom",
      "Priority support",
      "API access",
      "Team collaboration",
    ],
    cta: "Go Pro",
    highlighted: false,
  },
  {
    name: "Enterprise",
    icon: Rocket,
    monthlyPrice: null,
    yearlyPrice: null,
    description: "Custom plans for organizations",
    features: [
      "Unlimited credits",
      "Custom model training",
      "Dedicated infrastructure",
      "SLA guarantee",
      "SSO & advanced security",
      "Dedicated account manager",
      "Custom integrations",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

export function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section className="px-6 py-24 md:px-16">
      <div className="mx-auto max-w-[1280px]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 text-center"
        >
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.06em] text-[var(--accent-solid)]">
            Pricing
          </p>
          <h2 className="mt-2 text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-[var(--text-primary)]">
            Simple, transparent pricing
          </h2>
        </motion.div>

        {/* Toggle */}
        <div className="mb-12 flex items-center justify-center gap-3">
          <span className={`text-sm font-medium ${!isYearly ? "text-[var(--text-primary)]" : "text-[var(--text-tertiary)]"}`}>
            Monthly
          </span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className="relative h-7 w-12 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-elevated-2)] transition-colors"
          >
            <div
              className={`absolute top-0.5 h-5 w-5 rounded-full transition-all duration-200 ${
                isYearly ? "left-[26px]" : "left-0.5"
              }`}
              style={{ background: "var(--accent-gradient)" }}
            />
          </button>
          <span className={`text-sm font-medium ${isYearly ? "text-[var(--text-primary)]" : "text-[var(--text-tertiary)]"}`}>
            Yearly
          </span>
          <span className="rounded-full bg-[var(--accent-muted)] px-2 py-0.5 text-[10px] font-semibold text-[var(--accent-solid)]">
            Save 20%
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((plan, i) => {
            const Icon = plan.icon;
            const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className={`relative flex flex-col rounded-[20px] border p-6 transition-all duration-200 ${
                  plan.highlighted
                    ? "border-[var(--accent-solid)] bg-[var(--bg-elevated)] shadow-[0_20px_60px_rgba(0,0,0,0.45)] scale-[1.03]"
                    : "border-[var(--border-subtle)] bg-[var(--bg-elevated-2)] hover:border-[var(--border-strong)]"
                }`}
              >
                {plan.highlighted && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-[10px] font-semibold uppercase tracking-wider text-white"
                    style={{ background: "var(--accent-gradient)" }}
                  >
                    Recommended
                  </div>
                )}
                <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${plan.highlighted ? "bg-[var(--accent-solid)] text-white" : "bg-[var(--accent-muted)] text-[var(--accent-solid)]"}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-[var(--text-primary)]">{plan.name}</h3>
                <p className="mt-1 text-xs text-[var(--text-secondary)]">{plan.description}</p>
                <div className="mt-4 flex items-baseline gap-1">
                  {price !== null ? (
                    <>
                      <span className="text-3xl font-bold text-[var(--text-primary)]">${price}</span>
                      <span className="text-xs text-[var(--text-tertiary)]">/mo</span>
                    </>
                  ) : (
                    <span className="text-3xl font-bold text-[var(--text-primary)]">Custom</span>
                  )}
                </div>
                <ul className="mt-5 space-y-2.5 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-[var(--text-secondary)]">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--success)]" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  className={`mt-6 w-full rounded-[12px] py-2.5 text-sm font-semibold transition-all ${
                    plan.highlighted
                      ? "text-[var(--bg-void)] hover:brightness-110"
                      : "border border-[var(--border-strong)] text-[var(--text-primary)] hover:bg-[var(--glass-fill-hover)]"
                  }`}
                  style={plan.highlighted ? { background: "var(--accent-gradient)" } : {}}
                >
                  {plan.cta}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
