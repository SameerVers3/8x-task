"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle,
  ChevronDown,
  Search,
  MessageSquare,
  ArrowRight,
  Zap,
  CreditCard,
  Shield,
  ImageIcon,
  VideoIcon,
  User,
  Wand2,
} from "lucide-react";
import { AppShell } from "../components/app-shell";

const categories = [
  { id: "all", label: "All", icon: HelpCircle },
  { id: "general", label: "General", icon: Zap },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "generation", label: "Generation", icon: Wand2 },
  { id: "account", label: "Account", icon: User },
  { id: "privacy", label: "Privacy", icon: Shield },
];

const faqs = [
  {
    category: "general",
    q: "What is Fluid?",
    a: "Fluid is a model-agnostic AI generation platform. We route your creation requests to the best available providers for images, videos, and more — all through one simple interface.",
  },
  {
    category: "general",
    q: "Do I need technical expertise to use Fluid?",
    a: "Not at all. Fluid is designed for everyone. Just describe what you want in plain English, pick a model, and hit generate. No prompts engineering or API knowledge required.",
  },
  {
    category: "general",
    q: "What models are supported?",
    a: "We support a wide range of models including Flux, Turbo, and specialized models for different styles and use cases. New models are added regularly. Visit the /generate page to see the full list.",
  },
  {
    category: "billing",
    q: "How does the credit system work?",
    a: "Every generation costs a certain number of credits depending on the model and output size. The Starter plan includes 50 free credits. Paid plans offer more credits per month, and you can always buy additional credit packs that never expire.",
  },
  {
    category: "billing",
    q: "Can I cancel my subscription anytime?",
    a: "Absolutely. You can cancel with one click from your billing settings. You will keep your remaining credits until the end of your billing period.",
  },
  {
    category: "billing",
    q: "Do credits expire?",
    a: "Subscription credits reset monthly. One-time credit packs never expire and roll over indefinitely.",
  },
  {
    category: "billing",
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards, PayPal, and Apple Pay. Enterprise customers can also pay via invoice or wire transfer.",
  },
  {
    category: "generation",
    q: "How long does generation take?",
    a: "Most images generate in 5–15 seconds. Videos can take 30–120 seconds depending on length and complexity. High-demand periods may have slightly longer queues.",
  },
  {
    category: "generation",
    q: "Can I use the generated content commercially?",
    a: "Yes. All content generated on Fluid belongs to you. You have full commercial rights to use, modify, and distribute your creations. Please check our Terms for the full license details.",
  },
  {
    category: "generation",
    q: "What is the maximum resolution?",
    a: "Images can be generated up to 2048x2048 pixels depending on the model. Higher resolutions may use more credits. Video generation supports up to 1080p on most plans and 4K on Pro.",
  },
  {
    category: "account",
    q: "How do I reset my password?",
    a: "We use OTP-based authentication. Simply sign out and sign back in — we will send a one-time code to your email. No passwords to remember or reset.",
  },
  {
    category: "account",
    q: "Can I delete my account?",
    a: "Yes. Go to your Profile settings and click Delete Account. This will permanently remove all your data from our systems. This action cannot be undone.",
  },
  {
    category: "privacy",
    q: "Is my data private?",
    a: "Yes. We do not train our models on your generations. Your prompts and outputs are private by default. We only store what is necessary to provide the service and comply with legal requirements.",
  },
  {
    category: "privacy",
    q: "Do you sell my data?",
    a: "Never. We do not sell, rent, or share your personal data with third parties for marketing purposes. Read our full Privacy Policy for details.",
  },
  {
    category: "privacy",
    q: "Can I make my generations private?",
    a: "Yes. By default, all generations are private. You can optionally choose to share them to the community gallery if you want to showcase your work.",
  },
];

