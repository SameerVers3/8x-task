# 8x Creative AI Platform

Two services: a Next.js web app and a Python inference relay. The app handles users, billing, and orchestration. The relay handles generation by routing requests to external providers.

---

<img width="1485" height="653" alt="image" src="https://github.com/user-attachments/assets/e76992f1-510a-4c61-9982-6d90091ad8c2" />


## `app/` — Next.js Application

**What it does:**
- Serves the frontend (landing, generation UI, gallery, history, billing, admin)
- Handles auth via email OTP (passwordless, JWT cookie)
- Manages credits and Stripe billing (one-time packs + subscriptions)
- Stores everything in PostgreSQL via Prisma

**Key parts:**

`app/api/` — REST endpoints. The important ones:
- `POST /api/creations` — validates auth + credits, records a pending creation, calls the inference relay in the background, then fetches the result and uploads it to R2. Refunds credits on failure.
- `GET /api/creations` — lists the user's creations with pagination.
- `POST /api/checkout/session` + `POST /api/checkout/webhook` — Stripe checkout and webhook for credit top-ups.
- `POST /api/auth/send-otp` and `POST /api/auth/verify-otp` — passwordless login.

`lib/` — helpers:
- `auth.ts` — reads the JWT cookie, looks up the user in Prisma, checks admin status.
- `stripe.ts` — Stripe client wrapper.
- `storage.ts` — R2 upload/fetch logic for persisting generated assets.

`config/` — centralized config for auth, DB, pricing, and inference API calls.

`prisma/schema.prisma` — the database:
- `User` — email, name, credits, relations.
- `Creation` — prompt, status (pending/processing/completed/failed), result URL, credits used.
- `Revision` — a variation of a creation.
- `Enhancement` — upscaling or other post-processing.
- `CreditTransaction` — audit log of every credit change (creation, refund, top-up, etc.).
- `ModelConfig` — available models, their type (image/video), credit cost, and provider mapping.
- `SystemPrompt` — predefined prompt templates the user can pick.
- `StripeCustomer` / `PaymentRecord` — billing state.

`providers/` — React context providers for auth state, theme, and language.

---

## `inference/` — Python Inference Relay

**What it does:**
- Exposes a FastAPI service that routes generation requests to external AI providers.
- The app never talks directly to providers. It always goes through this relay.
- Model-agnostic: adding a new provider means adding one class and one line in the registry.

**Key parts:**

`main.py` — FastAPI entry point. Sets up CORS and registers all routes.

`relay.py` — singleton `InferenceRelay`. Routes `(task_type, model_name)` to the right provider. Validates input using the provider's Pydantic model, executes generation, and returns a standardized response.

`providers/base.py` — abstract `BaseProvider` class. Every provider implements:
- `task_type` — e.g. `"image"`, `"video"`
- `supported_models` — list of model names
- `request_model` — Pydantic model for input validation
- `async generate(request, api_key)` — makes the actual provider API call
- `format_output(raw, request)` — normalizes the response

`providers/registry.py` — `ProviderRegistry` that maps `(task_type, model)` to provider classes. Currently registered: `PollinationsProvider` (image) and `JSON2VideoProvider` (video).

`providers/pollinations.py` — Pollinations.ai image provider. Supports `flux`, `turbo`, `any-dark`. Constructs a generation URL from the prompt and parameters. Free tier works without an API key; private generation uses `X-API-Key`.

`routes/` — API endpoints:
- `POST /inference/image?model=flux` — generate image
- `POST /inference/video` — generate video
- `GET /inference/models` — list available models
- `GET /health` — health check with provider status

---

## How they connect

1. User submits a prompt in the Next.js app.
2. `POST /api/creations` checks auth, checks credits, creates a `Creation` record with status `"processing"`, and deducts credits.
3. A background task calls `generateImage()` or `generateVideo()` in `config/inference.ts`, which sends a POST to the inference relay at `INFERENCE_API_URL`.
4. The relay resolves the model, finds the provider, validates the request, and calls the provider's API.
5. The provider returns a result URL. The relay wraps it in a standardized response and sends it back.
6. The app's background task fetches the result and uploads it to R2 for permanent storage.
7. The app updates the `Creation` record to `"completed"` with the result URL. If anything fails, it marks it `"failed"` and refunds the credits.
8. The frontend polls `GET /api/creations` to see status updates and show the result.
