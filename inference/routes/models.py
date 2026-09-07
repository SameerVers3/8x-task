"""Model discovery and provider info routes."""

from fastapi import APIRouter, Query
from typing import Optional

from relay import InferenceRelay

router = APIRouter()
relay = InferenceRelay()


@router.get("/models")
async def list_models(
    task: Optional[str] = Query(None, description="Filter by task type (image, video, text, enhance)"),
):
    """
    List all available inference models.

    Returns models in "task/model" format, e.g. "image/flux", "image/turbo".
    """
    models = relay.list_models(task_type=task)
    return {
        "success": True,
        "data": {
            "models": models,
            "count": len(models),
        },
        "error": None,
    }


@router.get("/providers")
async def list_providers():
    """List all registered provider classes."""
    providers = relay.list_providers()
    return {
        "success": True,
        "data": {
            "providers": providers,
            "count": len(providers),
        },
        "error": None,
    }


@router.get("/models/{task}/{model}")
async def get_model_info(task: str, model: str):
    """Get information about a specific model and its provider."""
    info = relay.get_provider_info(task, model)
    return {
        "success": "error" not in info,
        "data": info,
        "error": info.get("error"),
    }