export default function FaqPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filtered = faqs.filter((f) => {
    const matchesCategory = activeCategory === "all" || f.category === activeCategory;
    const matchesSearch =
      !search ||
      f.q.toLowerCase().includes(search.toLowerCase()) ||
      f.a.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <AppShell>
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/3 top-0 h-[600px] w-[600px] rounded-full bg-[var(--accent-solid)] opacity-[0.03] blur-[180px]" />
        <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-[var(--accent-solid)] opacity-[0.02] blur-[150px]" />
      </div>

      <div className="mx-auto px-4 py-6 md:px-8 md:py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 text-center"
        >
          <span
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[0.75rem] font-semibold uppercase tracking-[0.06em] text-[var(--accent-solid)]"
            style={{ background: "var(--glass-fill)", border: "1px solid var(--border-subtle)" }}
          >
            <HelpCircle className="h-3 w-3" />
            FAQ
          </span>
          <h1 className="mx-auto mt-4 max-w-2xl text-[clamp(2.5rem,5vw,4rem)] font-bold leading-[1.05] tracking-[-0.03em] text-[var(--text-primary)]">
            Frequently Asked Questions
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-[var(--text-secondary)] md:text-lg">
            Everything you need to know about Fluid. Can&apos;t find what you&apos;re looking for? Reach out to us.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mb-8 max-w-xl"
        >
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-tertiary)]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions..."
              className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--glass-fill)] py-3 pl-10 pr-4 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--accent-solid)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-solid)]/20 transition-all"
              style={{ backdropFilter: "blur(12px)" }}
            />
          </div>
        </motion.div>

        {/* Category filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 flex flex-wrap justify-center gap-2"
        >
          {categories.map((cat) => {
            const Icon = cat.icon;
            const active = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-medium transition-all ${
                  active
                    ? "border-[var(--accent-solid)] bg-[var(--accent-solid)]/10 text-[var(--accent-solid)]"
                    : "border-[var(--border-subtle)] bg-[var(--glass-fill)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {cat.label}
              </button>
            );
          })}
        </motion.div>

        {/* FAQ list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-3xl space-y-3"
        >
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-[24px] border border-[var(--border-subtle)] py-20 text-center"
              style={{ background: "var(--glass-fill)", backdropFilter: "blur(20px)" }}
            >
              <Search className="h-10 w-10 text-[var(--text-tertiary)] mb-4" />
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">No matches found</h3>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                Try a different search term or category.
              </p>
            </div>
          )}

          {filtered.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03, duration: 0.4 }}
              className="rounded-[16px] border border-[var(--border-subtle)] overflow-hidden"
              style={{ background: "var(--glass-fill)", backdropFilter: "blur(12px)" }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-[var(--glass-fill-hover)]"
              >
                <span className="pr-4 text-sm font-semibold text-[var(--text-primary)]">{faq.q}</span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-[var(--text-tertiary)] transition-transform duration-300 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence initial={false}>
                {openIndex === i && (
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
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-20 max-w-3xl text-center"
        >
          <div
            className="relative overflow-hidden rounded-[24px] border border-[var(--border-subtle)] px-6 py-16"
            style={{ background: "var(--glass-fill)", backdropFilter: "blur(20px)" }}
          >
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent-solid)] opacity-[0.04] blur-[100px]" />
            <div className="relative z-10">
              <MessageSquare className="mx-auto h-10 w-10 text-[var(--accent-solid)]" />
              <h2 className="mt-4 text-[clamp(1.5rem,3vw,2rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-[var(--text-primary)]">
                Still have questions?
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-[var(--text-secondary)]">
                Our team is here to help. Reach out and we&apos;ll get back to you within 24 hours.
              </p>
              <Link
                href="/contact"
                className="mt-6 inline-flex items-center gap-2 rounded-[12px] px-6 py-3 text-sm font-semibold text-[var(--bg-void)] transition-all hover:brightness-110 hover:-translate-y-px active:scale-[0.98]"
                style={{ background: "var(--accent-gradient)" }}
              >
                Contact Us
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </AppShell>
  );
}
