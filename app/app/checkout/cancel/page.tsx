"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { XCircle, ArrowLeft, CreditCard } from "lucide-react";
import { AppShell } from "../../components/app-shell";

export default function CheckoutCancelPage() {
  return (
    <AppShell>
      <div className="flex min-h-[70dvh] flex-col items-center justify-center px-6 py-24 text-center">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500 opacity-[0.04] blur-[180px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-md"
        >
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10">
            <XCircle className="h-8 w-8 text-amber-400" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Payment Cancelled
          </h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            No worries — you can try again anytime. Your credits and account are unchanged.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-[12px] px-6 py-3 text-sm font-semibold text-[var(--bg-void)] transition-all hover:brightness-110 hover:-translate-y-px active:scale-[0.98]"
              style={{ background: "var(--accent-gradient)" }}
            >
              <CreditCard className="h-4 w-4" />
              Back to Pricing
            </Link>
            <Link
              href="/generate"
              className="text-sm text-[var(--accent-solid)] hover:underline"
            >
              Continue with free credits
            </Link>
          </div>
        </motion.div>
      </div>
    </AppShell>
  );
}
