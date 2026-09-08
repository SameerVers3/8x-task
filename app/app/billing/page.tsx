"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Coins,
  CreditCard,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  Layers,
  LogIn,
  ArrowLeft,
} from "lucide-react";
import { AppShell } from "../components/app-shell";
import { useAuth } from "@/providers/auth-provider";

interface PaymentRecord {
  id: string;
  type: string;
  credits: number;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  metadata: any;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatAmount(cents: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

export default function BillingPage() {
  const { user, isLoading, setIsAuthModalOpen } = useAuth();
  const [records, setRecords] = useState<PaymentRecord[]>([]);
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const fetchBilling = async () => {
      try {
        const res = await fetch("/api/billing", { credentials: "include" });
        const data = await res.json();
        if (data.success) {
          setRecords(data.data.records);
          setCredits(data.data.credits);
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetchBilling();
  }, [user]);

  if (!isLoading && !user) {
    return (
      <AppShell>
        <div className="relative flex min-h-[80dvh] flex-col items-center justify-center px-6 py-24 text-center">
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent-solid)] opacity-[0.04] blur-[180px]" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-lg"
          >
            <span
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[0.75rem] font-semibold uppercase tracking-[0.06em] text-[var(--accent-solid)]"
              style={{ background: "var(--glass-fill)", border: "1px solid var(--border-subtle)" }}
            >
              <Layers className="h-3 w-3" />
              Billing
            </span>
            <h2 className="mt-5 text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.1] tracking-[-0.02em] text-[var(--text-primary)]">
              Sign in to view your billing
            </h2>
            <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-[var(--text-secondary)]">
              Track your purchases, credits, and payment history.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3">
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-[12px] px-6 py-3 text-sm font-semibold text-[var(--bg-void)] transition-all hover:brightness-110 hover:-translate-y-px active:scale-[0.98]"
                style={{ background: "var(--accent-gradient)" }}
              >
                <LogIn className="h-4 w-4" />
                Sign In
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </AppShell>
    );
  }

  if (loading) {
    return (
      <AppShell>
        <div className="relative flex min-h-[70dvh] flex-col items-center justify-center px-6">
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent-solid)] opacity-[0.03] blur-[150px]" />
          </div>
          <div className="relative h-16 w-16">
            <div className="absolute inset-0 rounded-full border-2 border-[var(--border-subtle)]" />
            <div className="absolute inset-0 rounded-full border-2 border-t-[var(--accent-solid)] animate-spin" />
          </div>
          <p className="mt-4 text-sm text-[var(--text-secondary)]">Loading billing history...</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/4 top-0 h-[600px] w-[600px] rounded-full bg-[var(--accent-solid)] opacity-[0.03] blur-[180px]" />
        <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-[var(--accent-solid)] opacity-[0.02] blur-[150px]" />
      </div>

      <div className="mx-auto px-4 py-6 md:px-8 md:py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10"
        >
          <span
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[0.75rem] font-semibold uppercase tracking-[0.06em] text-[var(--accent-solid)]"
            style={{ background: "var(--glass-fill)", border: "1px solid var(--border-subtle)" }}
          >
            <CreditCard className="h-3 w-3" />
            Billing
          </span>
          <h1 className="mt-4 text-[clamp(2rem,4vw,3.5rem)] font-bold leading-[1.1] tracking-[-0.02em] text-[var(--text-primary)]">
            Payment History
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-[var(--text-secondary)]">
            <div className="flex items-center gap-1.5">
              <Coins className="h-3.5 w-3.5 text-[var(--accent-solid)]" />
              <span className="font-medium text-[var(--text-primary)]">{credits}</span> available credits
            </div>
          </div>
        </motion.div>

        {records.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center rounded-[24px] border border-[var(--border-subtle)] py-24 text-center"
            style={{ background: "var(--glass-fill)", backdropFilter: "blur(20px)" }}
          >
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--border-subtle)] bg-[var(--glass-fill)]">
              <CreditCard className="h-8 w-8 text-[var(--accent-solid)] opacity-60" />
            </div>
            <h3 className="text-xl font-semibold text-[var(--text-primary)]">No payments yet</h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-[var(--text-secondary)]">
              Purchase credits or a subscription to start creating.
            </p>
            <Link
              href="/pricing"
              className="mt-6 inline-flex items-center gap-2 rounded-[12px] px-6 py-3 text-sm font-semibold text-[var(--bg-void)] transition-all hover:brightness-110 hover:-translate-y-px active:scale-[0.98]"
              style={{ background: "var(--accent-gradient)" }}
            >
              View Pricing
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {records.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center justify-between rounded-[16px] border border-[var(--border-subtle)] p-4 md:p-5"
                style={{ background: "var(--glass-fill)", backdropFilter: "blur(12px)" }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      r.status === "completed"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : r.status === "failed"
                        ? "bg-red-500/10 text-red-400"
                        : "bg-amber-500/10 text-amber-400"
                    }`}
                  >
                    {r.status === "completed" ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : r.status === "failed" ? (
                      <XCircle className="h-5 w-5" />
                    ) : (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      {r.type === "subscription" ? "Subscription" : "Credit Pack"}
                      {r.metadata?.packId
                        ? ` — ${r.credits} credits`
                        : r.metadata?.planId
                        ? ` — ${r.credits} credits/mo`
                        : ""}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                      <Clock className="h-3 w-3" />
                      {formatDate(r.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-[var(--text-primary)]">
                    {formatAmount(r.amount, r.currency)}
                  </p>
                  <p
                    className={`mt-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                      r.status === "completed"
                        ? "text-emerald-400"
                        : r.status === "failed"
                        ? "text-red-400"
                        : "text-amber-400"
                    }`}
                  >
                    {r.status}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-8">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 text-sm text-[var(--accent-solid)] hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to pricing
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
