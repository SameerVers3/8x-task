"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Heart, Clapperboard } from "lucide-react";

const GALLERY_ITEMS = [
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/81f8e626-a822-4815-b8be-361ff65b0d88/original=true/81f8e626-a822-4815-b8be-361ff65b0d88.jpeg", author: "PaperbackLion", w: 832, h: 1216, likes: 14289, type: "image" as const },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/a6f968b2-1220-422d-a618-ac1e938ffa62/original=true/a6f968b2-1220-422d-a618-ac1e938ffa62.jpeg", author: "Veilance", w: 832, h: 1216, likes: 12514, type: "image" as const },
  { url: "https://image-b2.civitai.com/file/civitai-media-cache/dc437901-7093-4607-a4b5-7440b73fd54a/original", poster: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/c7238afe-3f56-41f5-92a4-ece392806c60/original=true/c7238afe-3f56-41f5-92a4-ece392806c60.jpeg", author: "HshiKoi", w: 1080, h: 1982, likes: 5937, type: "video" as const },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/cc2189cb-9ca7-4f49-83a9-a04de1cbad69/original=true/cc2189cb-9ca7-4f49-83a9-a04de1cbad69.jpeg", author: "CreativeEdge", w: 1024, h: 1024, likes: 13901, type: "image" as const },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/0f4515bd-3db6-4032-90fe-168d1c9a4cf4/original=true/0f4515bd-3db6-4032-90fe-168d1c9a4cf4.jpeg", author: "ArtifyAI", w: 1400, h: 2046, likes: 14176, type: "image" as const },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/4e27f2b8-68b2-4eec-9912-07c2468cfc4b/original=true/4e27f2b8-68b2-4eec-9912-07c2468cfc4b.jpeg", author: "FML2", w: 832, h: 1216, likes: 13951, type: "image" as const },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/ec8d76a5-a3dc-473d-bffb-890df13c69b7/original=true/ec8d76a5-a3dc-473d-bffb-890df13c69b7.jpeg", author: "eduardo_saffe", w: 832, h: 1216, likes: 13942, type: "image" as const },
  { url: "https://image-b2.civitai.com/file/civitai-media-cache/f772191e-7852-4e4f-8c96-caea89ea5acf/original", poster: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/f772191e-7852-4e4f-8c96-caea89ea5acf/original=true/f772191e-7852-4e4f-8c96-caea89ea5acf.jpeg", author: "InnocentMoon", w: 1080, h: 1650, likes: 4588, type: "video" as const },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/d2cf2d81-92de-4b3b-8fe0-492ae1044d34/original=true/d2cf2d81-92de-4b3b-8fe0-492ae1044d34.jpeg", author: "OneViolentGentleman", w: 1920, h: 2560, likes: 13071, type: "image" as const },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/402ed7f8-ba25-421d-a68a-b11ae31af91f/original=true/402ed7f8-ba25-421d-a68a-b11ae31af91f.jpeg", author: "Rohanda", w: 450, h: 800, likes: 13240, type: "image" as const },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/4c0ccb9b-8426-4e33-b4fe-bbca293efc32/original=true/4c0ccb9b-8426-4e33-b4fe-bbca293efc32.jpeg", author: "Mazz_W", w: 1440, h: 2880, likes: 13042, type: "image" as const },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/c53c6b0f-ab0f-4970-8911-b9bfd66e6f21/original=true/c53c6b0f-ab0f-4970-8911-b9bfd66e6f21.jpeg", author: "Imperativ", w: 768, h: 1280, likes: 12448, type: "image" as const },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/fd4e0f10-aa6f-42f5-8bc0-5dba35ad2a13/original=true/fd4e0f10-aa6f-42f5-8bc0-5dba35ad2a13.jpeg", author: "highCastle", w: 1024, h: 1536, likes: 11928, type: "image" as const },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/bc6700f4-7fd3-4fc8-84ce-dcb154161850/original=true/bc6700f4-7fd3-4fc8-84ce-dcb154161850.jpeg", author: "Tommu", w: 1080, h: 1680, likes: 12074, type: "image" as const },
  { url: "https://image-b2.civitai.com/file/civitai-media-cache/d8da3286-43a4-4cdc-a964-7161307a55d6/original", poster: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/d8da3286-43a4-4cdc-a964-7161307a55d6/original=true/d8da3286-43a4-4cdc-a964-7161307a55d6.jpeg", author: "SirMarcus", w: 864, h: 1280, likes: 5011, type: "video" as const },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/ab2daea7-2269-436b-acad-e6c73ee8af83/original=true/ab2daea7-2269-436b-acad-e6c73ee8af83.jpeg", author: "AkiAICreator", w: 720, h: 1280, likes: 11448, type: "image" as const },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/afcab5fa-e580-489a-9ea8-bca23534be08/original=true/afcab5fa-e580-489a-9ea8-bca23534be08.jpeg", author: "Asto556", w: 832, h: 1216, likes: 11582, type: "image" as const },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/5be4f7eb-7618-406e-8889-0abc966bf4f0/original=true/5be4f7eb-7618-406e-8889-0abc966bf4f0.jpeg", author: "impossiblebearcl4060", w: 2304, h: 3456, likes: 11089, type: "image" as const },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/d57e4d81-eac9-40ed-9054-1d3b82a24f49/original=true/d57e4d81-eac9-40ed-9054-1d3b82a24f49.jpeg", author: "SomeT", w: 832, h: 1216, likes: 11708, type: "image" as const },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/9f50cbc3-98f4-4eb1-8bf6-34b40b30ad41/original=true/9f50cbc3-98f4-4eb1-8bf6-34b40b30ad41.jpeg", author: "Stu42", w: 832, h: 1216, likes: 11312, type: "image" as const },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/c0ea2c31-2551-46b4-95e4-6c3ca52a0204/original=true/c0ea2c31-2551-46b4-95e4-6c3ca52a0204.jpeg", author: "OrlandoOrso", w: 832, h: 1216, likes: 11431, type: "image" as const },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/a4d25013-1fb5-4610-8610-07a466ab2627/original=true/a4d25013-1fb5-4610-8610-07a466ab2627.jpeg", author: "Ocean3", w: 1024, h: 1536, likes: 10864, type: "image" as const },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/003eb0b8-e848-4c10-aa34-54f4f420602e/original=true/003eb0b8-e848-4c10-aa34-54f4f420602e.jpeg", author: "UnstableGen", w: 832, h: 1216, likes: 10565, type: "image" as const },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/a103c4ba-ee8c-47b8-a649-5eed4e16efb8/original=true/a103c4ba-ee8c-47b8-a649-5eed4e16efb8.jpeg", author: "a2957598", w: 832, h: 1216, likes: 11055, type: "image" as const },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/bc6061bd-5bae-408a-9718-84232693d223/original=true/bc6061bd-5bae-408a-9718-84232693d223.jpeg", author: "Stu42", w: 832, h: 1216, likes: 10953, type: "image" as const },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/0b977657-c60e-4a6d-9ffa-b81d3e90fa37/original=true/0b977657-c60e-4a6d-9ffa-b81d3e90fa37.jpeg", author: "Stu42", w: 832, h: 1216, likes: 10674, type: "image" as const },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/ac371696-874f-4bbb-a6ed-5f7a5bd3ae62/original=true/ac371696-874f-4bbb-a6ed-5f7a5bd3ae62.jpeg", author: "Dever", w: 832, h: 1216, likes: 10851, type: "image" as const },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/2eb7f731-4136-4295-a0f4-9e140c3a6c96/original=true/2eb7f731-4136-4295-a0f4-9e140c3a6c96.jpeg", author: "Entersandman", w: 832, h: 1216, likes: 10598, type: "image" as const },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/18530b55-dc8d-4320-a7d0-97c9dc613bc5/original=true/18530b55-dc8d-4320-a7d0-97c9dc613bc5.jpeg", author: "Adel_AI", w: 832, h: 1216, likes: 10386, type: "image" as const },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/26cfd41c-7ced-4c28-839e-99c0498d05ea/original=true/26cfd41c-7ced-4c28-839e-99c0498d05ea.jpeg", author: "doberman1987", w: 832, h: 1216, likes: 10484, type: "image" as const },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/877f082b-3bc4-4b6d-976f-3980bfd0f62b/original=true/877f082b-3bc4-4b6d-976f-3980bfd0f62b.jpeg", author: "FallenIncursio", w: 1664, h: 2432, likes: 10366, type: "image" as const },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/ebebea37-2512-47b9-a171-b79f5fc5b91f/original=true/ebebea37-2512-47b9-a171-b79f5fc5b91f.jpeg", author: "4ndr3w", w: 832, h: 1216, likes: 10525, type: "image" as const },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/63171c8d-6b31-41e3-ad6f-6b1052dcaf55/original=true/63171c8d-6b31-41e3-ad6f-6b1052dcaf55.jpeg", author: "DarkirStorm", w: 832, h: 1216, likes: 10172, type: "image" as const },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/6fcaf10d-d444-489e-9fe2-a945fbbd6cc3/original=true/6fcaf10d-d444-489e-9fe2-a945fbbd6cc3.jpeg", author: "freek22", w: 896, h: 1216, likes: 9838, type: "image" as const },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/0537ea36-62dd-4aab-8884-6da0e928e303/original=true/0537ea36-62dd-4aab-8884-6da0e928e303.jpeg", author: "popyay", w: 1248, h: 1824, likes: 10343, type: "image" as const },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/fb38a219-28f9-467d-b1e5-e51c650cbdd4/original=true/fb38a219-28f9-467d-b1e5-e51c650cbdd4.jpeg", author: "DreamCk", w: 1792, h: 2304, likes: 10190, type: "image" as const },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/18612c96-c21c-4bd7-aef0-21b9b57f4b7e/original=true/18612c96-c21c-4bd7-aef0-21b9b57f4b7e.jpeg", author: "EcstaticKalliope", w: 1792, h: 2304, likes: 9767, type: "image" as const },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/3723815a-6877-4f9b-a485-4680f9e360b1/original=true/3723815a-6877-4f9b-a485-4680f9e360b1.jpeg", author: "eduardo_saffe", w: 832, h: 1216, likes: 10172, type: "image" as const },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/9488af10-7f1f-4361-877b-d9cfafeab131/original=true/9488af10-7f1f-4361-877b-d9cfafeab131.jpeg", author: "invioai", w: 768, h: 1344, likes: 8981, type: "image" as const },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/d7b48ab2-4d80-4d72-859c-5e2d0533cf28/original=true/d7b48ab2-4d80-4d72-859c-5e2d0533cf28.jpeg", author: "7Zack", w: 768, h: 1216, likes: 9992, type: "image" as const },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/4cea4d6e-8cfe-4f68-ac9b-69a441f5d8f2/original=true/4cea4d6e-8cfe-4f68-ac9b-69a441f5d8f2.jpeg", author: "gonzalu", w: 1152, h: 1728, likes: 9719, type: "image" as const },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/680922a8-d5bd-4cd7-836d-eb6ae1042b8e/original=true/680922a8-d5bd-4cd7-836d-eb6ae1042b8e.jpeg", author: "Elioplasma", w: 1248, h: 1824, likes: 9660, type: "image" as const },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/0f0aba37-7625-4158-8824-e7c2f4b1c337/original=true/0f0aba37-7625-4158-8824-e7c2f4b1c337.jpeg", author: "Hizumi___", w: 3328, h: 4864, likes: 9413, type: "image" as const },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/0a828b7f-26e5-4b34-9249-473ba586edca/original=true/0a828b7f-26e5-4b34-9249-473ba586edca.jpeg", author: "Ajuro", w: 832, h: 1216, likes: 9445, type: "image" as const },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/b2aed23d-92ee-4ff9-88a2-386685d51d99/original=true/b2aed23d-92ee-4ff9-88a2-386685d51d99.jpeg", author: "Ajuro", w: 832, h: 1216, likes: 9420, type: "image" as const },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/c52d4c1e-bd3d-4c8f-9b21-6556bd60a5d6/original=true/c52d4c1e-bd3d-4c8f-9b21-6556bd60a5d6.jpeg", author: "tent44", w: 832, h: 1216, likes: 8894, type: "image" as const },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/d22517b4-93a6-4775-b7d2-bed18b96ebb7/original=true/d22517b4-93a6-4775-b7d2-bed18b96ebb7.jpeg", author: "matasvolkovas350", w: 1024, h: 1536, likes: 8789, type: "image" as const },
  { url: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/3bcae6ac-9141-489b-8e14-81954a9e8e76/original=true/3bcae6ac-9141-489b-8e14-81954a9e8e76.jpeg", author: "SOVONOY", w: 1536, h: 2048, likes: 8757, type: "image" as const },
];

