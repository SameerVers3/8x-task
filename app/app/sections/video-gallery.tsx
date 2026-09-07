"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Heart, Eye, Clapperboard } from "lucide-react";

const VIDEO_ITEMS = [
  { url: "https://image-b2.civitai.com/file/civitai-media-cache/dc437901-7093-4607-a4b5-7440b73fd54a/original", poster: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/c7238afe-3f56-41f5-92a4-ece392806c60/original=true/c7238afe-3f56-41f5-92a4-ece392806c60.jpeg", author: "HshiKoi", w: 1080, h: 1982, likes: 5937, views: 12000 },
  { url: "https://image-b2.civitai.com/file/civitai-media-cache/f772191e-7852-4e4f-8c96-caea89ea5acf/original", poster: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/f772191e-7852-4e4f-8c96-caea89ea5acf/original=true/f772191e-7852-4e4f-8c96-caea89ea5acf.jpeg", author: "InnocentMoon", w: 1080, h: 1650, likes: 4588, views: 9500 },
  { url: "https://image-b2.civitai.com/file/civitai-media-cache/d8da3286-43a4-4cdc-a964-7161307a55d6/original", poster: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/d8da3286-43a4-4cdc-a964-7161307a55d6/original=true/d8da3286-43a4-4cdc-a964-7161307a55d6.jpeg", author: "SirMarcus", w: 864, h: 1280, likes: 5011, views: 10200 },
  { url: "https://image-b2.civitai.com/file/civitai-media-cache/bb00f484-6548-46e4-9e13-e04641e278a7/original", poster: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/bb00f484-6548-46e4-9e13-e04641e278a7/original=true/bb00f484-6548-46e4-9e13-e04641e278a7.jpeg", author: "pagain510436", w: 1080, h: 1452, likes: 4622, views: 9800 },
  { url: "https://image-b2.civitai.com/file/civitai-media-cache/b9e98462-3c9a-4a69-9631-2c25a7fc7d0a/original", poster: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/b9e98462-3c9a-4a69-9631-2c25a7fc7d0a/original=true/b9e98462-3c9a-4a69-9631-2c25a7fc7d0a.jpeg", author: "lug_L", w: 528, h: 960, likes: 4097, views: 8500 },
  { url: "https://image-b2.civitai.com/file/civitai-media-cache/83cfbf28-d7ee-4fa8-bcd9-be5e11bad3b4/original", poster: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/83cfbf28-d7ee-4fa8-bcd9-be5e11bad3b4/original=true/83cfbf28-d7ee-4fa8-bcd9-be5e11bad3b4.jpeg", author: "Faeia", w: 792, h: 1160, likes: 4680, views: 9400 },
  { url: "https://image-b2.civitai.com/file/civitai-media-cache/0f0f65c4-cb66-468b-85d2-4e616d279ae1/original", poster: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/0f0f65c4-cb66-468b-85d2-4e616d279ae1/original=true/0f0f65c4-cb66-468b-85d2-4e616d279ae1.jpeg", author: "RIDD", w: 1600, h: 2320, likes: 4526, views: 9100 },
  { url: "https://image-b2.civitai.com/file/civitai-media-cache/8d43a9bc-c9c9-4cf7-9c05-707bef618ab2/original", poster: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/8d43a9bc-c9c9-4cf7-9c05-707bef618ab2/original=true/8d43a9bc-c9c9-4cf7-9c05-707bef618ab2.jpeg", author: "fronyax", w: 880, h: 720, likes: 4050, views: 8200 },
  { url: "https://image-b2.civitai.com/file/civitai-media-cache/201d46cd-6567-4347-98b8-3a37a517fb4e/original", poster: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/201d46cd-6567-4347-98b8-3a37a517fb4e/original=true/201d46cd-6567-4347-98b8-3a37a517fb4e.jpeg", author: "GBRX", w: 1024, h: 1536, likes: 4471, views: 8900 },
  { url: "https://image-b2.civitai.com/file/civitai-media-cache/ced9eb94-9c77-4eeb-9290-83e1e43e0ed8/original", poster: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/ced9eb94-9c77-4eeb-9290-83e1e43e0ed8/original=true/ced9eb94-9c77-4eeb-9290-83e1e43e0ed8.jpeg", author: "schmede", w: 1080, h: 1618, likes: 4073, views: 8300 },
  { url: "https://image-b2.civitai.com/file/civitai-media-cache/d46031c7-b8d2-40d8-b5f5-0c948d6f6798/original", poster: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/d46031c7-b8d2-40d8-b5f5-0c948d6f6798/original=true/d46031c7-b8d2-40d8-b5f5-0c948d6f6798.jpeg", author: "jomcey", w: 1184, h: 1728, likes: 4406, views: 8700 },
  { url: "https://image-b2.civitai.com/file/civitai-media-cache/cea781ad-4a4f-4587-b510-c7c1e8a1ac13/original", poster: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/cea781ad-4a4f-4587-b510-c7c1e8a1ac13/original=true/cea781ad-4a4f-4587-b510-c7c1e8a1ac13.jpeg", author: "samantha1", w: 1080, h: 1934, likes: 4158, views: 8400 },
];

function formatCount(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return String(n);
}

function VideoCard({ item, index }: { item: typeof VIDEO_ITEMS[0]; index: number }) {
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

  return (
    <motion.div
      ref={wrapperRef}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: (index % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group relative mb-3 break-inside-avoid overflow-hidden rounded-[20px] border border-[var(--border-subtle)] lg:mb-4"
    >
      <video
        ref={videoRef}
        src={item.url}
        poster={item.poster}
        muted
        loop
        playsInline
        autoPlay
        preload="metadata"
        className="w-full object-cover"
        style={{ aspectRatio: `${item.w} / ${item.h}` }}
      />

      {/* Top-right video badge */}
      <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-medium text-white/80 backdrop-blur-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <Clapperboard className="h-3 w-3" />
        Video
      </div>

      {/* Bottom info */}
      <div className="absolute inset-x-0 bottom-0 translate-y-full p-3 transition-transform duration-300 group-hover:translate-y-0">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-white/90 drop-shadow-lg">by {item.author}</p>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-white/80">
              <Eye className="h-3 w-3" />
              <span className="text-[10px] font-medium">{formatCount(item.views)}</span>
            </div>
            <div className="flex items-center gap-1 text-white/80">
              <Heart className="h-3 w-3 fill-white/80" />
              <span className="text-[10px] font-medium">{formatCount(item.likes)}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function VideoGallery() {
  return (
    <section className="border-y border-[var(--border-subtle)] px-6 py-24 md:px-16" style={{ background: "var(--bg-elevated)" }}>
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
              Video Generation
            </p>
            <h2 className="mt-2 text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-[var(--text-primary)]">
              Fluid Motion
            </h2>
            <div className="mt-3 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent-solid)] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent-solid)]" />
              </span>
              <p className="text-sm text-[var(--text-secondary)]">
                12 new videos this hour
              </p>
            </div>
          </div>
          <Link
            href="/generate"
            className="hidden items-center gap-1 text-sm font-medium text-[var(--accent-solid)] transition-colors hover:underline sm:flex"
          >
            Create your own <ChevronRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <div className="columns-2 gap-4 md:columns-3 md:gap-5">
          {VIDEO_ITEMS.map((item, i) => (
            <VideoCard key={i} item={item} index={i} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/generate"
            className="inline-flex items-center gap-1 text-sm font-medium text-[var(--accent-solid)] hover:underline"
          >
            Create your own <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
