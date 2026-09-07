"""Inference Relay API — model-agnostic generation service."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from routes import setup_routes

app = FastAPI(
    title="Inference Relay",
    description="Model-agnostic inference relay for image, video, text, and enhancement generation.",
    version="0.2.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all inference routes
setup_routes(app)


@app.get("/")
async def root():
    """Root endpoint with API info."""
    return {
        "name": "Inference Relay",
        "version": "0.2.0",
        "description": "Model-agnostic inference relay for generation tasks",
        "endpoints": {
            "docs": "/docs",
            "health": "/health",
            "models": "/inference/models",
            "providers": "/inference/providers",
            "image": "POST /inference/image?model=flux",
            "video": "POST /inference/video?model=<future>",
            "text": "POST /inference/text?model=<future>",
            "enhance": "POST /inference/enhance?model=<future>",
        },
    }


@app.get("/health")
async def health():
    """Health check endpoint."""
    from relay import InferenceRelay
    relay = InferenceRelay()

    return {
        "status": "healthy",
        "providers": relay.list_providers(),
        "models": relay.list_models(),
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.APP_HOST,
        port=settings.APP_PORT,
        reload=settings.APP_DEBUG,
    )
