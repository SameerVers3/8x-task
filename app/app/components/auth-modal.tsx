"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { useLanguage } from "@/providers/language-provider";

export function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, refreshUser } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSendCode = async () => {
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setSent(true);
        setStep("code");
      } else {
        setError(data.error || "Failed to send code");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!code || code.length !== 6) {
      setError("Please enter the 6-digit code");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (data.success) {
        await refreshUser();
        setIsAuthModalOpen(false);
        setStep("email");
        setEmail("");
        setCode("");
      } else {
        setError(data.error || "Invalid code");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsAuthModalOpen(false);
    setStep("email");
    setEmail("");
    setCode("");
    setError("");
    setSent(false);
  };

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
            className="relative w-full max-w-md rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-bg-elevated)] p-6 shadow-[var(--theme-shadow-xl)]"
          >
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 text-[var(--theme-fg-muted)] hover:text-[var(--theme-fg)] transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex flex-col items-center gap-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--theme-accent-muted)] text-[var(--theme-accent)]">
                <Sparkles className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold text-[var(--theme-fg)]">
                {t("auth.signin")}
              </h2>
              <p className="text-sm text-center text-[var(--theme-fg-muted)]">
                {step === "email"
                  ? "Enter your email to receive a verification code."
                  : "Enter the 6-digit code sent to your email."}
              </p>
            </div>

            {error && (
              <div className="mb-4 rounded-lg bg-[var(--theme-danger)]/10 px-4 py-3 text-sm text-[var(--theme-danger)]">
                {error}
              </div>
            )}

            {sent && (
              <div className="mb-4 rounded-lg bg-[var(--theme-success)]/10 px-4 py-3 text-sm text-[var(--theme-success)]">
                {t("auth.sent")}
              </div>
            )}

            <AnimatePresence mode="wait">
              {step === "email" ? (
                <motion.div
                  key="email"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--theme-fg-subtle)]" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t("auth.email")}
                      className="w-full rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] py-3 pl-10 pr-4 text-sm text-[var(--theme-fg)] placeholder:text-[var(--theme-fg-subtle)] focus:border-[var(--theme-accent)] focus:outline-none transition-colors"
                      onKeyDown={(e) => e.key === "Enter" && handleSendCode()}
                    />
                  </div>
                  <button
                    onClick={handleSendCode}
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--theme-accent)] py-3 text-sm font-medium text-white hover:bg-[var(--theme-accent-hover)] transition-colors disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        {t("auth.sendCode")}
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="code"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--theme-fg-subtle)]" />
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder={t("auth.code")}
                      className="w-full rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] py-3 pl-10 pr-4 text-sm text-[var(--theme-fg)] placeholder:text-[var(--theme-fg-subtle)] focus:border-[var(--theme-accent)] focus:outline-none transition-colors tracking-[0.5em] text-center"
                      onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                    />
                  </div>
                  <button
                    onClick={handleVerify}
                    disabled={loading || code.length < 6}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--theme-accent)] py-3 text-sm font-medium text-white hover:bg-[var(--theme-accent-hover)] transition-colors disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        {t("auth.verify")}
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setStep("email");
                      setSent(false);
                    }}
                    className="w-full text-center text-sm text-[var(--theme-fg-muted)] hover:text-[var(--theme-accent)] transition-colors"
                  >
                    Use a different email
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
