"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ImageIcon,
  VideoIcon,
  Wand2,
  Loader2,
  ArrowRight,
  Coins,
  Download,
  Share2,
  Copy,
  Check,
  AlertTriangle,
  ChevronDown,
  RefreshCw,
  ChevronRight,
  Heart,
  Clapperboard,
  X,
  Maximize2,
  Layers,
  Crop,
  Dices,
  Minus,
  Aperture,
  PanelLeft,
  PanelLeftClose,
  Undo2,
  Grid3X3,
  Type,
  SlidersHorizontal,
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

interface PromptItem {
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

const GALLERY_ITEMS = [
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/81f8e626-a822-4815-b8be-361ff65b0d88/original=true/81f8e626-a822-4815-b8be-361ff65b0d88.jpeg", author: "PaperbackLion", w: 832, h: 1216, likes: 14289 },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/a6f968b2-1220-422d-a618-ac1e938ffa62/original=true/a6f968b2-1220-422d-a618-ac1e938ffa62.jpeg", author: "Veilance", w: 832, h: 1216, likes: 12514 },
  { url: "https://image-b2.civitai.com/file/civitai-media-cache/dc437901-7093-4607-a4b5-7440b73fd54a/original", poster: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/c7238afe-3f56-41f5-92a4-ece392806c60/original=true/c7238afe-3f56-41f5-92a4-ece392806c60.jpeg", author: "HshiKoi", w: 1080, h: 1982, likes: 5937, type: "video" as const },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/cc2189cb-9ca7-4f49-83a9-a04de1cbad69/original=true/cc2189cb-9ca7-4f49-83a9-a04de1cbad69.jpeg", author: "CreativeEdge", w: 1024, h: 1024, likes: 13901 },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/0f4515bd-3db6-4032-90fe-168d1c9a4cf4/original=true/0f4515bd-3db6-4032-90fe-168d1c9a4cf4.jpeg", author: "ArtifyAI", w: 1400, h: 2046, likes: 14176 },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/4e27f2b8-68b2-4eec-9912-07c2468cfc4b/original=true/4e27f2b8-68b2-4eec-9912-07c2468cfc4b.jpeg", author: "FML2", w: 832, h: 1216, likes: 13951 },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/ec8d76a5-a3dc-473d-bffb-890df13c69b7/original=true/ec8d76a5-a3dc-473d-bffb-890df13c69b7.jpeg", author: "eduardo_saffe", w: 832, h: 1216, likes: 13942 },
  { url: "https://image-b2.civitai.com/file/civitai-media-cache/f772191e-7852-4e4f-8c96-caea89ea5acf/original", poster: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/f772191e-7852-4e4f-8c96-caea89ea5acf/original=true/f772191e-7852-4e4f-8c96-caea89ea5acf.jpeg", author: "InnocentMoon", w: 1080, h: 1650, likes: 4588, type: "video" as const },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/d2cf2d81-92de-4b3b-8fe0-492ae1044d34/original=true/d2cf2d81-92de-4b3b-8fe0-492ae1044d34.jpeg", author: "OneViolentGentleman", w: 1920, h: 2560, likes: 13071 },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/402ed7f8-ba25-421d-a68a-b11ae31af91f/original=true/402ed7f8-ba25-421d-a68a-b11ae31af91f.jpeg", author: "Rohanda", w: 450, h: 800, likes: 13240 },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/4c0ccb9b-8426-4e33-b4fe-bbca293efc32/original=true/4c0ccb9b-8426-4e33-b4fe-bbca293efc32.jpeg", author: "Mazz_W", w: 1440, h: 2880, likes: 13042 },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/c53c6b0f-ab0f-4970-8911-b9bfd66e6f21/original=true/c53c6b0f-ab0f-4970-8911-b9bfd66e6f21.jpeg", author: "Imperativ", w: 768, h: 1280, likes: 12448 },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/fd4e0f10-aa6f-42f5-8bc0-5dba35ad2a13/original=true/fd4e0f10-aa6f-42f5-8bc0-5dba35ad2a13.jpeg", author: "highCastle", w: 1024, h: 1536, likes: 11928 },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/bc6700f4-7fd3-4fc8-84ce-dcb154161850/original=true/bc6700f4-7fd3-4fc8-84ce-dcb154161850.jpeg", author: "Tommu", w: 1080, h: 1680, likes: 12074 },
  { url: "https://image-b2.civitai.com/file/civitai-media-cache/d8da3286-43a4-4cdc-a964-7161307a55d6/original", poster: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/d8da3286-43a4-4cdc-a964-7161307a55d6/original=true/d8da3286-43a4-4cdc-a964-7161307a55d6.jpeg", author: "SirMarcus", w: 864, h: 1280, likes: 5011, type: "video" as const },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/ab2daea7-2269-436b-acad-e6c73ee8af83/original=true/ab2daea7-2269-436b-acad-e6c73ee8af83.jpeg", author: "AkiAICreator", w: 720, h: 1280, likes: 11448 },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/afcab5fa-e580-489a-9ea8-bca23534be08/original=true/afcab5fa-e580-489a-9ea8-bca23534be08.jpeg", author: "Asto556", w: 832, h: 1216, likes: 11582 },
];

