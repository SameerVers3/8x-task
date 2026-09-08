"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Mail,
  MessageSquare,
  ArrowRight,
  Send,
  MapPin,
  Clock,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Zap,
} from "lucide-react";
import { AppShell } from "../components/app-shell";

const contactMethods = [
  {
    icon: Mail,
    title: "Email",
    value: "hello@fluid.ai",
    href: "mailto:hello@fluid.ai",
    description: "General inquiries and partnerships",
  },
  {
    icon: MessageSquare,
    title: "Support",
    value: "support@fluid.ai",
    href: "mailto:support@fluid.ai",
    description: "Technical help and account issues",
  },
  {
    icon: Zap,
    title: "Sales",
    value: "sales@fluid.ai",
    href: "mailto:sales@fluid.ai",
    description: "Enterprise and custom plans",
  },
];

const offices = [
  { city: "San Francisco", detail: "Remote-first team" },
  { city: "London", detail: "European operations" },
  { city: "Singapore", detail: "APAC hub" },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError("Please fill in all required fields.");
      return;
    }
    setError("");
    setSubmitted(true);
  };

  return (
    <AppShell>
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/4 top-0 h-[600px] w-[600px] rounded-full bg-[var(--accent-solid)] opacity-[0.03] blur-[180px]" />
        <div className="absolute bottom-0 right-1/3 h-[500px] w-[500px] rounded-full bg-[var(--accent-solid)] opacity-[0.02] blur-[150px]" />
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
            <MessageSquare className="h-3 w-3" />
            Contact
          </span>
          <h1 className="mx-auto mt-4 max-w-2xl text-[clamp(2.5rem,5vw,4rem)] font-bold leading-[1.05] tracking-[-0.03em] text-[var(--text-primary)]">
            Let&apos;s talk
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-[var(--text-secondary)] md:text-lg">
            Have a question, feedback, or just want to say hello? We&apos;d love to hear from you.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Left — Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-5 lg:col-span-2"
          >
            {contactMethods.map((method, i) => {
              const Icon = method.icon;
              return (
                <motion.a
                  key={method.title}
                  href={method.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-start gap-4 rounded-[16px] border border-[var(--border-subtle)] p-5 transition-all hover:border-[var(--accent-solid)]/30"
                  style={{ background: "var(--glass-fill)", backdropFilter: "blur(16px)" }}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--glass-fill)]">
                    <Icon className="h-5 w-5 text-[var(--accent-solid)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--text-primary)]">{method.title}</h3>
                    <p className="mt-0.5 text-sm font-medium text-[var(--accent-solid)]">{method.value}</p>
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">{method.description}</p>
                  </div>
                </motion.a>
              );
            })}

            {/* Offices */}
            <div
              className="rounded-[16px] border border-[var(--border-subtle)] p-5"
              style={{ background: "var(--glass-fill)", backdropFilter: "blur(16px)" }}
            >
              <div className="mb-4 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[var(--accent-solid)]" />
                <h3 className="font-semibold text-[var(--text-primary)]">Offices</h3>
              </div>
              <div className="space-y-3">
                {offices.map((office) => (
                  <div key={office.city} className="flex items-center justify-between text-sm">
                    <span className="text-[var(--text-primary)]">{office.city}</span>
                    <span className="text-[var(--text-secondary)]">{office.detail}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-[var(--text-tertiary)]">
                <Clock className="h-3.5 w-3.5" />
                Response time: usually within 24 hours
              </div>
            </div>

            {/* FAQ Link */}
            <Link
              href="/faq"
              className="flex items-center gap-3 rounded-[16px] border border-[var(--border-subtle)] p-5 transition-all hover:border-[var(--accent-solid)]/30"
              style={{ background: "var(--glass-fill)", backdropFilter: "blur(16px)" }}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--glass-fill)]">
                <HelpCircle className="h-5 w-5 text-[var(--accent-solid)]" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-[var(--text-primary)]">Frequently Asked Questions</h3>
                <p className="mt-0.5 text-sm text-[var(--text-secondary)]">Find instant answers to common questions</p>
              </div>
              <ArrowRight className="h-4 w-4 text-[var(--text-tertiary)]" />
            </Link>
          </motion.div>

          {/* Right — Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-3"
          >
            <div
              className="rounded-[24px] border border-[var(--border-subtle)] p-6 md:p-8"
              style={{ background: "var(--glass-fill)", backdropFilter: "blur(20px)" }}
            >
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
                    <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-[var(--text-primary)]">Message sent!</h3>
                  <p className="mt-2 max-w-sm text-sm text-[var(--text-secondary)]">
                    Thanks for reaching out. We&apos;ll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                    className="mt-6 text-sm font-medium text-[var(--accent-solid)] hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
                        Name *
                      </label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        placeholder="Your name"
                        className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-void)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--accent-solid)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-solid)]/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        placeholder="you@example.com"
                        className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-void)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--accent-solid)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-solid)]/20 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
                      Subject
                    </label>
                    <select
                      value={form.subject}
                      onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                      className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-void)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] focus:border-[var(--accent-solid)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-solid)]/20 transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Select a topic</option>
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="sales">Sales / Enterprise</option>
                      <option value="partnership">Partnership</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
                      Message *
                    </label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                      placeholder="Tell us what's on your mind..."
                      rows={6}
                      className="w-full resize-none rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-void)] px-3.5 py-3 text-sm leading-relaxed text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--accent-solid)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-solid)]/20 transition-all"
                    />
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400">
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-[var(--bg-void)] transition-all hover:brightness-110 hover:-translate-y-px active:scale-[0.98]"
                    style={{ background: "var(--accent-gradient)" }}
                  >
                    <Send className="h-4 w-4" />
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </AppShell>
  );
}
