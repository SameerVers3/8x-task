"use client";

import { motion } from "framer-motion";
import {
  Check,
  Zap,
  Crown,
  Rocket,
  Sparkles,
  ArrowRight,
  Coins,
  Infinity,
  Shield,
} from "lucide-react";
import { AppShell } from "../components/app-shell";
import { useLanguage } from "@/providers/language-provider";

const plans = [
  {
    name: "Starter",
    icon: Sparkles,
    price: 0,
    credits: 50,
    description: "Perfect for trying out Fluid",
    features: [
      "50 free credits on signup",
      "Standard quality images",
      "720p video generation",
      "Community support",
      "Basic style presets",
    ],
    cta: "Get Started Free",
    popular: false,
  },
  {
    name: "Creator",
    icon: Zap,
    price: 9,
    credits: 500,
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
    popular: true,
  },
  {
    name: "Pro",
    icon: Crown,
    price: 29,
    credits: 2000,
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
    popular: false,
  },
  {
    name: "Enterprise",
    icon: Rocket,
    price: null,
    credits: null,
    description: "Custom plans for organizations",
    features: [
      "Unlimited credits",
      "Custom model training",
      "Dedicated infrastructure",
      "SLA guarantee",
      "SSO & advanced security",
      "Dedicated account manager",
      "Custom integrations",
      "On-premise option",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const creditsPackages = [
  { credits: 100, price: 5, perCredit: "0.05" },
  { credits: 500, price: 20, perCredit: "0.04" },
  { credits: 2000, price: 60, perCredit: "0.03" },
  { credits: 5000, price: 125, perCredit: "0.025" },
];

export default function PricingPage() {
  const { t } = useLanguage();

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl font-bold md:text-4xl">{t("pricing.title")}</h1>
          <p className="mt-3 text-[var(--theme-fg-muted)] max-w-xl mx-auto">
            Transparent pricing. Pay only for what you use. No hidden fees, no subscriptions required.
          </p>
        </motion.div>

        {/* Plans */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan, i) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`relative flex flex-col rounded-2xl border p-6 transition-all ${
                  plan.popular
                    ? "border-[var(--theme-accent)] bg-[var(--theme-accent-muted)]/30 shadow-[var(--theme-shadow-glow)]"
                    : "border-[var(--theme-border)] bg-[var(--theme-surface)] hover:border-[var(--theme-accent)]/30"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--theme-accent)] px-4 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </div>
                )}

                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${
                    plan.popular
                      ? "bg-[var(--theme-accent)] text-white"
                      : "bg-[var(--theme-accent-muted)] text-[var(--theme-accent)]"
                  }`}
                >
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="text-xl font-bold">{plan.name}</h3>
                <p className="mt-1 text-sm text-[var(--theme-fg-muted)]">
                  {plan.description}
                </p>

                <div className="mt-4 flex items-baseline gap-1">
                  {plan.price !== null ? (
                    <>
                      <span className="text-3xl font-bold">${plan.price}</span>
                      <span className="text-sm text-[var(--theme-fg-muted)]">/mo</span>
                    </>
                  ) : (
                    <span className="text-3xl font-bold">Custom</span>
                  )}
                </div>

                {plan.credits && (
                  <div className="mt-2 flex items-center gap-1.5 text-sm text-[var(--theme-fg-muted)]">
                    <Coins className="h-4 w-4 text-[var(--theme-accent)]" />
                    {plan.credits} credits/month
                  </div>
                )}

                <ul className="mt-6 space-y-3 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--theme-success)]" />
                      <span className="text-[var(--theme-fg-muted)]">{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`mt-6 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium transition-all ${
                    plan.popular
                      ? "bg-[var(--theme-accent)] text-white hover:bg-[var(--theme-accent-hover)] shadow-[var(--theme-shadow-glow)]"
                      : "border border-[var(--theme-border)] text-[var(--theme-fg)] hover:bg-[var(--theme-surface-hover)]"
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Credit Packs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold">Credit Packs</h2>
            <p className="mt-2 text-[var(--theme-fg-muted)]">
              Need more credits? Top up anytime. Credits never expire.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {creditsPackages.map((pkg) => (
              <div
                key={pkg.credits}
                className="flex flex-col items-center rounded-xl border border-[var(--theme-border)] bg-[var(--theme-bg-elevated)] p-6 text-center transition-all hover:border-[var(--theme-accent)]/30 hover:bg-[var(--theme-surface-hover)] cursor-pointer"
              >
                <Coins className="h-8 w-8 text-[var(--theme-accent)] mb-3" />
                <p className="text-2xl font-bold">{pkg.credits}</p>
                <p className="text-sm text-[var(--theme-fg-muted)]">credits</p>
                <p className="mt-2 text-lg font-semibold">${pkg.price}</p>
                <p className="text-xs text-[var(--theme-fg-subtle)]">${pkg.perCredit}/credit</p>
                <button className="mt-4 w-full rounded-lg bg-[var(--theme-accent)] py-2 text-sm font-medium text-white hover:bg-[var(--theme-accent-hover)] transition-colors">
                  Buy Now
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Trust */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 grid gap-8 sm:grid-cols-3 text-center"
        >
          {[
            { icon: Shield, title: "Secure Payments", desc: "PCI compliant. Your payment info is never stored on our servers." },
            { icon: Infinity, title: "Credits Never Expire", desc: "Buy once, use forever. Your credits are always available." },
            { icon: Zap, title: "Instant Activation", desc: "No waiting. Your credits are available immediately after purchase." },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex flex-col items-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--theme-accent-muted)] text-[var(--theme-accent)]">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-1 text-sm text-[var(--theme-fg-muted)] max-w-xs">{item.desc}</p>
              </div>
            );
          })}
        </motion.div>
      </div>
    </AppShell>
  );
}
