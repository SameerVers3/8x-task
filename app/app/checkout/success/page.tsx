"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Coins, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { AppShell } from "../../components/app-shell";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setVerifying(false);
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(`/api/checkout/verify?session_id=${sessionId}`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) {
          setVerified(true);
          setCredits(data.data?.credits ?? null);
        }
      } catch {
        // silent
      } finally {
        setVerifying(false);
      }
    };

    verify();
  }, [sessionId]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-md"
    >
      {verifying ? (
        <div className="flex flex-col items-center">
          <div className="relative h-16 w-16">
            <div className="absolute inset-0 rounded-full border-2 border-[var(--border-subtle)]" />
            <div className="absolute inset-0 rounded-full border-2 border-t-emerald-400 animate-spin" />
          </div>
          <p className="mt-4 text-sm text-[var(--text-secondary)]">
            Confirming your payment...
          </p>
        </div>
      ) : verified ? (
        <>
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10">
            <CheckCircle2 className="h-8 w-8 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Payment Successful
          </h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Thank you for your purchase. Your credits have been added to your account.
          </p>
          {credits !== null && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-400">
              <Coins className="h-4 w-4" />
              +{credits} credits added
            </div>
          )}
          <div className="mt-8 flex flex-col items-center gap-3">
            <Link
              href="/generate"
              className="inline-flex items-center gap-2 rounded-[12px] px-6 py-3 text-sm font-semibold text-[var(--bg-void)] transition-all hover:brightness-110 hover:-translate-y-px active:scale-[0.98]"
              style={{ background: "var(--accent-gradient)" }}
            >
              <Sparkles className="h-4 w-4" />
              Start Creating
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/pricing"
              className="text-sm text-[var(--accent-solid)] hover:underline"
            >
              Back to pricing
            </Link>
          </div>
        </>
      ) : (
        <>
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--glass-fill)]">
            <CheckCircle2 className="h-8 w-8 text-[var(--accent-solid)]" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Payment Received
          </h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Your payment was received. Credits may take a moment to appear in your account.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3">
            <Link
              href="/generate"
              className="inline-flex items-center gap-2 rounded-[12px] px-6 py-3 text-sm font-semibold text-[var(--bg-void)] transition-all hover:brightness-110 hover:-translate-y-px active:scale-[0.98]"
              style={{ background: "var(--accent-gradient)" }}
            >
              <Sparkles className="h-4 w-4" />
              Start Creating
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </>
      )}
    </motion.div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <AppShell>
      <div className="flex min-h-[70dvh] flex-col items-center justify-center px-6 py-24 text-center">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500 opacity-[0.04] blur-[180px]" />
        </div>

        <Suspense
          fallback={
            <div className="flex flex-col items-center">
              <div className="relative h-16 w-16">
                <div className="absolute inset-0 rounded-full border-2 border-[var(--border-subtle)]" />
                <div className="absolute inset-0 rounded-full border-2 border-t-emerald-400 animate-spin" />
              </div>
              <p className="mt-4 text-sm text-[var(--text-secondary)]">
                Confirming your payment...
              </p>
            </div>
          }
        >
          <SuccessContent />
        </Suspense>
      </div>
    </AppShell>
  );
}
