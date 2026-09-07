"""API routes for inference endpoints."""

from fastapi import APIRouter
from routes.image import router as image_router
from routes.video import router as video_router
from routes.text import router as text_router
from routes.enhance import router as enhance_router
from routes.models import router as models_router


def setup_routes(app) -> None:
    """Register all inference routes with the FastAPI app."""
    app.include_router(image_router, prefix="/inference", tags=["image"])
    app.include_router(video_router, prefix="/inference", tags=["video"])
    app.include_router(text_router, prefix="/inference", tags=["text"])
    app.include_router(enhance_router, prefix="/inference", tags=["enhance"])
    app.include_router(models_router, prefix="/inference", tags=["models"])
