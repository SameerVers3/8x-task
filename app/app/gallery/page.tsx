"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Clapperboard,
  ChevronRight,
  Loader2,
  ImageIcon,
  VideoIcon,
  Layers,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { AppShell } from "../components/app-shell";

interface GalleryItem {
  id: string;
  prompt: string;
  type: string;
  resultUrl: string;
  createdAt: string;
  model: { displayName: string; type: string };
  user: { id: string; name: string | null; avatar: string | null };
  metadata: any;
}

interface GalleryResponse {
  success: boolean;
  data: GalleryItem[];
  pagination: { page: number; limit: number; total: number; pages: number };
}

function VideoCard({ item, index }: { item: GalleryItem; index: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const wrapper = wrapperRef.current;
    if (!video || !wrapper) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, []);

  const meta = item.metadata as any;
  const w = meta?.width || 1024;
  const h = meta?.height || 1024;

  return (
    <motion.div
      ref={wrapperRef}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: (index % 5) * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="group relative mb-3 break-inside-avoid overflow-hidden rounded-[20px] border border-[var(--border-subtle)] lg:mb-4"
    >
      <video
        ref={videoRef}
        src={item.resultUrl}
        muted
        loop
        playsInline
        autoPlay
        preload="metadata"
        className="w-full object-cover"
        style={{ aspectRatio: `${w} / ${h}` }}
      />
      <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-medium text-white/80 backdrop-blur-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <Clapperboard className="h-3 w-3" />
        Video
      </div>
      <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/40" />
      <div className="absolute inset-x-0 bottom-0 translate-y-full p-4 transition-transform duration-300 group-hover:translate-y-0">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-white/90 drop-shadow-lg">
            by {item.user.name || "Anonymous"}
          </p>
        </div>
        <p className="mt-1 line-clamp-1 text-[10px] text-white/60">{item.model.displayName}</p>
      </div>
    </motion.div>
  );
}

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState<"all" | "image" | "video">("all");
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchGallery = async (pageNum: number, append = false) => {
    try {
      const params = new URLSearchParams();
      params.set("page", String(pageNum));
      params.set("limit", "20");
      if (filter !== "all") params.set("type", filter);

      const res = await fetch(`/api/gallery?${params.toString()}`);
      const data: GalleryResponse = await res.json();

      if (data.success) {
        if (append) {
          setItems((prev) => [...prev, ...data.data]);
        } else {
          setItems(data.data);
        }
        setHasMore(pageNum < data.pagination.pages);
      } else {
        setError(data.pagination ? "" : "Failed to load gallery");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    setItems([]);
    setPage(1);
    setHasMore(true);
    fetchGallery(1, false);
  }, [filter]);

  const loadMore = () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);
    fetchGallery(nextPage, true);
  };

  return (
    <AppShell>
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/3 top-0 h-[600px] w-[600px] rounded-full bg-[var(--accent-solid)] opacity-[0.03] blur-[180px]" />
        <div className="absolute bottom-0 right-1/3 h-[500px] w-[500px] rounded-full bg-[var(--accent-solid)] opacity-[0.02] blur-[150px]" />
      </div>

      <div className="mx-auto px-4 py-6 md:px-8 md:py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <span
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[0.75rem] font-semibold uppercase tracking-[0.06em] text-[var(--accent-solid)]"
            style={{ background: "var(--glass-fill)", border: "1px solid var(--border-subtle)" }}
          >
            <Sparkles className="h-3 w-3" />
            Community
          </span>
          <h1 className="mt-4 text-[clamp(2.5rem,5vw,4rem)] font-bold leading-[1.05] tracking-[-0.03em] text-[var(--text-primary)]">
            Gallery
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-base leading-relaxed text-[var(--text-secondary)] md:text-lg">
            Explore creations from the Fluid community. Every image and video generated by our creators.
          </p>

          {/* Filter pills */}
          <div className="mt-6 flex flex-wrap gap-2">
            {[
              { id: "all" as const, label: "All", icon: Layers },
              { id: "image" as const, label: "Images", icon: ImageIcon },
              { id: "video" as const, label: "Videos", icon: VideoIcon },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-all ${
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

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="relative h-16 w-16">
              <div className="absolute inset-0 rounded-full border-2 border-[var(--border-subtle)]" />
              <div className="absolute inset-0 rounded-full border-2 border-t-[var(--accent-solid)] animate-spin" />
            </div>
            <p className="mt-4 text-sm text-[var(--text-secondary)]">Loading creations...</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center rounded-[24px] border border-[var(--border-subtle)] py-20 text-center"
            style={{ background: "var(--glass-fill)", backdropFilter: "blur(20px)" }}
          >
            <p className="text-lg font-semibold text-[var(--text-primary)]">Failed to load gallery</p>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">{error}</p>
            <button
              onClick={() => { setLoading(true); setError(""); fetchGallery(1, false); }}
              className="mt-4 rounded-xl bg-[var(--accent-solid)] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && items.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-[24px] border border-[var(--border-subtle)] py-20 text-center"
            style={{ background: "var(--glass-fill)", backdropFilter: "blur(20px)" }}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--border-subtle)] bg-[var(--glass-fill)]">
              <Sparkles className="h-8 w-8 text-[var(--accent-solid)] opacity-60" />
            </div>
            <p className="mt-5 text-lg font-semibold text-[var(--text-primary)]">No creations yet</p>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Be the first to create something amazing.
            </p>
            <Link
              href="/generate"
              className="mt-6 inline-flex items-center gap-2 rounded-[12px] px-6 py-3 text-sm font-semibold text-[var(--bg-void)] transition-all hover:brightness-110 hover:-translate-y-px active:scale-[0.98]"
              style={{ background: "var(--accent-gradient)" }}
            >
              Start Creating
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        {/* Masonry Grid */}
        {!loading && items.length > 0 && (
          <>
            <div className="columns-2 gap-3 md:columns-3 lg:columns-4 xl:columns-5 xl:gap-4">
              {items.map((item, i) =>
                item.type === "video" ? (
                  <VideoCard key={item.id} item={item} index={i} />
                ) : (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.4, delay: (i % 5) * 0.06, ease: [0.16, 1, 0.3, 1] }}
                    className="group relative mb-3 break-inside-avoid overflow-hidden rounded-[20px] border border-[var(--border-subtle)] lg:mb-4"
                  >
                    <Image
                      src={item.resultUrl}
                      alt={item.prompt}
                      width={1024}
                      height={1024}
                      className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/40" />
                    <div className="absolute inset-x-0 bottom-0 translate-y-full p-4 transition-transform duration-300 group-hover:translate-y-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-medium text-white/90 drop-shadow-lg">
                          by {item.user.name || "Anonymous"}
                        </p>
                      </div>
                      <p className="mt-1 line-clamp-1 text-[10px] text-white/60">{item.model.displayName}</p>
                    </div>
                  </motion.div>
                )
              )}
            </div>

            {/* Load more */}
            {hasMore && (
              <div className="mt-10 flex justify-center">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="flex items-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--glass-fill)] px-6 py-3 text-sm font-medium text-[var(--text-primary)] transition-all hover:bg-[var(--glass-fill-hover)] disabled:opacity-50"
                >
                  {loadingMore ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                  {loadingMore ? "Loading..." : "Load more"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}
