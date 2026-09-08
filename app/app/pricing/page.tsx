"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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
  Lock,
  ChevronDown,
  HelpCircle,
  Star,
  CreditCard,
  ArrowUpRight,
} from "lucide-react";
import { AppShell } from "../components/app-shell";
import { useLanguage } from "@/providers/language-provider";

const plans = [
  {
    name: "Starter",
    icon: Sparkles,
    price: { monthly: 0, yearly: 0 },
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
    href: "/generate",
    popular: false,
  },
  {
    name: "Creator",
    icon: Zap,
    price: { monthly: 9, yearly: 7 },
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
    href: "/generate",
    popular: true,
  },
  {
    name: "Pro",
    icon: Crown,
    price: { monthly: 29, yearly: 24 },
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
    href: "/generate",
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
    href: "mailto:sales@fluid.ai",
    popular: false,
  },
];

const creditsPackages = [
  { credits: 100, price: 5, perCredit: "0.05" },
  { credits: 500, price: 20, perCredit: "0.04", badge: "Popular" },
  { credits: 2000, price: 60, perCredit: "0.03", badge: "Best value" },
  { credits: 5000, price: 125, perCredit: "0.025" },
];

const trustItems = [
  { icon: Shield, title: "Secure Payments", desc: "PCI compliant. Your payment info is never stored on our servers." },
  { icon: Infinity, title: "Credits Never Expire", desc: "Buy once, use forever. Your credits are always available." },
  { icon: Zap, title: "Instant Activation", desc: "No waiting. Your credits are available immediately after purchase." },
];

const faqs = [
  {
    q: "What happens when I run out of credits?",
    a: "You can purchase credit packs at any time. They never expire and are added to your account instantly. Subscriptions also refill monthly.",
  },
  {
    q: "Can I cancel my subscription anytime?",
    a: "Absolutely. Cancel with one click from your account settings. You'll keep your remaining credits until the end of your billing period.",
  },
  {
    q: "Do unused credits roll over?",
    a: "Subscription credits reset monthly. One-time credit packs never expire and roll over indefinitely.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards, PayPal, and Apple Pay. Enterprise customers can pay via invoice or wire transfer.",
  },
  {
    q: "Is there a free trial?",
    a: "The Starter plan gives you 50 free credits to try everything. No credit card required.",
  },
];

