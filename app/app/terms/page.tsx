"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileText,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Coins,
  Crown,
  Mail,
  Gavel,
} from "lucide-react";
import { AppShell } from "../components/app-shell";

const sections = [
  {
    id: "agreement",
    title: "Agreement to Terms",
    icon: FileText,
    content: [
      "By accessing or using Fluid (\"the Service\"), you agree to be bound by these Terms of Service (\"Terms\"). If you do not agree to these Terms, you may not access or use the Service.",
      "These Terms constitute a legally binding agreement between you and Fluid (\"we,\" \"us,\" or \"our\"). Please read them carefully.",
      "We reserve the right to modify these Terms at any time. We will notify you of significant changes. Your continued use of the Service after changes constitutes acceptance.",
    ],
  },
  {
    id: "eligibility",
    title: "Eligibility",
    icon: CheckCircle2,
    content: [
      "You must be at least 13 years old to use the Service. If you are under 18, you must have permission from a parent or guardian.",
      "By using the Service, you represent and warrant that you have the legal capacity to enter into these Terms and that all information you provide is accurate and complete.",
      "We reserve the right to terminate accounts that violate these eligibility requirements.",
    ],
  },
  {
    id: "accounts",
    title: "Account Registration",
    icon: Crown,
    content: [
      "To access certain features, you must create an account. We use OTP-based authentication sent to your email.",
      "You are responsible for maintaining the confidentiality of your account and for all activities that occur under your account.",
      "You agree to notify us immediately of any unauthorized access or use of your account.",
      "We reserve the right to disable accounts that have been inactive for an extended period or that violate these Terms.",
    ],
  },
  {
    id: "acceptable-use",
    title: "Acceptable Use",
    icon: CheckCircle2,
    content: [
      "You may use the Service only for lawful purposes and in accordance with these Terms.",
      "You agree NOT to use the Service to generate, upload, or distribute content that: (a) is illegal, harmful, or fraudulent; (b) infringes on intellectual property rights; (c) is defamatory, obscene, or harassing; (d) promotes violence, terrorism, or hate speech; (e) exploits minors; (f) contains malware or malicious code.",
      "You may not attempt to reverse-engineer, decompile, or hack the Service. You may not use automated systems (bots, scrapers) to access the Service without our written permission.",
      "You may not resell, sublicense, or commercially exploit the Service without our authorization.",
    ],
  },
  {
    id: "content",
    title: "Generated Content and Ownership",
    icon: Crown,
    content: [
      "You retain full ownership of all content you generate using the Service. You have the right to use, modify, and distribute your creations for any purpose, including commercial use.",
      "We do not claim ownership over your generated content. However, you grant us a limited license to store, process, and display your content as necessary to provide the Service.",
      "If you choose to share content to the community gallery, you grant other users a license to view that content. You can revoke this by removing the content from the gallery.",
      "We reserve the right to remove content that violates these Terms or applicable laws, and to suspend or terminate accounts that repeatedly violate these rules.",
    ],
  },
  {
    id: "payments",
    title: "Payments and Credits",
    icon: Coins,
    content: [
      "Certain features require payment. All fees are displayed before purchase and are non-refundable except as required by law or at our discretion.",
      "Credits are purchased in packs or included in subscription plans. Subscription credits reset monthly. One-time credit packs never expire.",
      "Prices are subject to change. We will notify you of any price changes before they take effect.",
      "Failed payments may result in suspension of paid features until the issue is resolved.",
      "All payments are processed by Stripe. We do not store your payment card information.",
    ],
  },
  {
    id: "subscriptions",
    title: "Subscriptions",
    icon: Crown,
    content: [
      "Subscriptions automatically renew at the end of each billing period unless cancelled.",
      "You can cancel your subscription at any time from your billing settings. Cancellation takes effect at the end of the current billing period.",
      "We may offer refunds at our sole discretion for exceptional circumstances.",
      "We reserve the right to modify subscription plans and pricing with reasonable notice.",
    ],
  },
  {
    id: "termination",
    title: "Termination",
    icon: XCircle,
    content: [
      "We may suspend or terminate your access to the Service at any time, with or without cause, with or without notice.",
      "Upon termination, your right to use the Service will immediately cease. You may request export of your data before termination.",
      "All provisions of these Terms that by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, indemnity, and limitations of liability.",
    ],
  },
  {
    id: "disclaimer",
    title: "Disclaimer of Warranties",
    icon: AlertTriangle,
    content: [
      "THE SERVICE IS PROVIDED \"AS IS\" AND \"AS AVAILABLE\" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.",
      "We do not warrant that the Service will be uninterrupted, secure, or error-free. We do not warrant that generated content will meet your expectations or be suitable for any particular purpose.",
      "AI-generated content may contain inaccuracies, biases, or unexpected outputs. You are responsible for reviewing and approving all generated content before use.",
      "To the maximum extent permitted by law, we disclaim all warranties, express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement.",
    ],
  },
  {
    id: "liability",
    title: "Limitation of Liability",
    icon: Gavel,
    content: [
      "To the maximum extent permitted by law, Fluid and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the Service.",
      "Our total liability to you for any claim arising from these Terms or the Service shall not exceed the amount you paid to us in the 12 months preceding the claim, or $100 if you have not made any payments.",
      "Some jurisdictions do not allow the exclusion or limitation of certain damages, so the above limitations may not apply to you.",
    ],
  },
  {
    id: "indemnity",
    title: "Indemnification",
    icon: Crown,
    content: [
      "You agree to indemnify, defend, and hold harmless Fluid and its affiliates from any claims, damages, losses, and expenses (including legal fees) arising out of your use of the Service, your generated content, or your violation of these Terms.",
    ],
  },
  {
    id: "governing",
    title: "Governing Law",
    icon: Gavel,
    content: [
      "These Terms shall be governed by and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions.",
      "Any dispute arising from these Terms shall be resolved through binding arbitration in San Francisco, California, except that either party may seek injunctive relief in court.",
    ],
  },
  {
    id: "cookies",
    title: "Cookies and Tracking",
    icon: FileText,
    content: [
      "We use cookies and similar tracking technologies to provide and improve the Service. By using the Service, you consent to our use of cookies.",
      "Essential cookies are necessary for the Service to function. You can manage other cookie preferences through your browser settings.",
      "For more details, see our Privacy Policy.",
    ],
  },
];

