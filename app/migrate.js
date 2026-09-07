const { Client } = require('pg');

const DATABASE_URL = "postgresql://neondb_owner:npg_JNsd2OqZ8HoI@ep-round-shape-axbxu99o-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

const client = new Client({ connectionString: DATABASE_URL });

async function main() {
  await client.connect();
  console.log('Connected to Neon DB');

  const tables = [
    `CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
      email TEXT UNIQUE NOT NULL,
      name TEXT,
      avatar TEXT,
      credits INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,

    `CREATE TABLE IF NOT EXISTS otps (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
      email TEXT NOT NULL,
      code TEXT NOT NULL,
      used BOOLEAN NOT NULL DEFAULT false,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      user_id TEXT REFERENCES users(id) ON DELETE CASCADE
    )`,

    `CREATE INDEX IF NOT EXISTS idx_otps_email ON otps(email)`,
    `CREATE INDEX IF NOT EXISTS idx_otps_code ON otps(code)`,

    `CREATE TABLE IF NOT EXISTS model_configs (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
      name TEXT UNIQUE NOT NULL,
      display_name TEXT NOT NULL,
      type TEXT NOT NULL,
      provider TEXT NOT NULL,
      credit_cost INTEGER NOT NULL,
      config JSONB NOT NULL DEFAULT '{}',
      active BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,

    `CREATE INDEX IF NOT EXISTS idx_model_configs_type ON model_configs(type)`,
    `CREATE INDEX IF NOT EXISTS idx_model_configs_active ON model_configs(active)`,

    `CREATE TABLE IF NOT EXISTS system_prompts (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
      name TEXT UNIQUE NOT NULL,
      display_name TEXT NOT NULL,
      type TEXT NOT NULL,
      prompt TEXT NOT NULL,
      description TEXT,
      active BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,

    `CREATE INDEX IF NOT EXISTS idx_system_prompts_type ON system_prompts(type)`,
    `CREATE INDEX IF NOT EXISTS idx_system_prompts_active ON system_prompts(active)`,

    `CREATE TABLE IF NOT EXISTS creations (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      prompt TEXT NOT NULL,
      negative_prompt TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      result_url TEXT,
      credits_used INTEGER NOT NULL,
      metadata JSONB NOT NULL DEFAULT '{}',
      model_id TEXT NOT NULL REFERENCES model_configs(id),
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,

    `CREATE INDEX IF NOT EXISTS idx_creations_user_id ON creations(user_id)`,
    `CREATE INDEX IF NOT EXISTS idx_creations_status ON creations(status)`,
    `CREATE INDEX IF NOT EXISTS idx_creations_created_at ON creations(created_at)`,

    `CREATE TABLE IF NOT EXISTS revisions (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
      creation_id TEXT NOT NULL REFERENCES creations(id) ON DELETE CASCADE,
      prompt TEXT NOT NULL,
      negative_prompt TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      result_url TEXT,
      credits_used INTEGER NOT NULL,
      metadata JSONB NOT NULL DEFAULT '{}',
      model_id TEXT NOT NULL REFERENCES model_configs(id),
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,

    `CREATE INDEX IF NOT EXISTS idx_revisions_creation_id ON revisions(creation_id)`,
    `CREATE INDEX IF NOT EXISTS idx_revisions_status ON revisions(status)`,

    `CREATE TABLE IF NOT EXISTS enhancements (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
      creation_id TEXT NOT NULL REFERENCES creations(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      result_url TEXT,
      credits_used INTEGER NOT NULL,
      metadata JSONB NOT NULL DEFAULT '{}',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,

    `CREATE INDEX IF NOT EXISTS idx_enhancements_creation_id ON enhancements(creation_id)`,

    `CREATE TABLE IF NOT EXISTS credit_transactions (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      amount INTEGER NOT NULL,
      type TEXT NOT NULL,
      description TEXT,
      creation_id TEXT REFERENCES creations(id) ON DELETE SET NULL,
      revision_id TEXT REFERENCES revisions(id) ON DELETE SET NULL,
      enhancement_id TEXT REFERENCES enhancements(id) ON DELETE SET NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,

    `CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON credit_transactions(user_id)`,
    `CREATE INDEX IF NOT EXISTS idx_credit_transactions_type ON credit_transactions(type)`,
    `CREATE INDEX IF NOT EXISTS idx_credit_transactions_created_at ON credit_transactions(created_at)`,

    `CREATE TABLE IF NOT EXISTS global_config (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
      key TEXT UNIQUE NOT NULL,
      value TEXT NOT NULL,
      description TEXT,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
  ];

  for (const sql of tables) {
    try {
      await client.query(sql);
      console.log('Created:', sql.split(' ')[2]);
    } catch (e) {
      console.error('Failed:', sql.split(' ')[2], e.message);
      throw e;
    }
  }

  // Seed default data
  const now = new Date().toISOString();

  const models = [
    { name: 'flux', display_name: 'FLUX (High Quality)', type: 'image', provider: 'pollinations', credit_cost: 2, config: JSON.stringify({ width: 1024, height: 1024, default: true }), active: true },
    { name: 'turbo', display_name: 'FLUX Turbo (Fast)', type: 'image', provider: 'pollinations', credit_cost: 1, config: JSON.stringify({ width: 1024, height: 1024, default: false }), active: true },
    { name: 'any-dark', display_name: 'Dark Theme Optimized', type: 'image', provider: 'pollinations', credit_cost: 2, config: JSON.stringify({ width: 1024, height: 1024, default: false }), active: true },
    { name: 'video-default', display_name: 'Standard Video', type: 'video', provider: 'pollinations', credit_cost: 5, config: JSON.stringify({ width: 512, height: 512, duration: 5, fps: 24 }), active: true },
    { name: 'upscale-2x', display_name: '2x Upscale', type: 'enhance', provider: 'pollinations', credit_cost: 3, config: JSON.stringify({ scaleFactor: 2, enhancementType: 'upscale' }), active: true },
  ];

  for (const m of models) {
    await client.query(
      `INSERT INTO model_configs (id, name, display_name, type, provider, credit_cost, config, active, created_at, updated_at)
       VALUES (gen_random_uuid()::TEXT, $1, $2, $3, $4, $5, $6, $7, $8, $8)
       ON CONFLICT (name) DO NOTHING`,
      [m.name, m.display_name, m.type, m.provider, m.credit_cost, m.config, m.active, now]
    );
  }
  console.log('Seeded 5 models');

  const prompts = [
    { name: 'cinematic', display_name: 'Cinematic', type: 'image', prompt: 'Cinematic shot, dramatic lighting, film grain, highly detailed, 8k resolution, professional photography, shallow depth of field, bokeh', description: 'Cinematic movie-style images with dramatic lighting', active: true },
    { name: 'anime', display_name: 'Anime Style', type: 'image', prompt: 'Anime style, vibrant colors, detailed shading, cel-shaded, manga inspired, crisp lines, expressive eyes, dynamic pose', description: 'Japanese anime/manga inspired art style', active: true },
    { name: 'digital-art', display_name: 'Digital Art', type: 'image', prompt: 'Digital art, vibrant colors, smooth gradients, concept art style, detailed illustration, trending on ArtStation, professional quality', description: 'Professional digital illustration style', active: true },
    { name: 'photorealistic', display_name: 'Photorealistic', type: 'image', prompt: 'Photorealistic, highly detailed, 8k, sharp focus, professional photography, natural lighting, ultra realistic textures, lifelike', description: 'Ultra-realistic photography style', active: true },
    { name: 'minimalist', display_name: 'Minimalist', type: 'image', prompt: 'Minimalist design, clean lines, simple composition, neutral colors, negative space, elegant, modern aesthetic, uncluttered', description: 'Clean and minimal artistic style', active: true },
    { name: 'dark-fantasy', display_name: 'Dark Fantasy', type: 'image', prompt: 'Dark fantasy, gothic atmosphere, mysterious shadows, dramatic lighting, rich textures, moody colors, epic fantasy art style', description: 'Dark and mysterious fantasy art', active: true },
    { name: 'cinematic-video', display_name: 'Cinematic Video', type: 'video', prompt: 'Cinematic video, smooth motion, dramatic lighting, film quality, professional cinematography, tracking shot, atmospheric', description: 'Movie-quality cinematic video generation', active: true },
  ];

  for (const p of prompts) {
    await client.query(
      `INSERT INTO system_prompts (id, name, display_name, type, prompt, description, active, created_at, updated_at)
       VALUES (gen_random_uuid()::TEXT, $1, $2, $3, $4, $5, $6, $7, $7)
       ON CONFLICT (name) DO NOTHING`,
      [p.name, p.display_name, p.type, p.prompt, p.description, p.active, now]
    );
  }
  console.log('Seeded 7 prompts');

  const configs = [
    { key: 'default_signup_credits', value: '50', description: 'Credits given to new users on signup' },
    { key: 'max_daily_creations', value: '100', description: 'Maximum creations per user per day' },
    { key: 'otp_expiry_minutes', value: '10', description: 'OTP code expiry time in minutes' },
    { key: 'maintenance_mode', value: 'false', description: 'Whether the app is in maintenance mode' },
  ];

  for (const c of configs) {
    await client.query(
      `INSERT INTO global_config (id, key, value, description, updated_at)
       VALUES (gen_random_uuid()::TEXT, $1, $2, $3, $4)
       ON CONFLICT (key) DO NOTHING`,
      [c.key, c.value, c.description, now]
    );
  }
  console.log('Seeded 4 global configs');

  console.log('\nMigrations and seeding complete!');
  await client.end();
}

main().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
