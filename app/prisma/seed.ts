import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...\n");

  // Seed default model configs
  const models = [
    {
      name: "flux",
      displayName: "FLUX (High Quality)",
      type: "image",
      provider: "pollinations",
      creditCost: 2,
      config: { width: 1024, height: 1024, default: true },
      active: true,
    },
    {
      name: "turbo",
      displayName: "FLUX Turbo (Fast)",
      type: "image",
      provider: "pollinations",
      creditCost: 1,
      config: { width: 1024, height: 1024, default: false },
      active: true,
    },
    {
      name: "any-dark",
      displayName: "Dark Theme Optimized",
      type: "image",
      provider: "pollinations",
      creditCost: 2,
      config: { width: 1024, height: 1024, default: false },
      active: true,
    },
    {
      name: "video-default",
      displayName: "Standard Video",
      type: "video",
      provider: "pollinations",
      creditCost: 5,
      config: { width: 512, height: 512, duration: 5, fps: 24 },
      active: true,
    },
    {
      name: "upscale-2x",
      displayName: "2x Upscale",
      type: "enhance",
      provider: "pollinations",
      creditCost: 3,
      config: { scaleFactor: 2, enhancementType: "upscale" },
      active: true,
    },
  ];

  for (const model of models) {
    await prisma.modelConfig.upsert({
      where: { name: model.name },
      update: model,
      create: model,
    });
  }
  console.log(`✅ Seeded ${models.length} model configs`);

  // Seed system prompts
  const prompts = [
    {
      name: "cinematic",
      displayName: "Cinematic",
      type: "image",
      prompt: "Cinematic shot, dramatic lighting, film grain, highly detailed, 8k resolution, professional photography, shallow depth of field, bokeh",
      description: "Cinematic movie-style images with dramatic lighting",
      active: true,
    },
    {
      name: "anime",
      displayName: "Anime Style",
      type: "image",
      prompt: "Anime style, vibrant colors, detailed shading, cel-shaded, manga inspired, crisp lines, expressive eyes, dynamic pose",
      description: "Japanese anime/manga inspired art style",
      active: true,
    },
    {
      name: "digital-art",
      displayName: "Digital Art",
      type: "image",
      prompt: "Digital art, vibrant colors, smooth gradients, concept art style, detailed illustration, trending on ArtStation, professional quality",
      description: "Professional digital illustration style",
      active: true,
    },
    {
      name: "photorealistic",
      displayName: "Photorealistic",
      type: "image",
      prompt: "Photorealistic, highly detailed, 8k, sharp focus, professional photography, natural lighting, ultra realistic textures, lifelike",
      description: "Ultra-realistic photography style",
      active: true,
    },
    {
      name: "minimalist",
      displayName: "Minimalist",
      type: "image",
      prompt: "Minimalist design, clean lines, simple composition, neutral colors, negative space, elegant, modern aesthetic, uncluttered",
      description: "Clean and minimal artistic style",
      active: true,
    },
    {
      name: "dark-fantasy",
      displayName: "Dark Fantasy",
      type: "image",
      prompt: "Dark fantasy, gothic atmosphere, mysterious shadows, dramatic lighting, rich textures, moody colors, epic fantasy art style",
      description: "Dark and mysterious fantasy art",
      active: true,
    },
    {
      name: "cinematic-video",
      displayName: "Cinematic Video",
      type: "video",
      prompt: "Cinematic video, smooth motion, dramatic lighting, film quality, professional cinematography, tracking shot, atmospheric",
      description: "Movie-quality cinematic video generation",
      active: true,
    },
  ];

  for (const prompt of prompts) {
    await prisma.systemPrompt.upsert({
      where: { name: prompt.name },
      update: prompt,
      create: prompt,
    });
  }
  console.log(`✅ Seeded ${prompts.length} system prompts`);

  // Seed global config
  const configs = [
    {
      key: "default_signup_credits",
      value: "50",
      description: "Credits given to new users on signup",
    },
    {
      key: "max_daily_creations",
      value: "100",
      description: "Maximum creations per user per day",
    },
    {
      key: "otp_expiry_minutes",
      value: "10",
      description: "OTP code expiry time in minutes",
    },
    {
      key: "maintenance_mode",
      value: "false",
      description: "Whether the app is in maintenance mode",
    },
  ];

  for (const config of configs) {
    await prisma.globalConfig.upsert({
      where: { key: config.key },
      update: config,
      create: config,
    });
  }
  console.log(`✅ Seeded ${configs.length} global configs`);

  console.log("\n🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