export default function TermsPage() {
  return (
    <AppShell>
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/3 top-0 h-[600px] w-[600px] rounded-full bg-[var(--accent-solid)] opacity-[0.03] blur-[180px]" />
        <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-[var(--accent-solid)] opacity-[0.02] blur-[150px]" />
      </div>

      <div className="mx-auto max-w-3xl px-4 py-6 md:px-8 md:py-10">
        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link
            href="/legal"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--accent-solid)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Legal Center
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 mt-6"
        >
          <span
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[0.75rem] font-semibold uppercase tracking-[0.06em] text-[var(--accent-solid)]"
            style={{ background: "var(--glass-fill)", border: "1px solid var(--border-subtle)" }}
          >
            <FileText className="h-3 w-3" />
            Terms of Service
          </span>
          <h1 className="mt-4 text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.05] tracking-[-0.03em] text-[var(--text-primary)]">
            Terms of Service
          </h1>
          <p className="mt-3 text-base leading-relaxed text-[var(--text-secondary)]">
            Last updated: September 8, 2026
          </p>
        </motion.div>

        {/* Content */}
        <div className="space-y-10">
          {sections.map((section, i) => {
            const Icon = section.icon;
            return (
              <motion.section
                key={section.id}
                id={section.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent-solid)]/10">
                    <Icon className="h-4 w-4 text-[var(--accent-solid)]" />
                  </div>
                  <h2 className="text-lg font-semibold text-[var(--text-primary)]">{section.title}</h2>
                </div>
                <div className="space-y-3 pl-11">
                  {section.content.map((paragraph, j) => (
                    <p key={j} className="text-sm leading-relaxed text-[var(--text-secondary)]">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </motion.section>
            );
          })}
        </div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 rounded-[16px] border border-[var(--border-subtle)] p-6"
          style={{ background: "var(--glass-fill)", backdropFilter: "blur(16px)" }}
        >
          <h2 className="font-semibold text-[var(--text-primary)]">Contact Us</h2>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            If you have any questions about these Terms, please contact us at:
          </p>
          <a
            href="mailto:legal@fluid.ai"
            className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-[var(--accent-solid)] hover:underline"
          >
            <Mail className="h-4 w-4" />
            legal@fluid.ai
          </a>
        </motion.div>
      </div>
    </AppShell>
  );
}
