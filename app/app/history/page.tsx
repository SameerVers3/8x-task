"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ImageIcon,
  VideoIcon,
  CheckCircle2,
  XCircle,
  Loader2,
  Wand2,
  Search,
  Maximize2,
  ArrowRight,
  LogIn,
  Heart,
  Clock,
  Zap,
  ChevronRight,
  Download,
  RotateCcw,
  Layers,
  X,
  Coins,
} from "lucide-react";
import { AppShell } from "../components/app-shell";
import { useAuth } from "@/providers/auth-provider";
import { useLanguage } from "@/providers/language-provider";

interface Creation {
  id: string;
  prompt: string;
  type: string;
  status: string;
  resultUrl: string | null;
  creditsUsed: number;
  createdAt: string;
  model: {
    name: string;
    displayName: string;
  };
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

export default function HistoryPage() {
  const { user, isLoading, setIsAuthModalOpen } = useAuth();
  const { t } = useLanguage();
  const [creations, setCreations] = useState<Creation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "image" | "video">("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const fetchCreations = async () => {
      try {
        const res = await fetch("/api/creations", { credentials: "include" });
        const data = await res.json();
        if (data.success) setCreations(data.data);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetchCreations();
  }, [user]);

  const filtered = creations
    .filter((c) => (filter === "all" ? true : c.type === filter))
    .filter(
      (c) =>
        c.prompt.toLowerCase().includes(search.toLowerCase()) ||
        c.model?.displayName?.toLowerCase().includes(search.toLowerCase())
    );

  const statusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-400" />;
      case "processing":
      case "pending":
        return <Loader2 className="h-4 w-4 animate-spin text-amber-400" />;
      default:
        return null;
    }
  };

  const selected = selectedId ? creations.find((c) => c.id === selectedId) : null;

  // Auth wall — matching hero aesthetic
  if (!isLoading && !user) {
    return (
      <AppShell>
        <div className="relative flex min-h-[80dvh] flex-col items-center justify-center px-6 py-24 text-center">
          {/* ambient background */}
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
              Your Creations
            </span>
            <h2 className="mt-5 text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.1] tracking-[-0.02em] text-[var(--text-primary)]">
              Sign in to view your history
            </h2>
            <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-[var(--text-secondary)]">
              Track your generations, revisit past prompts, and build on your creative journey.
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
              <Link
                href="/generate"
                className="text-sm text-[var(--accent-solid)] hover:underline"
              >
                Or start creating without an account
              </Link>
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
          <p className="mt-4 text-sm text-[var(--text-secondary)]">Loading your creations...</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/4 top-0 h-[600px] w-[600px] rounded-full bg-[var(--accent-solid)] opacity-[0.03] blur-[180px]" />
        <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-[var(--accent-solid)] opacity-[0.02] blur-[150px]" />
      </div>

      <div className="mx-auto px-4 py-6 md:px-8 md:py-10">
        {/* Header */}
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
            <Clock className="h-3 w-3" />
            Your Archive
          </span>
          <h1 className="mt-4 text-[clamp(2rem,4vw,3.5rem)] font-bold leading-[1.1] tracking-[-0.02em] text-[var(--text-primary)]">
            {t("history.title")}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-[var(--text-secondary)]">
            <div className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-[var(--accent-solid)]" />
              <span className="font-medium text-[var(--text-primary)]">{creations.length}</span> total creations
            </div>
            <div className="flex items-center gap-1.5">
              <Coins className="h-3.5 w-3.5 text-[var(--accent-solid)]" />
              <span className="font-medium text-[var(--text-primary)]">
                {creations.reduce((acc, c) => acc + c.creditsUsed, 0)}
              </span> credits used
            </div>
          </div>
        </motion.div>

        {/* Toolbar — glass */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-tertiary)]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search creations..."
              className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--glass-fill)] py-2.5 pl-10 pr-4 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--accent-solid)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-solid)]/20 transition-all"
              style={{ backdropFilter: "blur(12px)" }}
            />
          </div>

          <div className="flex gap-2">
            {([
              { id: "all" as const, label: "All", icon: Layers },
              { id: "image" as const, label: "Images", icon: ImageIcon },
              { id: "video" as const, label: "Videos", icon: VideoIcon },
            ]).map((f) => {
              const Icon = f.icon;
              return (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-medium transition-all ${
                    filter === f.id
                      ? "border-[var(--accent-solid)] bg-[var(--accent-solid)]/10 text-[var(--accent-solid)]"
                      : "border-[var(--border-subtle)] bg-[var(--glass-fill)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {f.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Empty State */}
        {creations.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center rounded-[24px] border border-[var(--border-subtle)] py-24 text-center"
            style={{ background: "var(--glass-fill)", backdropFilter: "blur(20px)" }}
          >
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--border-subtle)] bg-[var(--glass-fill)]">
              <Wand2 className="h-8 w-8 text-[var(--accent-solid)] opacity-60" />
            </div>
            <h3 className="text-xl font-semibold text-[var(--text-primary)]">No creations yet</h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-[var(--text-secondary)]">
              Start generating images and videos to see your creative history here.
            </p>
            <Link
              href="/generate"
              className="mt-6 inline-flex items-center gap-2 rounded-[12px] px-6 py-3 text-sm font-semibold text-[var(--bg-void)] transition-all hover:brightness-110 hover:-translate-y-px active:scale-[0.98]"
              style={{ background: "var(--accent-gradient)" }}
            >
              <Wand2 className="h-4 w-4" />
              Start Creating
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        )}

        {/* Filtered empty */}
        {filtered.length === 0 && creations.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center rounded-[24px] border border-[var(--border-subtle)] py-20 text-center"
            style={{ background: "var(--glass-fill)", backdropFilter: "blur(20px)" }}
          >
            <Search className="h-10 w-10 text-[var(--text-tertiary)] mb-4" />
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">No matches found</h3>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Try adjusting your search or filters.
            </p>
            <button
              onClick={() => { setSearch(""); setFilter("all"); }}
              className="mt-4 text-sm font-medium text-[var(--accent-solid)] hover:underline"
            >
              Clear filters
            </button>
          </motion.div>
        )}

        {/* Masonry Grid */}
        <div className="columns-2 gap-3 md:columns-3 lg:columns-4 xl:columns-5 xl:gap-4">
          <AnimatePresence>
            {filtered.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: (i % 5) * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="group relative mb-3 break-inside-avoid overflow-hidden rounded-[20px] border border-[var(--border-subtle)] cursor-pointer lg:mb-4"
                onClick={() => setSelectedId(c.id)}
              >
                <div className="relative bg-[var(--theme-bg-elevated)]">
                  {c.resultUrl && c.status === "completed" ? (
                    <Image
                      src={c.resultUrl}
                      alt={c.prompt}
                      width={800}
                      height={c.type === "video" ? 450 : 600}
                      className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      unoptimized
                    />
                  ) : (
                    <div
                      className="flex w-full items-center justify-center"
                      style={{ aspectRatio: c.type === "video" ? "16/9" : "1/1" }}
                    >
                      {c.status === "failed" ? (
                        <div className="flex flex-col items-center gap-2 text-red-400/60">
                          <XCircle className="h-8 w-8" />
                          <span className="text-xs font-medium">Failed</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-[var(--text-tertiary)]">
                          <Loader2 className="h-8 w-8 animate-spin" />
                          <span className="text-xs font-medium">Generating...</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/50" />
                <div className="absolute inset-x-0 bottom-0 translate-y-full p-4 transition-transform duration-300 group-hover:translate-y-0">
                  <div className="flex items-center justify-between">
                    <p className="line-clamp-1 text-xs font-medium text-white/90 drop-shadow-lg">
                      {c.prompt}
                    </p>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2 text-[10px] text-white/60">
                    <span className="flex items-center gap-1">
                      {c.type === "image" ? <ImageIcon className="h-3 w-3" /> : <VideoIcon className="h-3 w-3" />}
                      {c.type}
                    </span>
                    <span>{statusIcon(c.status)}</span>
                    <span>{c.model?.displayName || c.model?.name}</span>
                  </div>
                </div>

                {/* Top-right badge */}
                <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-medium text-white/80 backdrop-blur-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <Clock className="h-3 w-3" />
                  {formatDate(c.createdAt)}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
            onClick={() => setSelectedId(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl overflow-hidden rounded-[24px] border border-[var(--border-subtle)] shadow-2xl"
              style={{ background: "var(--glass-fill)", backdropFilter: "blur(24px) saturate(140%)" }}
            >
              {/* Media */}
              <div className="relative aspect-video bg-[var(--theme-bg-elevated)] flex items-center justify-center overflow-hidden">
                {selected.resultUrl && selected.status === "completed" ? (
                  <Image
                    src={selected.resultUrl}
                    alt={selected.prompt}
                    fill
                    className="object-contain"
                    sizes="800px"
                    unoptimized
                  />
                ) : (
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-[var(--text-tertiary)]" />
                    <p className="text-sm text-[var(--text-secondary)]">{selected.status}</p>
                  </div>
                )}

                {/* Close */}
                <button
                  onClick={() => setSelectedId(null)}
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Info */}
              <div className="p-6 md:p-8 space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 rounded-full bg-[var(--accent-solid)]/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--accent-solid)]">
                        {selected.type === "image" ? <ImageIcon className="h-3 w-3" /> : <VideoIcon className="h-3 w-3" />}
                        {selected.type}
                      </span>
                      {selected.status === "completed" ? (
                        <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
                          <CheckCircle2 className="h-3 w-3" />
                          Completed
                        </span>
                      ) : selected.status === "failed" ? (
                        <span className="flex items-center gap-1 rounded-full bg-red-500/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-red-400">
                          <XCircle className="h-3 w-3" />
                          Failed
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-400">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          {selected.status}
                        </span>
                      )}
                    </div>
                    <h3 className="mt-2 font-semibold text-lg text-[var(--text-primary)]">
                      {selected.model?.displayName || selected.model?.name}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">
                      {selected.prompt}
                    </p>
                  </div>
                  {selected.resultUrl && (
                    <a
                      href={selected.resultUrl}
                      download
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--glass-fill)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      <Download className="h-4 w-4" />
                    </a>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { label: "Type", value: selected.type, icon: selected.type === "image" ? ImageIcon : VideoIcon },
                    { label: "Credits", value: selected.creditsUsed, icon: Coins },
                    { label: "Date", value: formatDate(selected.createdAt), icon: Clock },
                    { label: "Time", value: formatTime(selected.createdAt), icon: Clock },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.label}
                        className="rounded-xl border border-[var(--border-subtle)] bg-[var(--glass-fill)] p-3"
                      >
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
                          {item.label}
                        </p>
                        <div className="mt-1 flex items-center gap-1.5">
                          <Icon className="h-3.5 w-3.5 text-[var(--accent-solid)]" />
                          <p className="text-sm font-medium text-[var(--text-primary)] capitalize">{item.value}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedId(null)}
                    className="flex-1 rounded-xl border border-[var(--border-subtle)] bg-[var(--glass-fill)] py-3 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--glass-fill-hover)] transition-colors"
                  >
                    Close
                  </button>
                  <Link
                    href={`/generate?prompt=${encodeURIComponent(selected.prompt)}&type=${selected.type}`}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-[var(--bg-void)] text-center transition-all hover:brightness-110 hover:-translate-y-px active:scale-[0.98]"
                    style={{ background: "var(--accent-gradient)" }}
                  >
                    <RotateCcw className="h-4 w-4" />
                    Generate Again
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
