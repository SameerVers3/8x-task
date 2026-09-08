"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Scale,
  Shield,
  FileText,
  ArrowRight,
  ExternalLink,
  AlertCircle,
  Gavel,
} from "lucide-react";
import { AppShell } from "../components/app-shell";

const legalDocs = [
  {
    icon: Shield,
    title: "Privacy Policy",
    description: "How we collect, use, and protect your personal data. Your privacy is our priority.",
    href: "/privacy",
  },
  {
    icon: FileText,
    title: "Terms of Service",
    description: "The rules and guidelines for using Fluid. Please read carefully before using our platform.",
    href: "/terms",
  },
  {
    icon: Gavel,
    title: "Cookie Policy",
    description: "How we use cookies and similar technologies to improve your experience.",
    href: "/terms#cookies",
  },
  {
    icon: AlertCircle,
    title: "Acceptable Use",
    description: "What you can and cannot do with Fluid. Keep our community safe and creative.",
    href: "/terms#acceptable-use",
  },
];

export default function LegalPage() {
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
          className="mb-12 text-center"
        >
          <span
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[0.75rem] font-semibold uppercase tracking-[0.06em] text-[var(--accent-solid)]"
            style={{ background: "var(--glass-fill)", border: "1px solid var(--border-subtle)" }}
          >
            <Scale className="h-3 w-3" />
            Legal
          </span>
          <h1 className="mx-auto mt-4 max-w-2xl text-[clamp(2.5rem,5vw,4rem)] font-bold leading-[1.05] tracking-[-0.03em] text-[var(--text-primary)]">
            Legal Center
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-[var(--text-secondary)] md:text-lg">
            Transparency and trust are core to how we operate. Find all our legal documents here.
          </p>
        </motion.div>

        {/* Document Cards */}
        <div className="mx-auto max-w-4xl grid gap-5 sm:grid-cols-2">
          {legalDocs.map((doc, i) => {
            const Icon = doc.icon;
            return (
              <motion.div
                key={doc.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  href={doc.href}
                  className="flex h-full flex-col rounded-[20px] border border-[var(--border-subtle)] p-6 transition-all hover:border-[var(--accent-solid)]/30"
                  style={{ background: "var(--glass-fill)", backdropFilter: "blur(16px)" }}
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--glass-fill)]">
                    <Icon className="h-5 w-5 text-[var(--accent-solid)]" />
                  </div>
                  <h3 className="font-semibold text-[var(--text-primary)]">{doc.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--text-secondary)]">
                    {doc.description}
                  </p>
                  <div className="mt-4 flex items-center gap-1 text-sm font-medium text-[var(--accent-solid)]">
                    Read document
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-16 max-w-3xl"
        >
          <div
            className="relative overflow-hidden rounded-[24px] border border-[var(--border-subtle)] px-6 py-12 text-center"
            style={{ background: "var(--glass-fill)", backdropFilter: "blur(20px)" }}
          >
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent-solid)] opacity-[0.04] blur-[100px]" />
            <div className="relative z-10">
              <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-[var(--text-primary)]">
                Legal inquiries
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-[var(--text-secondary)]">
                For legal questions, DMCA requests, or compliance matters, please contact our legal team directly.
              </p>
              <a
                href="mailto:legal@fluid.ai"
                className="mt-5 inline-flex items-center gap-2 rounded-[12px] border border-[var(--border-subtle)] px-6 py-3 text-sm font-semibold text-[var(--text-primary)] transition-all hover:bg-[var(--glass-fill-hover)]"
              >
                legal@fluid.ai
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Last Updated */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-12 text-center text-xs text-[var(--text-tertiary)]"
        >
          Last updated: September 2026
        </motion.p>
      </div>
    </AppShell>
  );
}
