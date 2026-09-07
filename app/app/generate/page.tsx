"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ImageIcon,
  VideoIcon,
  Wand2,
  Loader2,
  Zap,
  ArrowRight,
  Coins,
  Download,
  RotateCcw,
  Maximize2,
  Share2,
  Copy,
  Check,
  AlertTriangle,
  ChevronDown,
  RefreshCw,
} from "lucide-react";
import { AppShell } from "../components/app-shell";
import { useAuth } from "@/providers/auth-provider";
import { useLanguage } from "@/providers/language-provider";

interface Model {
  id: string;
  name: string;
  displayName: string;
  type: string;
  creditCost: number;
  config: Record<string, any>;
}

interface Prompt {
  id: string;
  name: string;
  displayName: string;
  type: string;
  prompt: string;
  description: string | null;
}

interface GenerationResult {
  id: string;
  status: string;
  type: string;
  prompt: string;
  creditsUsed: number;
  createdAt: string;
  resultUrl?: string;
}

function GeneratePage() {
  const { user, setIsAuthModalOpen } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"image" | "video">("image");
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedStyle, setSelectedStyle] = useState<string>("");
  const [width, setWidth] = useState(1024);
  const [height, setHeight] = useState(1024);
  const [seed, setSeed] = useState<number | undefined>(undefined);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const [models, setModels] = useState<Model[]>([]);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const activeModels = models.filter((m) => m.type === activeTab);
  const activePrompts = prompts.filter((p) => p.type === activeTab);
  const selectedModelData = activeModels.find((m) => m.id === selectedModel);
  const creditCost = selectedModelData?.creditCost || 0;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [modelsRes, promptsRes] = await Promise.all([
          fetch("/api/models"),
          fetch("/api/prompts"),
        ]);
        const modelsData = await modelsRes.json();
        const promptsData = await promptsRes.json();
        if (modelsData.success) {
          setModels(modelsData.data);
          const defaultModel = modelsData.data.find((m: Model) => m.type === "image");
          if (defaultModel) setSelectedModel(defaultModel.id);
        }
        if (promptsData.success) setPrompts(promptsData.data);
      } catch {
        // silent
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, []);

  // Update model selection when tab changes
  useEffect(() => {
    const typeModels = models.filter((m) => m.type === activeTab);
    if (typeModels.length > 0 && !typeModels.find((m) => m.id === selectedModel)) {
      setSelectedModel(typeModels[0].id);
    }
  }, [activeTab, models, selectedModel]);

  const handleGenerate = async () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }
    if (!selectedModel) {
      setError("Please select a model");
      return;
    }
    if (user.credits < creditCost) {
      setError("Insufficient credits. Please upgrade your plan.");
      return;
    }

    setError("");
    setGenerating(true);
    setResult(null);

    try {
      const res = await fetch("/api/creations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          prompt: prompt.trim(),
          negativePrompt: negativePrompt.trim() || undefined,
          modelId: selectedModel,
          systemPromptId: selectedStyle || undefined,
          width: activeTab === "image" ? width : undefined,
          height: activeTab === "image" ? height : undefined,
          seed: seed || undefined,
          nologo: true,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.data.creation);
        // Poll for status
        pollStatus(data.data.creation.id);
      } else {
        setError(data.error || "Generation failed");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const pollStatus = useCallback(async (id: string) => {
    const check = async () => {
      try {
        const res = await fetch(`/api/creations/${id}`, { credentials: "include" });
        const data = await res.json();
        if (data.success) {
          setResult((prev) =>
            prev ? { ...prev, status: data.data.status, resultUrl: data.data.resultUrl } : null
          );
          if (data.data.status === "pending" || data.data.status === "processing") {
            setTimeout(check, 3000);
          }
        }
      } catch {
        // silent
      }
    };
    check();
  }, []);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const presetSizes = [
    { label: "1:1", w: 1024, h: 1024 },
    { label: "16:9", w: 1280, h: 720 },
    { label: "9:16", w: 720, h: 1280 },
    { label: "4:3", w: 1024, h: 768 },
    { label: "3:2", w: 1200, h: 800 },
  ];

  if (loadingData) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[60dvh]">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--theme-accent)]" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold md:text-3xl">{t("generate.title")}</h1>
          <p className="mt-1 text-[var(--theme-fg-muted)]">
            Describe your vision and let AI bring it to life
          </p>
        </motion.div>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-[1fr,360px]">
          {/* Left: Controls */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Tabs */}
            <div className="flex gap-2 p-1 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)]">
              {[
                { id: "image" as const, label: t("generate.image"), icon: ImageIcon },
                { id: "video" as const, label: t("generate.video"), icon: VideoIcon },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? "bg-[var(--theme-accent)] text-white shadow-[var(--theme-shadow-md)]"
                        : "text-[var(--theme-fg-muted)] hover:text-[var(--theme-fg)]"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Prompt */}
            <div className="space-y-3">
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={t("generate.prompt.placeholder")}
                  rows={4}
                  className="w-full resize-none rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-4 text-sm text-[var(--theme-fg)] placeholder:text-[var(--theme-fg-subtle)] focus:border-[var(--theme-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--theme-accent)]/20 transition-all"
                />
                <div className="absolute bottom-3 right-3 flex gap-1">
                  <button
                    onClick={handleCopyPrompt}
                    className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--theme-bg-elevated)] text-[var(--theme-fg-muted)] hover:text-[var(--theme-fg)] transition-colors"
                  >
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <button
                onClick={() => setNegativePrompt((p) => (p ? "" : "blurry, low quality, distorted, watermark, text, deformed, bad anatomy"))}
                className="text-xs text-[var(--theme-fg-subtle)] hover:text-[var(--theme-accent)] transition-colors flex items-center gap-1"
              >
                <ChevronDown className={`h-3 w-3 transition-transform ${negativePrompt ? "rotate-180" : ""}`} />
                {negativePrompt ? "Hide" : "Add"} negative prompt
              </button>

              <AnimatePresence>
                {negativePrompt && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                  >
                    <textarea
                      value={negativePrompt}
                      onChange={(e) => setNegativePrompt(e.target.value)}
                      placeholder="Things to avoid in the generation..."
                      rows={2}
                      className="w-full resize-none rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-3 text-sm text-[var(--theme-fg)] placeholder:text-[var(--theme-fg-subtle)] focus:border-[var(--theme-accent)] focus:outline-none transition-all"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Model & Style */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--theme-fg-subtle)]">
                  {t("generate.model")}
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] px-4 py-3 text-sm text-[var(--theme-fg)] focus:border-[var(--theme-accent)] focus:outline-none transition-colors appearance-none cursor-pointer"
                >
                  {activeModels.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.displayName} - {m.creditCost} credits
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--theme-fg-subtle)]">
                  {t("generate.style")}
                </label>
                <select
                  value={selectedStyle}
                  onChange={(e) => setSelectedStyle(e.target.value)}
                  className="w-full rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] px-4 py-3 text-sm text-[var(--theme-fg)] focus:border-[var(--theme-accent)] focus:outline-none transition-colors appearance-none cursor-pointer"
                >
                  <option value="">No style (raw)</option>
                  {activePrompts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.displayName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Image Settings */}
            <AnimatePresence mode="wait">
              {activeTab === "image" && (
                <motion.div
                  key="image-settings"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[var(--theme-fg-subtle)]">
                      Aspect Ratio
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {presetSizes.map((size) => (
                        <button
                          key={size.label}
                          onClick={() => {
                            setWidth(size.w);
                            setHeight(size.h);
                          }}
                          className={`rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                            width === size.w && height === size.h
                              ? "border-[var(--theme-accent)] bg-[var(--theme-accent-muted)] text-[var(--theme-accent)]"
                              : "border-[var(--theme-border)] bg-[var(--theme-surface)] text-[var(--theme-fg-muted)] hover:text-[var(--theme-fg)]"
                          }`}
                        >
                          {size.label} ({size.w}x{size.h})
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-[var(--theme-fg-subtle)]">
                        Width
                      </label>
                      <input
                        type="number"
                        value={width}
                        onChange={(e) => setWidth(Number(e.target.value))}
                        min={64}
                        max={4096}
                        step={64}
                        className="w-full rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] px-4 py-3 text-sm text-[var(--theme-fg)] focus:border-[var(--theme-accent)] focus:outline-none transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-[var(--theme-fg-subtle)]">
                        Height
                      </label>
                      <input
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(Number(e.target.value))}
                        min={64}
                        max={4096}
                        step={64}
                        className="w-full rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] px-4 py-3 text-sm text-[var(--theme-fg)] focus:border-[var(--theme-accent)] focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold uppercase tracking-wider text-[var(--theme-fg-subtle)]">
                        Seed (optional)
                      </label>
                      <button
                        onClick={() => setSeed(Math.floor(Math.random() * 999999))}
                        className="text-xs text-[var(--theme-accent)] hover:underline"
                      >
                        Randomize
                      </button>
                    </div>
                    <input
                      type="number"
                      value={seed || ""}
                      onChange={(e) => setSeed(e.target.value ? Number(e.target.value) : undefined)}
                      placeholder="Leave empty for random"
                      className="w-full rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] px-4 py-3 text-sm text-[var(--theme-fg)] placeholder:text-[var(--theme-fg-subtle)] focus:border-[var(--theme-accent)] focus:outline-none transition-colors"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 rounded-xl bg-[var(--theme-danger)]/10 px-4 py-3 text-sm text-[var(--theme-danger)]"
              >
                <AlertTriangle className="h-4 w-4 shrink-0" />
                {error}
              </motion.div>
            )}

            {/* Generate Button */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="group flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--theme-accent)] py-4 text-base font-medium text-white shadow-[var(--theme-shadow-glow)] hover:bg-[var(--theme-accent-hover)] transition-all disabled:opacity-50"
              >
                {generating ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-5 w-5" />
                    {t("generate.button")}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>

              <div className="flex items-center gap-1.5 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] px-4 py-3 text-sm font-medium text-[var(--theme-fg-muted)]">
                <Coins className="h-4 w-4 text-[var(--theme-accent)]" />
                {creditCost} {t("generate.credits")}
              </div>
            </div>
          </motion.div>

          {/* Right: Result / Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-surface)] overflow-hidden">
              <div className="border-b border-[var(--theme-border)] px-4 py-3 flex items-center justify-between">
                <span className="text-sm font-medium text-[var(--theme-fg-muted)]">
                  Result
                </span>
                {result && result.status !== "completed" && (
                  <span className="flex items-center gap-1.5 text-xs text-[var(--theme-warning)]">
                    <RefreshCw className="h-3 w-3 animate-spin" />
                    {result.status}
                  </span>
                )}
              </div>

              <div className="aspect-square relative flex items-center justify-center bg-[var(--theme-bg)]">
                <AnimatePresence mode="wait">
                  {result && result.resultUrl ? (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative h-full w-full"
                    >
                      <Image
                        src={result.resultUrl}
                        alt="Generated result"
                        fill
                        className="object-contain"
                        sizes="360px"
                      />
                      <div className="absolute bottom-4 right-4 flex gap-2">
                        <a
                          href={result.resultUrl}
                          download
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--theme-bg-glass)] backdrop-blur-sm text-[var(--theme-fg)] hover:bg-[var(--theme-accent)] hover:text-white transition-colors"
                        >
                          <Download className="h-4 w-4" />
                        </a>
                        <button
                          onClick={handleCopyPrompt}
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--theme-bg-glass)] backdrop-blur-sm text-[var(--theme-fg)] hover:bg-[var(--theme-accent)] hover:text-white transition-colors"
                        >
                          <Share2 className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.div>
                  ) : generating || (result && result.status === "processing") ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center gap-4 text-[var(--theme-fg-muted)]"
                    >
                      <div className="relative h-16 w-16">
                        <div className="absolute inset-0 rounded-full border-2 border-[var(--theme-border)]" />
                        <div className="absolute inset-0 rounded-full border-2 border-t-[var(--theme-accent)] animate-spin" />
                      </div>
                      <p className="text-sm">Creating your masterpiece...</p>
                      <p className="text-xs text-[var(--theme-fg-subtle)]">
                        This may take 10-30 seconds
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center gap-3 text-[var(--theme-fg-subtle)]"
                    >
                      <Sparkles className="h-10 w-10 opacity-30" />
                      <p className="text-sm">Your creation will appear here</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Recent generations */}
            <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-4">
              <h3 className="text-sm font-semibold mb-3">Recent</h3>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-lg bg-[var(--theme-bg-elevated)] border border-[var(--theme-border)] overflow-hidden relative group"
                  >
                    <Image
                      src={`https://image.pollinations.ai/prompt/example%20art%20${i}%20abstract?width=120&height=120&nologo=true&model=flux`}
                      alt="Recent"
                      fill
                      className="object-cover opacity-50 group-hover:opacity-80 transition-opacity"
                      sizes="120px"
                    />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AppShell>
  );
}

export default function Generate() {
  return <GeneratePage />;
}