function formatLikes(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return String(n);
}

function VideoCard({ item, index }: { item: Extract<typeof GALLERY_ITEMS[number], { type: "video" }>; index: number }) {
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
      transition={{ duration: 0.4, delay: (index % 4) * 0.06, ease: [0.16, 1, 0.3, 1] }}
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
      <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-medium text-white/80 backdrop-blur-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <Clapperboard className="h-3 w-3" />
        Video
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
  );
}

export function GalleryMasonry() {
  return (
    <section className="px-6 py-24 md:px-16">
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
              <p className="text-sm text-[var(--text-secondary)]">
                50,000+ creations right now
              </p>
            </div>
          </div>
          <Link
            href="/generate"
            className="hidden items-center gap-1 text-sm font-medium text-[var(--accent-solid)] transition-colors hover:underline sm:flex"
          >
            Explore all <ChevronRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <div className="columns-2 gap-3 md:columns-3 lg:columns-4 xl:columns-5 xl:gap-4">
          {GALLERY_ITEMS.map((item, i) =>
            item.type === "video" ? (
              <VideoCard key={i} item={item as Extract<typeof GALLERY_ITEMS[number], { type: "video" }>} index={i} />
            ) : (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: (i % 4) * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="group relative mb-3 break-inside-avoid overflow-hidden rounded-[20px] border border-[var(--border-subtle)] lg:mb-4"
              >
                <Image
                  src={item.url}
                  alt={`AI art by ${item.author}`}
                  width={item.w}
                  height={item.h}
                  className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  unoptimized
                />
                <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/40" />
                <div className="absolute inset-x-0 bottom-0 translate-y-full p-4 transition-transform duration-300 group-hover:translate-y-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-white/90 drop-shadow-lg">
                      by {item.author}
                    </p>
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

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/generate"
            className="inline-flex items-center gap-1 text-sm font-medium text-[var(--accent-solid)] hover:underline"
          >
            Explore all <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
