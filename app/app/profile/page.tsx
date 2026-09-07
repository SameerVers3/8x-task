"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  User,
  Coins,
  Wand2,
  ImageIcon,
  VideoIcon,
  Loader2,
  LogOut,
  Settings,
  ChevronRight,
  ArrowRight,
  Palette,
  Globe,
  Shield,
  CreditCard,
  Package,
} from "lucide-react";
import { AppShell } from "../components/app-shell";
import { useAuth } from "@/providers/auth-provider";
import { useTheme } from "@/providers/theme-provider";
import { useLanguage, type Language } from "@/providers/language-provider";
import { themePresets as themes } from "@/lib/themes";

interface Stats {
  totalCreations: number;
  imageCreations: number;
  videoCreations: number;
  totalCreditsUsed: number;
  recentCreations: Array<{
    id: string;
    prompt: string;
    type: string;
    status: string;
    resultUrl: string | null;
    createdAt: string;
  }>;
}

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { currentTheme, setTheme } = useTheme();
  const { lang, setLang } = useLanguage();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "settings" | "security">("overview");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/creations", { credentials: "include" });
        const data = await res.json();
        if (data.success) {
          const creations = data.data;
          setStats({
            totalCreations: creations.length,
            imageCreations: creations.filter((c: any) => c.type === "image").length,
            videoCreations: creations.filter((c: any) => c.type === "video").length,
            totalCreditsUsed: creations.reduce((acc: number, c: any) => acc + c.creditsUsed, 0),
            recentCreations: creations.slice(0, 4),
          });
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (!user) {
    return (
      <AppShell>
        <div className="mx-auto max-w-2xl px-4 py-20 text-center">
          <User className="h-16 w-16 mx-auto mb-4 text-[var(--theme-fg-subtle)]" />
          <h2 className="text-2xl font-bold">Sign in to view your profile</h2>
          <p className="mt-2 text-[var(--theme-fg-muted)]">
            Track your creations, credits, and settings.
          </p>
          <Link
            href="/generate"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--theme-accent)] px-6 py-3 text-sm font-medium text-white shadow-[var(--theme-shadow-glow)] hover:bg-[var(--theme-accent-hover)] transition-all"
          >
            Get Started <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-4 py-6 md:px-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-6 md:p-8"
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--theme-accent)]/10 text-2xl font-bold text-[var(--theme-accent)]">
                {user.email?.[0]?.toUpperCase() || "U"}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{user.email}</h1>
                <p className="text-sm text-[var(--theme-fg-muted)]">
                  Member since {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-bg-elevated)] px-4 py-2.5">
                <Coins className="h-5 w-5 text-[var(--theme-accent)]" />
                <span className="font-semibold">{user.credits} credits</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-bg-elevated)] px-4 py-2.5 text-sm font-medium text-[var(--theme-danger)] hover:bg-[var(--theme-danger)]/10 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b border-[var(--theme-border)]">
          {[
            { id: "overview" as const, label: "Overview", icon: User },
            { id: "settings" as const, label: "Settings", icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "border-[var(--theme-accent)] text-[var(--theme-accent)]"
                    : "border-transparent text-[var(--theme-fg-muted)] hover:text-[var(--theme-fg)]"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  label: "Total Creations",
                  value: stats?.totalCreations ?? 0,
                  icon: Wand2,
                  color: "text-[var(--theme-accent)]",
                  bg: "bg-[var(--theme-accent-muted)]",
                },
                {
                  label: "Images",
                  value: stats?.imageCreations ?? 0,
                  icon: ImageIcon,
                  color: "text-[var(--theme-success)]",
                  bg: "bg-[var(--theme-success)]/10",
                },
                {
                  label: "Videos",
                  value: stats?.videoCreations ?? 0,
                  icon: VideoIcon,
                  color: "text-[var(--theme-warning)]",
                  bg: "bg-[var(--theme-warning)]/10",
                },
                {
                  label: "Credits Used",
                  value: stats?.totalCreditsUsed ?? 0,
                  icon: Coins,
                  color: "text-[var(--theme-info)]",
                  bg: "bg-[var(--theme-info)]/10",
                },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-5"
                  >
                    <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${stat.bg} ${stat.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="text-2xl font-bold">{loading ? "-" : stat.value}</p>
                    <p className="text-sm text-[var(--theme-fg-muted)]">{stat.label}</p>
                  </div>
                );
              })}
            </div>

            {/* Recent Creations */}
            <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Recent Creations</h2>
                <Link
                  href="/history"
                  className="flex items-center gap-1 text-sm text-[var(--theme-accent)] hover:underline"
                >
                  View All <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-[var(--theme-accent)]" />
                </div>
              ) : stats?.recentCreations.length ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {stats.recentCreations.map((c) => (
                    <div
                      key={c.id}
                      className="rounded-xl border border-[var(--theme-border)] overflow-hidden bg-[var(--theme-bg-elevated)] hover:border-[var(--theme-accent)]/30 transition-colors"
                    >
                      <div className="relative aspect-square">
                        {c.resultUrl ? (
                          <Image
                            src={c.resultUrl}
                            alt={c.prompt}
                            fill
                            className="object-cover"
                            sizes="200px"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-[var(--theme-fg-subtle)]">
                            <Loader2 className="h-6 w-6 animate-spin" />
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <p className="line-clamp-1 text-sm font-medium">{c.prompt}</p>
                        <p className="mt-1 text-xs text-[var(--theme-fg-muted)]">
                          {c.type} {c.status === "completed" && " Complete"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-[var(--theme-fg-muted)]">
                  <Wand2 className="h-8 w-8 mx-auto mb-3 opacity-40" />
                  <p>No creations yet. Start generating!</p>
                  <Link
                    href="/generate"
                    className="mt-3 inline-flex items-center gap-1 text-sm text-[var(--theme-accent)] hover:underline"
                  >
                    Create now <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Theme Selection */}
            <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--theme-accent-muted)] text-[var(--theme-accent)]">
                  <Palette className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Appearance</h3>
                  <p className="text-sm text-[var(--theme-fg-muted)]">
                    Choose a theme that fits your style
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setTheme(theme.id)}
                    className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all ${
                      currentTheme === theme.id
                        ? "border-[var(--theme-accent)] bg-[var(--theme-accent-muted)]/30"
                        : "border-[var(--theme-border)] bg-[var(--theme-bg-elevated)] hover:border-[var(--theme-accent)]/30"
                    }`}
                  >
                    <div
                      className="h-8 w-8 rounded-full border border-white/10 shadow-sm"
                      style={{ background: `linear-gradient(135deg, ${theme.colors.accent}, ${theme.colors.accentHover})` }}
                    />
                    <span className="text-xs font-medium">{theme.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Language */}
            <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--theme-accent-muted)] text-[var(--theme-accent)]">
                  <Globe className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Language</h3>
                  <p className="text-sm text-[var(--theme-fg-muted)]">
                    Select your preferred language
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {(
                  [
                    ["en", "English"],
                    ["es", "Spanish"],
                    ["fr", "French"],
                    ["de", "German"],
                    ["ja", "Japanese"],
                    ["ko", "Korean"],
                    ["zh", "Chinese"],
                    ["ar", "Arabic"],
                    ["hi", "Hindi"],
                    ["pt", "Portuguese"],
                  ] as [Language, string][]
                ).map(([code, name]) => (
                  <button
                    key={code}
                    onClick={() => setLang(code)}
                    className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                      lang === code
                        ? "border-[var(--theme-accent)] bg-[var(--theme-accent-muted)]/30 text-[var(--theme-accent)]"
                        : "border-[var(--theme-border)] bg-[var(--theme-bg-elevated)] text-[var(--theme-fg)] hover:border-[var(--theme-accent)]/30"
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>

            {/* Account Info */}
            <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--theme-accent-muted)] text-[var(--theme-accent)]">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Account</h3>
                  <p className="text-sm text-[var(--theme-fg-muted)]">
                    Your account details and security
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-xl border border-[var(--theme-border)] bg-[var(--theme-bg-elevated)] px-4 py-3">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-[var(--theme-fg-muted)]" />
                    <span className="text-sm">Email</span>
                  </div>
                  <span className="text-sm font-medium">{user.email}</span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-[var(--theme-border)] bg-[var(--theme-bg-elevated)] px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Package className="h-4 w-4 text-[var(--theme-fg-muted)]" />
                    <span className="text-sm">Plan</span>
                  </div>
                  <span className="rounded-full bg-[var(--theme-accent-muted)] px-3 py-1 text-xs font-medium text-[var(--theme-accent)]">
                    Free
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-[var(--theme-border)] bg-[var(--theme-bg-elevated)] px-4 py-3">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-4 w-4 text-[var(--theme-fg-muted)]" />
                    <span className="text-sm">Credits</span>
                  </div>
                  <span className="text-sm font-medium">{user.credits}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </AppShell>
  );
}
