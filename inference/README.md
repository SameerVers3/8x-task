# Inference Relay

Model-agnostic inference relay for the 8x project. Routes generation requests (image, video, text, enhancement) to multiple external providers.

## Architecture

```
inference/
├── main.py              # FastAPI entry point
├── config.py            # .env-driven settings
├── relay.py             # Central InferenceRelay router
├── models/              # Pydantic request/response models
├── providers/           # Provider implementations
│   ├── base.py          # Abstract BaseProvider class
│   ├── registry.py      # Provider auto-discovery
│   └── pollinations.py  # Pollinations.ai image provider
├── routes/              # API endpoints
│   ├── image.py         # POST /inference/image?model=flux
│   ├── video.py         # POST /inference/video (future)
│   ├── text.py          # POST /inference/text (future)
│   ├── enhance.py       # POST /inference/enhance (future)
│   └── models.py        # GET /inference/models
└── tests/               # Unit tests
```

## Setup

### 1. Create virtual environment

```bash
cd inference
python -m venv .venv
source .venv/bin/activate
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure environment

```bash
cp .env.example .env
# Edit .env with your settings
```

## Running the Server

```bash
# Development (with auto-reload)
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Production
uvicorn main:app --host 0.0.0.0 --port 8000
```

## API Documentation

- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

## Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API info |
| GET | `/health` | Health check + provider status |
| GET | `/inference/models` | List available models |
| GET | `/inference/models/{task}/{model}` | Get model info |
| GET | `/inference/providers` | List registered providers |
| POST | `/inference/image?model=flux` | Generate image |
| POST | `/inference/video?model=...` | Generate video (future) |
| POST | `/inference/text?model=...` | Generate text (future) |
| POST | `/inference/enhance?model=...` | Enhance image (future) |

## Image Generation

### Request

```bash
curl -X POST "http://localhost:8000/inference/image?model=flux" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key" \
  -d '{
    "prompt": "a cat in space wearing an astronaut helmet",
    "width": 1024,
    "height": 1024,
    "seed": 42,
    "negative_prompt": "blurry, low quality",
    "nologo": true,
    "private": false
  }'
```

### Response

```json
{
  "success": true,
  "data": {
    "image_url": "https://image.pollinations.ai/prompt/a%20cat%20in%20space...?width=1024&height=1024&seed=42&nologo=true&model=flux",
    "model": "flux",
    "prompt": "a cat in space wearing an astronaut helmet",
    "width": 1024,
    "height": 1024,
    "seed": 42,
    "metadata": {
      "nologo": true,
      "negative_prompt": "blurry, low quality",
      "private": false,
      "provider": "pollinations"
    }
  },
  "error": null
}
```

## Supported Models

### Image (Pollinations.ai)

| Model | Description | API Key Required |
|-------|-------------|-----------------|
| `flux` | Default high-quality model | No (free tier) |
| `turbo` | Fast generation | No (free tier) |
| `any-dark` | Optimized for dark themes | No (free tier) |

## Adding a New Provider

1. Create a new file in `providers/` (e.g., `providers/openai.py`)
2. Subclass `BaseProvider` and implement:
   - `task_type` — e.g. `"text"`
   - `supported_models` — list of model names
   - `request_model` — Pydantic model for input validation
   - `async generate()` — API call logic
   - `format_output()` — Response normalization
3. Register it in `providers/registry.py`:
   ```python
   from .openai import OpenAIProvider
   self.register(OpenAIProvider)
   ```

The relay will automatically route matching requests to your new provider.

## Testing

```bash
pytest tests/ -v
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `APP_HOST` | `0.0.0.0` | Server bind host |
| `APP_PORT` | `8000` | Server port |
| `APP_DEBUG` | `false` | Enable debug mode |
| `POLLINATIONS_BASE_URL` | `https://image.pollinations.ai` | Pollinations API base |
| `POLLINATIONS_API_KEY` | — | API key for private generation |
| `DEFAULT_IMAGE_MODEL` | `flux` | Default image model |
| `REQUEST_TIMEOUT` | `60` | API request timeout (seconds) |
| `MAX_IMAGE_WIDTH` | `2048` | Max image width |
| `MAX_IMAGE_HEIGHT` | `2048` | Max image height |
| `CORS_ORIGINS` | `http://localhost:3000` | Allowed CORS origins |
