"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  Zap,
  Globe,
  Users,
  Target,
  ArrowRight,
  Heart,
  Shield,
  Rocket,
  Layers,
  Gem,
} from "lucide-react";
import { AppShell } from "../components/app-shell";

const values = [
  {
    icon: Zap,
    title: "Speed First",
    description:
      "We believe creativity shouldn't wait. Every millisecond matters, from prompt to pixel.",
  },
  {
    icon: Shield,
    title: "Privacy by Design",
    description:
      "Your data is yours. We don't train on your generations, and we never sell your information.",
  },
  {
    icon: Users,
    title: "Built for Creators",
    description:
      "Fluid is made by creators, for creators. We obsess over the tools that unlock imagination.",
  },
  {
    icon: Globe,
    title: "Open & Accessible",
    description:
      "AI generation should be available to everyone, everywhere. No gatekeeping, no walls.",
  },
];

const milestones = [
  { year: "2023", event: "Fluid founded with a vision to democratize AI creation" },
  { year: "2024", event: "Launched first image generation pipeline with 50+ models" },
  { year: "2025", event: "Added video generation and community gallery features" },
  { year: "2026", event: "Reached 50,000+ creators and 1M+ generations" },
];

const team = [
  { name: "Alex Rivera", role: "CEO & Co-founder", initials: "AR" },
  { name: "Sam Chen", role: "CTO & Co-founder", initials: "SC" },
  { name: "Jordan Park", role: "Head of Design", initials: "JP" },
  { name: "Morgan Lee", role: "Lead Engineer", initials: "ML" },
];

export default function AboutPage() {
  return (
    <AppShell>
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/3 top-0 h-[600px] w-[600px] rounded-full bg-[var(--accent-solid)] opacity-[0.03] blur-[180px]" />
        <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-[var(--accent-solid)] opacity-[0.02] blur-[150px]" />
      </div>

      <div className="mx-auto px-4 py-6 md:px-8 md:py-10">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 text-center"
        >
          <span
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[0.75rem] font-semibold uppercase tracking-[0.06em] text-[var(--accent-solid)]"
            style={{ background: "var(--glass-fill)", border: "1px solid var(--border-subtle)" }}
          >
            <Gem className="h-3 w-3" />
            About Fluid
          </span>
          <h1 className="mx-auto mt-4 max-w-3xl text-[clamp(2.5rem,5vw,4rem)] font-bold leading-[1.05] tracking-[-0.03em] text-[var(--text-primary)]">
            Building the future of creative AI
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)] md:text-lg">
            Fluid is a model-agnostic AI generation platform. We believe everyone should have access to the best creative tools — no expertise required.
          </p>
        </motion.div>

        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-20 overflow-hidden rounded-[24px] border border-[var(--border-subtle)] px-6 py-16 md:px-16 md:py-20"
          style={{ background: "var(--glass-fill)", backdropFilter: "blur(20px)" }}
        >
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent-solid)] opacity-[0.04] blur-[100px]" />
          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <Target className="mx-auto h-10 w-10 text-[var(--accent-solid)]" />
            <h2 className="mt-4 text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-[var(--text-primary)]">
              Our Mission
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-[var(--text-secondary)]">
              To make AI-powered creation as natural as breathing. We are building the infrastructure that lets anyone turn imagination into reality — images, videos, and beyond — with zero friction and maximum creative freedom.
            </p>
          </div>
        </motion.div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20"
        >
          <div className="mb-10 text-center">
            <span
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[0.75rem] font-semibold uppercase tracking-[0.06em] text-[var(--accent-solid)]"
              style={{ background: "var(--glass-fill)", border: "1px solid var(--border-subtle)" }}
            >
              <Heart className="h-3 w-3" />
              What We Believe
            </span>
            <h2 className="mt-4 text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-[var(--text-primary)]">
              Our Values
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="rounded-[20px] border border-[var(--border-subtle)] p-6 transition-all hover:border-[var(--accent-solid)]/30"
                  style={{ background: "var(--glass-fill)", backdropFilter: "blur(16px)" }}
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--glass-fill)]">
                    <Icon className="h-5 w-5 text-[var(--accent-solid)]" />
                  </div>
                  <h3 className="font-semibold text-[var(--text-primary)]">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                    {v.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20"
        >
          <div className="mb-10 text-center">
            <span
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[0.75rem] font-semibold uppercase tracking-[0.06em] text-[var(--accent-solid)]"
              style={{ background: "var(--glass-fill)", border: "1px solid var(--border-subtle)" }}
            >
              <Rocket className="h-3 w-3" />
              Journey
            </span>
            <h2 className="mt-4 text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-[var(--text-primary)]">
              Milestones
            </h2>
          </div>

          <div className="mx-auto max-w-3xl space-y-6">
            {milestones.map((m, i) => (
              <motion.div
                key={m.year}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-start gap-4 rounded-[16px] border border-[var(--border-subtle)] p-5"
                style={{ background: "var(--glass-fill)", backdropFilter: "blur(12px)" }}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-solid)]/10">
                  <span className="text-sm font-bold text-[var(--accent-solid)]">{m.year}</span>
                </div>
                <p className="text-sm leading-relaxed text-[var(--text-secondary)] pt-2">
                  {m.event}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20"
        >
          <div className="mb-10 text-center">
            <span
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[0.75rem] font-semibold uppercase tracking-[0.06em] text-[var(--accent-solid)]"
              style={{ background: "var(--glass-fill)", border: "1px solid var(--border-subtle)" }}
            >
              <Users className="h-3 w-3" />
              People
            </span>
            <h2 className="mt-4 text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-[var(--text-primary)]">
              The Team
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center rounded-[20px] border border-[var(--border-subtle)] p-6 text-center"
                style={{ background: "var(--glass-fill)", backdropFilter: "blur(16px)" }}
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--accent-solid)]/10 text-lg font-bold text-[var(--accent-solid)]">
                  {member.initials}
                </div>
                <h3 className="mt-4 font-semibold text-[var(--text-primary)]">{member.name}</h3>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-[24px] border border-[var(--border-subtle)] px-6 py-16 md:py-20 text-center"
          style={{ background: "var(--glass-fill)", backdropFilter: "blur(20px)" }}
        >
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent-solid)] opacity-[0.04] blur-[100px]" />
          <div className="relative z-10">
            <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-[1.1] tracking-[-0.02em] text-[var(--text-primary)]">
              Want to join us?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-base text-[var(--text-secondary)]">
              We are always looking for passionate people who want to shape the future of AI creation.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="mailto:hello@fluid.ai"
                className="inline-flex items-center gap-2 rounded-[12px] border border-[var(--border-subtle)] px-6 py-3 text-sm font-semibold text-[var(--text-primary)] transition-all hover:bg-[var(--glass-fill-hover)]"
              >
                Get in Touch
              </Link>
              <Link
                href="/generate"
                className="inline-flex items-center gap-2 rounded-[12px] px-6 py-3 text-sm font-semibold text-[var(--bg-void)] transition-all hover:brightness-110 hover:-translate-y-px active:scale-[0.98]"
                style={{ background: "var(--accent-gradient)" }}
              >
                Try Fluid Free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </AppShell>
  );
}