function BillingToggle({
  yearly,
  onChange,
}: {
  yearly: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-4">
      <span
        className={`text-sm font-medium transition-colors ${
          !yearly ? "text-[var(--text-primary)]" : "text-[var(--text-tertiary)]"
        }`}
      >
        Monthly
      </span>
      <button
        onClick={() => onChange(!yearly)}
        className="relative h-7 w-12 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-elevated-2)] transition-colors"
        aria-label="Toggle yearly billing"
      >
        <motion.div
          className="absolute top-0.5 h-5 w-5 rounded-full"
          style={{ background: "var(--accent-gradient)" }}
          animate={{ left: yearly ? "calc(100% - 1.375rem)" : "0.25rem" }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      </button>
      <span
        className={`text-sm font-medium transition-colors ${
          yearly ? "text-[var(--text-primary)]" : "text-[var(--text-tertiary)]"
        }`}
      >
        Yearly
      </span>
      <span className="rounded-full bg-[var(--accent-solid)]/10 px-2 py-0.5 text-[10px] font-semibold text-[var(--accent-solid)]">
        Save 20%
      </span>
    </div>
  );
}

export default function PricingPage() {
  const { t } = useLanguage();
  const [yearly, setYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <AppShell>
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/3 top-0 h-[600px] w-[600px] rounded-full bg-[var(--accent-solid)] opacity-[0.03] blur-[180px]" />
        <div className="absolute bottom-0 right-1/3 h-[500px] w-[500px] rounded-full bg-[var(--accent-solid)] opacity-[0.02] blur-[150px]" />
      </div>

      <div className="mx-auto px-4 py-6 md:px-8 md:py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 text-center"
        >
          <span
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[0.75rem] font-semibold uppercase tracking-[0.06em] text-[var(--accent-solid)]"
            style={{ background: "var(--glass-fill)", border: "1px solid var(--border-subtle)" }}
          >
            <CreditCard className="h-3 w-3" />
            Pricing
          </span>
          <h1 className="mx-auto mt-4 max-w-2xl text-[clamp(2.5rem,5vw,4rem)] font-bold leading-[1.05] tracking-[-0.03em] text-[var(--text-primary)]">
            Simple, transparent pricing
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-[var(--text-secondary)] md:text-lg">
            Pay only for what you use. No hidden fees, no surprise charges. Start free and scale as you grow.
          </p>
        </motion.div>

        {/* Billing toggle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="mb-12"
        >
          <BillingToggle yearly={yearly} onChange={setYearly} />
        </motion.div>

        {/* Plans */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan, i) => {
            const Icon = plan.icon;
            const isPopular = plan.popular;

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className={`relative flex flex-col rounded-[24px] border p-6 md:p-7 transition-all ${
                  isPopular
                    ? "border-[var(--accent-solid)]/40 shadow-[0_0_40px_rgba(124,58,237,0.12)]"
                    : "border-[var(--border-subtle)] hover:border-[var(--border-strong)]"
                }`}
                style={{
                  background: isPopular
                    ? "linear-gradient(180deg, rgba(124,58,237,0.08) 0%, var(--glass-fill) 100%)"
                    : "var(--glass-fill)",
                  backdropFilter: "blur(20px) saturate(140%)",
                }}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-lg"
                    style={{ background: "var(--accent-gradient)" }}
                  >
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3" fill="currentColor" />
                      Most Popular
                    </span>
                  </div>
                )}

                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${
                    isPopular
                      ? "text-white"
                      : "text-[var(--accent-solid)]"
                  }`}
                  style={
                    isPopular
                      ? { background: "var(--accent-gradient)" }
                      : { background: "var(--accent-solid)/10", border: "1px solid var(--border-subtle)" }
                  }
                >
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="text-xl font-bold text-[var(--text-primary)]">{plan.name}</h3>
                <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">
                  {plan.description}
                </p>

                <div className="mt-5 flex items-baseline gap-1">
                  {plan.price !== null ? (
                    <>
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={yearly ? "yearly" : "monthly"}
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ duration: 0.2 }}
                          className="text-4xl font-bold tracking-tight text-[var(--text-primary)]"
                        >
                          ${yearly ? plan.price.yearly : plan.price.monthly}
                        </motion.span>
                      </AnimatePresence>
                      <span className="text-sm text-[var(--text-secondary)]">/mo</span>
                    </>
                  ) : (
                    <span className="text-3xl font-bold text-[var(--text-primary)]">Custom</span>
                  )}
                </div>

                {plan.credits && (
                  <div className="mt-2 flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
                    <Coins className="h-4 w-4 text-[var(--accent-solid)]" />
                    <span className="font-medium text-[var(--text-primary)]">{plan.credits}</span> credits/month
                  </div>
                )}

                <div className="my-5 h-px bg-[var(--border-subtle)]" />

                <ul className="space-y-3 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent-solid)]/10">
                        <Check className="h-3 w-3 text-[var(--accent-solid)]" />
                      </div>
                      <span className="text-[var(--text-secondary)]">{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={`mt-7 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all hover:-translate-y-px active:scale-[0.98] ${
                    isPopular
                      ? "text-[var(--bg-void)] shadow-lg"
                      : "border border-[var(--border-subtle)] text-[var(--text-primary)] hover:bg-[var(--glass-fill-hover)]"
                  }`}
                  style={isPopular ? { background: "var(--accent-gradient)" } : {}}
                >
                  {plan.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Credit Packs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-24"
        >
          <div className="mb-10 text-center">
            <span
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[0.75rem] font-semibold uppercase tracking-[0.06em] text-[var(--accent-solid)]"
              style={{ background: "var(--glass-fill)", border: "1px solid var(--border-subtle)" }}
            >
              <Coins className="h-3 w-3" />
              Top Up
            </span>
            <h2 className="mt-4 text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-[var(--text-primary)]">
              Credit Packs
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-base text-[var(--text-secondary)]">
              Need more credits? Buy once, use forever. Credits never expire.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {creditsPackages.map((pkg, i) => (
              <motion.div
                key={pkg.credits}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="group relative flex flex-col items-center rounded-[20px] border border-[var(--border-subtle)] p-6 text-center transition-all hover:border-[var(--accent-solid)]/30"
                style={{ background: "var(--glass-fill)", backdropFilter: "blur(16px)" }}
              >
                {pkg.badge && (
                  <span className="absolute -top-2.5 rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white"
                    style={{ background: "var(--accent-gradient)" }}
                  >
                    {pkg.badge}
                  </span>
                )}
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--glass-fill)]">
                  <Coins className="h-5 w-5 text-[var(--accent-solid)]" />
                </div>
                <p className="text-3xl font-bold text-[var(--text-primary)]">{pkg.credits}</p>
                <p className="text-xs text-[var(--text-tertiary)]">credits</p>
                <p className="mt-2 text-lg font-semibold text-[var(--text-primary)]">${pkg.price}</p>
                <p className="text-xs text-[var(--text-tertiary)]">${pkg.perCredit}/credit</p>
                <button className="mt-4 w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--glass-fill)] py-2.5 text-sm font-medium text-[var(--text-primary)] transition-all hover:bg-[var(--accent-solid)] hover:text-white hover:border-[var(--accent-solid)]">
                  Buy Now
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Trust */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-24 grid gap-8 sm:grid-cols-3 text-center"
        >
          {trustItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex flex-col items-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--glass-fill)] text-[var(--accent-solid)]">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-[var(--text-primary)]">{item.title}</h3>
                <p className="mt-1 max-w-xs text-sm leading-relaxed text-[var(--text-secondary)]">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-24 max-w-3xl"
        >
          <div className="mb-10 text-center">
            <span
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[0.75rem] font-semibold uppercase tracking-[0.06em] text-[var(--accent-solid)]"
              style={{ background: "var(--glass-fill)", border: "1px solid var(--border-subtle)" }}
            >
              <HelpCircle className="h-3 w-3" />
              FAQ
            </span>
            <h2 className="mt-4 text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-[var(--text-primary)]">
              Questions & Answers
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="rounded-[16px] border border-[var(--border-subtle)] overflow-hidden"
                style={{ background: "var(--glass-fill)", backdropFilter: "blur(12px)" }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-[var(--glass-fill-hover)]"
                >
                  <span className="text-sm font-semibold text-[var(--text-primary)]">{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-[var(--text-tertiary)] transition-transform duration-300 ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="px-5 pb-4 text-sm leading-relaxed text-[var(--text-secondary)]">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-24 text-center"
        >
          <div
            className="relative overflow-hidden rounded-[24px] border border-[var(--border-subtle)] px-6 py-16 md:py-20"
            style={{ background: "var(--glass-fill)", backdropFilter: "blur(20px)" }}
          >
            {/* ambient orb inside card */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent-solid)] opacity-[0.04] blur-[100px]" />

            <div className="relative z-10">
              <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-[1.1] tracking-[-0.02em] text-[var(--text-primary)]">
                Still have questions?
              </h2>
              <p className="mx-auto mt-3 max-w-md text-base text-[var(--text-secondary)]">
                Our team is here to help. Reach out and we'll get back to you within 24 hours.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="mailto:support@fluid.ai"
                  className="inline-flex items-center gap-2 rounded-[12px] border border-[var(--border-subtle)] px-6 py-3 text-sm font-semibold text-[var(--text-primary)] transition-all hover:bg-[var(--glass-fill-hover)]"
                >
                  <HelpCircle className="h-4 w-4" />
                  Contact Support
                </Link>
                <Link
                  href="/generate"
                  className="inline-flex items-center gap-2 rounded-[12px] px-6 py-3 text-sm font-semibold text-[var(--bg-void)] transition-all hover:brightness-110 hover:-translate-y-px active:scale-[0.98]"
                  style={{ background: "var(--accent-gradient)" }}
                >
                  Start Creating Free
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AppShell>
  );
}
