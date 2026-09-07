"use client";

import { useState, useEffect } from "react";
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
  Filter,
  Search,
  Maximize2,
  ArrowRight,
  LogIn,
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
        return <CheckCircle2 className="h-4 w-4 text-[var(--theme-success)]" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-[var(--theme-danger)]" />;
      case "processing":
      case "pending":
        return <Loader2 className="h-4 w-4 animate-spin text-[var(--theme-warning)]" />;
      default:
        return null;
    }
  };

  const selected = selectedId ? creations.find((c) => c.id === selectedId) : null;

  // Auth wall
  if (!isLoading && !user) {
    return (
      <AppShell>
        <div className="mx-auto max-w-2xl px-4 py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-12"
          >
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--theme-accent-muted)] text-[var(--theme-accent)]">
              <Wand2 className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold">Sign in to view your history</h2>
            <p className="mt-2 text-[var(--theme-fg-muted)]">
              Track your creations, credits, and revisit your past work anytime.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3">
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--theme-accent)] px-6 py-3 text-sm font-medium text-white shadow-[var(--theme-shadow-glow)] hover:bg-[var(--theme-accent-hover)] transition-all"
              >
                <LogIn className="h-4 w-4" />
                Sign In
              </button>
              <Link
                href="/generate"
                className="text-sm text-[var(--theme-accent)] hover:underline"
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
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
          <div className="flex items-center justify-center min-h-[50dvh]">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--theme-accent)]" />
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold md:text-3xl">{t("history.title")}</h1>
          <p className="mt-1 text-[var(--theme-fg-muted)]">
            {creations.length} total creations
          </p>
        </motion.div>

        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--theme-fg-subtle)]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search creations..."
              className="w-full rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] py-2.5 pl-10 pr-4 text-sm text-[var(--theme-fg)] placeholder:text-[var(--theme-fg-subtle)] focus:border-[var(--theme-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--theme-accent)]/20 transition-all"
            />
          </div>

          <div className="flex gap-2">
            {(["all", "image", "video"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                  filter === f
                    ? "border-[var(--theme-accent)] bg-[var(--theme-accent-muted)] text-[var(--theme-accent)]"
                    : "border-[var(--theme-border)] bg-[var(--theme-surface)] text-[var(--theme-fg-muted)] hover:text-[var(--theme-fg)]"
                }`}
              >
                {f === "all" ? "All" : f === "image" ? "Images" : "Videos"}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Empty State */}
        {creations.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-surface)] py-20 text-center"
          >
            <Wand2 className="h-12 w-12 text-[var(--theme-fg-subtle)] mb-4 opacity-40" />
            <h3 className="text-lg font-semibold">No creations yet</h3>
            <p className="mt-1 text-sm text-[var(--theme-fg-muted)] max-w-sm">
              Start generating images and videos to see them here.
            </p>
            <Link
              href="/generate"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--theme-accent)] px-6 py-3 text-sm font-medium text-white shadow-[var(--theme-shadow-glow)] hover:bg-[var(--theme-accent-hover)] transition-all"
            >
              <Wand2 className="h-4 w-4" />
              Start Creating
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        )}

        {/* Grid */}
        {filtered.length === 0 && creations.length > 0 && (
          <div className="text-center py-16 text-[var(--theme-fg-muted)]">
            <Filter className="h-8 w-8 mx-auto mb-3 opacity-40" />
            <p>No creations match your filters</p>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence>
            {filtered.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.04 }}
                className="group relative rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-surface)] overflow-hidden cursor-pointer hover:border-[var(--theme-accent)]/30 transition-colors"
                onClick={() => setSelectedId(c.id)}
              >
                <div className="relative aspect-square bg-[var(--theme-bg-elevated)]">
                  {c.resultUrl && c.status === "completed" ? (
                    <Image
                      src={c.resultUrl}
                      alt={c.prompt}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[var(--theme-fg-subtle)]">
                      {c.status === "failed" ? (
                        <XCircle className="h-8 w-8 text-[var(--theme-danger)]/50" />
                      ) : (
                        <Loader2 className="h-8 w-8 animate-spin" />
                      )}
                    </div>
                  )}
                  <div className="absolute top-3 left-3 flex h-6 items-center gap-1 rounded-md bg-[var(--theme-bg-glass)] px-2 text-xs font-medium text-[var(--theme-fg)] backdrop-blur-sm">
                    {c.type === "image" ? <ImageIcon className="h-3 w-3" /> : <VideoIcon className="h-3 w-3" />}
                    {c.type}
                  </div>
                  <div className="absolute top-3 right-3 flex h-6 items-center gap-1 rounded-md bg-[var(--theme-bg-glass)] px-2 text-xs font-medium text-[var(--theme-fg)] backdrop-blur-sm">
                    {statusIcon(c.status)}
                  </div>
                </div>
                <div className="p-4">
                  <p className="line-clamp-2 text-sm font-medium text-[var(--theme-fg)]">
                    {c.prompt}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-xs text-[var(--theme-fg-muted)]">
                    <span>{c.model?.displayName || c.model?.name}</span>
                    <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setSelectedId(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-bg)] overflow-hidden shadow-2xl"
            >
              <div className="relative aspect-video bg-[var(--theme-bg-elevated)] flex items-center justify-center">
                {selected.resultUrl && selected.status === "completed" ? (
                  <Image
                    src={selected.resultUrl}
                    alt={selected.prompt}
                    fill
                    className="object-contain"
                    sizes="800px"
                  />
                ) : (
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-[var(--theme-fg-subtle)]" />
                    <p className="text-sm text-[var(--theme-fg-muted)]">{selected.status}</p>
                  </div>
                )}
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-lg">{selected.model?.displayName || selected.model?.name}</h3>
                    <p className="text-sm text-[var(--theme-fg-muted)] mt-1">{selected.prompt}</p>
                  </div>
                  {selected.resultUrl && (
                    <a
                      href={selected.resultUrl}
                      download
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--theme-surface)] border border-[var(--theme-border)] text-[var(--theme-fg-muted)] hover:text-[var(--theme-fg)] transition-colors"
                    >
                      <Maximize2 className="h-4 w-4" />
                    </a>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface)] p-3">
                    <p className="text-xs text-[var(--theme-fg-subtle)] uppercase tracking-wider">Type</p>
                    <p className="font-medium mt-1 capitalize">{selected.type}</p>
                  </div>
                  <div className="rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface)] p-3">
                    <p className="text-xs text-[var(--theme-fg-subtle)] uppercase tracking-wider">Credits</p>
                    <p className="font-medium mt-1">{selected.creditsUsed}</p>
                  </div>
                  <div className="rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface)] p-3">
                    <p className="text-xs text-[var(--theme-fg-subtle)] uppercase tracking-wider">Date</p>
                    <p className="font-medium mt-1">{new Date(selected.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedId(null)}
                    className="flex-1 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] py-3 text-sm font-medium text-[var(--theme-fg)] hover:bg-[var(--theme-surface-hover)] transition-colors"
                  >
                    Close
                  </button>
                  <Link
                    href={`/generate?prompt=${encodeURIComponent(selected.prompt)}&type=${selected.type}`}
                    className="flex-1 rounded-xl bg-[var(--theme-accent)] py-3 text-sm font-medium text-white text-center hover:bg-[var(--theme-accent-hover)] transition-colors"
                  >
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