function formatLikes(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return String(n);
}

function SidebarSection({
  icon: Icon,
  title,
  children,
  defaultOpen = true,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-t border-[var(--border-subtle)] pt-4">
      <button
        onClick={() => setOpen((s) => !s)}
        className="mb-3 flex w-full items-center justify-between text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)] transition-colors hover:text-[var(--text-secondary)]"
      >
        <span className="flex items-center gap-2">
          <Icon className="h-3.5 w-3.5" />
          {title}
        </span>
        <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${open ? "" : "-rotate-90"}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AspectChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 rounded-xl border px-2.5 py-2 transition-all ${
        active
          ? "border-[var(--accent-solid)] bg-[var(--accent-solid)]/10 text-[var(--accent-solid)]"
          : "border-[var(--border-subtle)] bg-[var(--bg-elevated-2)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
      }`}
    >
      <div
        className={`rounded-[2px] border-2 ${active ? "border-[var(--accent-solid)]" : "border-current"} ${
          label === "1:1" ? "h-4 w-4" : label === "16:9" ? "h-2.5 w-5" : label === "9:16" ? "h-5 w-2.5" : label === "4:3" ? "h-3.5 w-4.5" : "h-3 w-4.5"
        }`}
      />
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}

function GeneratePage() {
  const { user, setIsAuthModalOpen } = useAuth();
  const { t } = useLanguage();
  const canvasRef = useRef<HTMLDivElement>(null);

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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [fullResult, setFullResult] = useState(false);

  const [models, setModels] = useState<Model[]>([]);
  const [prompts, setPrompts] = useState<PromptItem[]>([]);
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

  useEffect(() => {
    const typeModels = models.filter((m) => m.type === activeTab);
    if (typeModels.length > 0 && !typeModels.find((m) => m.id === selectedModel)) {
      setSelectedModel(typeModels[0].id);
    }
  }, [activeTab, models, selectedModel]);

  const handleGenerate = async () => {
    if (!user) { setIsAuthModalOpen(true); return; }
    if (!prompt.trim()) { setError("Please enter a prompt"); return; }
    if (!selectedModel) { setError("Please select a model"); return; }
    if (user.credits < creditCost) { setError("Insufficient credits. Please upgrade your plan."); return; }

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
      } catch { /* silent */ }
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
        <div className="relative flex min-h-[70dvh] flex-col items-center justify-center px-6">
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent-solid)] opacity-[0.03] blur-[150px]" />
          </div>
          <div className="relative h-16 w-16">
            <div className="absolute inset-0 rounded-full border-2 border-[var(--border-subtle)]" />
            <div className="absolute inset-0 rounded-full border-2 border-t-[var(--accent-solid)] animate-spin" />
          </div>
          <p className="mt-4 text-sm text-[var(--text-secondary)]">Loading studio...</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="flex min-h-[calc(100dvh-4rem)] flex-col">
        {/* ─── Workspace ─── */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar — all controls */}
          <AnimatePresence initial={false}>
            {sidebarOpen && (
              <motion.aside
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 320, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="flex shrink-0 flex-col overflow-hidden border-r border-[var(--border-subtle)] bg-[var(--bg-elevated)]/60"
              >
                <div className="flex flex-1 flex-col overflow-y-auto">
                  {/* Header / Tabs */}
                  <div className="sticky top-0 z-10 border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)]/90 px-5 py-4 backdrop-blur-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[var(--text-primary)]">
                        <Sparkles className="h-4 w-4 text-[var(--accent-solid)]" />
                        <span className="text-sm font-semibold">Fluid Studio</span>
                      </div>
                      <button
                        onClick={() => setSidebarOpen(false)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--border-subtle)] text-[var(--text-tertiary)] transition-colors hover:text-[var(--text-primary)]"
                      >
                        <PanelLeftClose className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="mt-3 flex gap-1 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-void)] p-1">
                      {[
                        { id: "image" as const, label: "Image", icon: ImageIcon },
                        { id: "video" as const, label: "Video", icon: VideoIcon },
                      ].map((tab) => {
                        const Icon = tab.icon;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-all ${
                              activeTab === tab.id
                                ? "bg-[var(--accent-solid)] text-white shadow-sm"
                                : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
                            }`}
                          >
                            <Icon className="h-3.5 w-3.5" />
                            {tab.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-5 px-5 py-5">
                    {/* Prompt */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
                        <Type className="h-3.5 w-3.5" />
                        Prompt
                      </label>
                      <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="A cyberpunk city at night, neon lights reflecting on wet streets, cinematic, 8k..."
                        rows={5}
                        className="w-full resize-none rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-void)] px-3.5 py-3 text-sm leading-relaxed text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--accent-solid)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-solid)]/15 transition-all"
                      />
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => setNegativePrompt((p) => (p ? "" : "blurry, low quality, distorted, watermark, text, deformed, bad anatomy"))}
                          className={`text-[11px] font-medium transition-colors ${
                            negativePrompt ? "text-[var(--accent-solid)]" : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
                          }`}
                        >
                          {negativePrompt ? "- Hide negative prompt" : "+ Add negative prompt"}
                        </button>
                        <span className="text-[11px] text-[var(--text-tertiary)]">{prompt.length} chars</span>
                      </div>
                      {negativePrompt && (
                        <textarea
                          value={negativePrompt}
                          onChange={(e) => setNegativePrompt(e.target.value)}
                          placeholder="Things to avoid..."
                          rows={3}
                          className="w-full resize-none rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-void)] px-3.5 py-2.5 text-xs leading-relaxed text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--accent-solid)] focus:outline-none transition-all"
                        />
                      )}
                    </div>

                    {/* Generate button */}
                    <div className="space-y-2">
                      <button
                        onClick={handleGenerate}
                        disabled={generating}
                        className="group flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-[var(--bg-void)] transition-all hover:brightness-110 hover:-translate-y-px active:scale-[0.98] disabled:opacity-60"
                        style={{ background: "var(--accent-gradient)" }}
                      >
                        {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                        {generating ? "Generating..." : "Generate"}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </button>
                      <div className="flex items-center justify-between text-xs text-[var(--text-tertiary)]">
                        <span className="flex items-center gap-1">
                          <Coins className="h-3 w-3 text-[var(--accent-solid)]" />
                          {creditCost} credits
                        </span>
                        <span className="text-[10px] uppercase tracking-wider">
                          {activeTab === "image" ? `${width}×${height}` : "Video"}
                        </span>
                      </div>
                    </div>

                    {/* Error */}
                    <AnimatePresence>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden rounded-lg bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400 flex items-center gap-2"
                        >
                          <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                          {error}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Model */}
                    <SidebarSection icon={Layers} title="Model">
                      <select
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-void)] px-3 py-2.5 text-sm text-[var(--text-primary)] focus:border-[var(--accent-solid)] focus:outline-none appearance-none cursor-pointer"
                      >
                        {activeModels.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.displayName} — {m.creditCost} cr
                          </option>
                        ))}
                      </select>
                    </SidebarSection>

                    {/* Style */}
                    <SidebarSection icon={Sparkles} title="Style Preset">
                      <select
                        value={selectedStyle}
                        onChange={(e) => setSelectedStyle(e.target.value)}
                        className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-void)] px-3 py-2.5 text-sm text-[var(--text-primary)] focus:border-[var(--accent-solid)] focus:outline-none appearance-none cursor-pointer"
                      >
                        <option value="">No style (raw)</option>
                        {activePrompts.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.displayName}
                          </option>
                        ))}
                      </select>
                    </SidebarSection>

                    {/* Aspect Ratio */}
                    {activeTab === "image" && (
                      <SidebarSection icon={Crop} title="Aspect Ratio">
                        <div className="flex flex-wrap gap-2">
                          {presetSizes.map((size) => (
                            <AspectChip
                              key={size.label}
                              label={size.label}
                              active={width === size.w && height === size.h}
                              onClick={() => { setWidth(size.w); setHeight(size.h); }}
                            />
                          ))}
                        </div>
                      </SidebarSection>
                    )}

                    {/* Dimensions */}
                    {activeTab === "image" && (
                      <SidebarSection icon={Grid3X3} title="Dimensions" defaultOpen={false}>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">Width</label>
                            <input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} min={64} max={4096} step={64} className="mt-1 w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-void)] px-3 py-2 text-sm text-[var(--text-primary)] focus:border-[var(--accent-solid)] focus:outline-none" />
                          </div>
                          <div>
                            <label className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">Height</label>
                            <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} min={64} max={4096} step={64} className="mt-1 w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-void)] px-3 py-2 text-sm text-[var(--text-primary)] focus:border-[var(--accent-solid)] focus:outline-none" />
                          </div>
                        </div>
                      </SidebarSection>
                    )}

                    {/* Seed */}
                    <SidebarSection icon={Dices} title="Seed" defaultOpen={false}>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={seed || ""}
                          onChange={(e) => setSeed(e.target.value ? Number(e.target.value) : undefined)}
                          placeholder="Random"
                          className="flex-1 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-void)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--accent-solid)] focus:outline-none"
                        />
                        <button
                          onClick={() => setSeed(Math.floor(Math.random() * 999999))}
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-void)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                          title="Randomize"
                        >
                          <Undo2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </SidebarSection>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Right Canvas */}
          <div ref={canvasRef} className="relative flex-1 overflow-y-auto bg-[var(--bg-void)]">
            {/* Sidebar toggle when closed */}
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="absolute left-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--glass-fill)] text-[var(--text-tertiary)] backdrop-blur-sm transition-colors hover:text-[var(--text-primary)]"
              >
                <PanelLeft className="h-4 w-4" />
              </button>
            )}

            <div className="mx-auto flex min-h-full max-w-5xl flex-col items-center justify-center p-6 md:p-10">
              <AnimatePresence mode="wait">
                {result && result.resultUrl ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.96, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: 20 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full"
                  >
                    {/* Toolbar */}
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
                        <span className="text-sm font-medium text-[var(--text-primary)]">Completed</span>
                        <span className="text-xs text-[var(--text-tertiary)]">· {creditCost} credits</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={handleCopyPrompt} className="flex h-9 items-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--glass-fill)] px-3 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]">
                          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                          <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
                        </button>
                        <a href={result.resultUrl} download className="flex h-9 items-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--glass-fill)] px-3 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]">
                          <Download className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">Download</span>
                        </a>
                        <button onClick={() => setFullResult(true)} className="flex h-9 items-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--glass-fill)] px-3 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]">
                          <Maximize2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Image */}
                    <div
                      className="relative w-full overflow-hidden rounded-[20px] border border-[var(--border-subtle)] shadow-[0_0_60px_rgba(124,58,237,0.06)]"
                      style={{ background: "var(--glass-fill)", backdropFilter: "blur(8px)" }}
                    >
                      <div className="relative bg-[var(--bg-void)]" style={{ aspectRatio: `${width} / ${height}` }}>
                        <Image src={result.resultUrl} alt="Generated" fill className="object-contain" sizes="(max-width: 1024px) 100vw, 1024px" unoptimized />
                      </div>
                    </div>
                  </motion.div>
                ) : generating || (result && result.status === "processing") ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-6"
                  >
                    <div className="relative h-24 w-24">
                      <div className="absolute inset-0 rounded-full border-[3px] border-[var(--border-subtle)]" />
                      <div className="absolute inset-0 rounded-full border-[3px] border-t-transparent border-[var(--accent-solid)] animate-spin" />
                      <div className="absolute inset-3 rounded-full border-[2px] border-[var(--border-subtle)]/50" />
                      <div className="absolute inset-3 rounded-full border-[2px] border-b-transparent border-[var(--accent-solid)]/60 animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-[var(--text-primary)]">Creating your masterpiece</p>
                      <p className="mt-1 text-sm text-[var(--text-secondary)]">This may take 10–30 seconds</p>
                    </div>
                    <div className="h-1.5 w-48 overflow-hidden rounded-full bg-[var(--border-subtle)]">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: "var(--accent-gradient)" }}
                        animate={{ width: ["0%", "40%", "60%", "80%", "100%"] }}
                        transition={{ duration: 8, ease: "easeInOut", repeat: Infinity }}
                      />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-5 text-center"
                  >
                    <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-[var(--border-subtle)] bg-[var(--glass-fill)]">
                      <Aperture className="h-8 w-8 text-[var(--accent-solid)] opacity-40" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-[var(--text-primary)]">Your canvas is ready</p>
                      <p className="mt-1 text-sm text-[var(--text-secondary)]">
                        Write a prompt in the sidebar and hit Generate.
                      </p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2">
                      {[
                        "A cyberpunk city at night",
                        "A serene Japanese garden",
                        "A futuristic spaceship interior",
                        "An oil painting of a mountain",
                      ].map((chip) => (
                        <button
                          key={chip}
                          onClick={() => setPrompt(chip)}
                          className="rounded-full border border-[var(--border-subtle)] bg-[var(--glass-fill)] px-4 py-1.5 text-xs text-[var(--text-secondary)] transition-all hover:border-[var(--accent-solid)]/30 hover:text-[var(--text-primary)]"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Gallery below canvas ─── */}
      <section className="border-t border-[var(--border-subtle)] px-6 py-20 md:px-16 md:py-28">
        <div className="mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mb-12 flex items-end justify-between"
          >
            <div>
              <p className="text-[0.75rem] font-semibold uppercase tracking-[0.06em] text-[var(--accent-solid)]">
                Community Gallery
              </p>
              <h2 className="mt-2 text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-[var(--text-primary)]">
                Fluid Gallery
              </h2>
              <div className="mt-3 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent-solid)] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent-solid)]" />
                </span>
                <p className="text-sm text-[var(--text-secondary)]">50,000+ creations right now</p>
              </div>
            </div>
            <Link href="/generate" className="hidden items-center gap-1 text-sm font-medium text-[var(--accent-solid)] transition-colors hover:underline sm:flex">
              Explore all <ChevronRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <div className="columns-2 gap-3 md:columns-3 lg:columns-4 xl:columns-5 xl:gap-4">
            {GALLERY_ITEMS.map((item, i) =>
              "type" in item && item.type === "video" ? (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: (i % 5) * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  className="group relative mb-3 break-inside-avoid overflow-hidden rounded-[20px] border border-[var(--border-subtle)] lg:mb-4"
                >
                  <video src={(item as any).url} poster={(item as any).poster} muted loop playsInline autoPlay preload="metadata" className="w-full object-cover" style={{ aspectRatio: `${item.w} / ${item.h}` }} />
                  <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-medium text-white/80 backdrop-blur-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <Clapperboard className="h-3 w-3" /> Video
                  </div>
                  <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/40" />
                  <div className="absolute inset-x-0 bottom-0 translate-y-full p-4 transition-transform duration-300 group-hover:translate-y-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-white/90 drop-shadow-lg">by {item.author}</p>
                      <div className="flex items-center gap-1 text-white/80">
                        <Heart className="h-3 w-3 fill-white/80" />
                        <span className="text-[10px] font-medium">{formatLikes(item.likes)}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: (i % 5) * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  className="group relative mb-3 break-inside-avoid overflow-hidden rounded-[20px] border border-[var(--border-subtle)] lg:mb-4"
                >
                  <Image src={item.url} alt={`AI art by ${item.author}`} width={item.w} height={item.h} className="w-full object-cover transition-transform duration-700 group-hover:scale-105" unoptimized />
                  <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/40" />
                  <div className="absolute inset-x-0 bottom-0 translate-y-full p-4 transition-transform duration-300 group-hover:translate-y-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-white/90 drop-shadow-lg">by {item.author}</p>
                      <div className="flex items-center gap-1 text-white/80">
                        <Heart className="h-3 w-3 fill-white/80" />
                        <span className="text-[10px] font-medium">{formatLikes(item.likes)}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Fullscreen modal */}
      <AnimatePresence>
        {fullResult && result?.resultUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            onClick={() => setFullResult(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-h-[90dvh] max-w-[90dvw]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={result.resultUrl} alt="Full" width={1200} height={1200} className="max-h-[90dvh] max-w-[90dvw] rounded-2xl object-contain" unoptimized />
              <button onClick={() => setFullResult(false)} className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm hover:bg-black/80 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}

export default function Generate() {
  return <GeneratePage />;
}
