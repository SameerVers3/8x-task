"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

export function CtaBanner() {
  return (
    <section className="relative overflow-hidden px-6 py-24 md:px-16">
      {/* Background ambient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-[var(--accent-solid)] opacity-[0.04] blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-[var(--accent-solid)] opacity-[0.03] blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative mx-auto max-w-3xl text-center"
      >
        <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.03em] text-[var(--text-primary)]">
          Ready to bring your
          <br />
          imagination to life?
        </h2>
        <p className="mt-4 text-base leading-relaxed text-[var(--text-secondary)] md:text-lg">
          Join thousands of creators. Start generating stunning images and videos today — free credits on signup.
        </p>
        <Link
          href="/generate"
          className="mt-8 inline-flex items-center gap-2 rounded-[12px] px-8 py-4 text-base font-semibold text-[var(--bg-void)] transition-all hover:brightness-110 hover:-translate-y-px active:scale-[0.98]"
          style={{ background: "var(--accent-gradient)" }}
        >
          <Sparkles className="h-5 w-5" />
          Start Creating for Free
          <ArrowRight className="h-4 w-4" />
        </Link>
      </motion.div>
    </section>
  );
}
