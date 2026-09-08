"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Shield,
  ArrowLeft,
  ExternalLink,
  Lock,
  Eye,
  Server,
  Trash2,
  Mail,
} from "lucide-react";
import { AppShell } from "../components/app-shell";

const sections = [
  {
    id: "overview",
    title: "Overview",
    icon: Shield,
    content: [
      "Fluid (\"we,\" \"us,\" or \"our\") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.",
      "By using Fluid, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our services.",
    ],
  },
  {
    id: "collection",
    title: "Information We Collect",
    icon: Eye,
    content: [
      "Account Information: When you sign up, we collect your email address and a unique user identifier. We use OTP-based authentication — no passwords are stored.",
      "Usage Data: We collect information about how you interact with our services, including generation prompts, model selections, and feature usage. This helps us improve our platform.",
      "Generated Content: We store the images and videos you generate so you can access them in your history. By default, all generations are private.",
      "Technical Data: We collect IP addresses, browser type, device information, and cookies for security and analytics purposes.",
      "Payment Information: We do not store credit card details. All payments are processed securely through Stripe, our payment processor.",
    ],
  },
  {
    id: "use",
    title: "How We Use Your Information",
    icon: Server,
    content: [
      "To provide and maintain our services, including generating images and videos based on your prompts.",
      "To process your transactions and manage your subscription and credits.",
      "To improve our services, train our internal systems (never your specific generations), and develop new features.",
      "To communicate with you about updates, security alerts, and support requests.",
      "To detect, prevent, and address technical issues, fraud, and security breaches.",
      "To comply with legal obligations and enforce our Terms of Service.",
    ],
  },
  {
    id: "sharing",
    title: "Data Sharing and Disclosure",
    icon: ExternalLink,
    content: [
      "We do not sell your personal data to third parties. Ever.",
      "We share data only with trusted service providers who help us operate our platform (e.g., cloud hosting, payment processing, analytics). These providers are bound by strict confidentiality agreements.",
      "We may disclose information if required by law, regulation, or legal process, or to protect our rights, property, or safety.",
      "If you choose to share your generations to the community gallery, those images/videos become publicly visible.",
      "In the event of a merger, acquisition, or sale of assets, your data may be transferred as part of that transaction, subject to the same privacy protections.",
    ],
  },
  {
    id: "security",
    title: "Data Security",
    icon: Lock,
    content: [
      "We implement industry-standard security measures to protect your data, including encryption at rest and in transit (TLS 1.3).",
      "We use secure authentication methods (OTP) to prevent unauthorized access to your account.",
      "While we strive to use commercially acceptable means to protect your personal data, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.",
      "We regularly audit our systems and conduct security assessments to identify and address vulnerabilities.",
    ],
  },
  {
    id: "retention",
    title: "Data Retention and Deletion",
    icon: Trash2,
    content: [
      "We retain your account information and generation history for as long as your account is active.",
      "You can delete individual generations from your history at any time.",
      "You can delete your entire account and all associated data from your profile settings. This action is irreversible.",
      "After account deletion, we may retain certain data for legal, security, or fraud-prevention purposes for up to 90 days.",
      "Anonymized, aggregated data may be retained indefinitely for analytics and service improvement.",
    ],
  },
  {
    id: "rights",
    title: "Your Rights",
    icon: Shield,
    content: [
      "Access: You can request a copy of the personal data we hold about you.",
      "Correction: You can update your account information at any time from your profile settings.",
      "Deletion: You can delete your account and all personal data we hold about you.",
      "Portability: You can export your generation history and account data.",
      "Objection: You can object to certain processing activities, such as marketing communications.",
      "To exercise any of these rights, please contact us at privacy@fluid.ai.",
    ],
  },
  {
    id: "cookies",
    title: "Cookies and Tracking",
    icon: Eye,
    content: [
      "We use cookies and similar technologies to authenticate users, remember preferences, and analyze usage patterns.",
      "Essential cookies are required for the platform to function (e.g., session management).",
      "Analytics cookies help us understand how users interact with our site so we can improve it.",
      "You can control cookie preferences through your browser settings. Note that disabling certain cookies may affect functionality.",
    ],
  },
  {
    id: "changes",
    title: "Changes to This Policy",
    icon: Server,
    content: [
      "We may update this Privacy Policy from time to time. We will notify you of significant changes via email or through the platform.",
      "The \"Last updated\" date at the bottom of this page indicates when the policy was last revised.",
      "Your continued use of Fluid after changes constitutes acceptance of the updated policy.",
    ],
  },
];

export default function PrivacyPage() {
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
            <Shield className="h-3 w-3" />
            Privacy Policy
          </span>
          <h1 className="mt-4 text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.05] tracking-[-0.03em] text-[var(--text-primary)]">
            Privacy Policy
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
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <a
            href="mailto:privacy@fluid.ai"
            className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-[var(--accent-solid)] hover:underline"
          >
            <Mail className="h-4 w-4" />
            privacy@fluid.ai
          </a>
        </motion.div>
      </div>
    </AppShell>
  );
}
