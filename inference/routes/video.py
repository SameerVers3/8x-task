"""Video generation route (placeholder for future providers)."""

from fastapi import APIRouter, Header, Query
from typing import Optional

from relay import InferenceRelay
from models.responses import InferenceResponse

router = APIRouter()
relay = InferenceRelay()


@router.post("/video", response_model=InferenceResponse)
async def generate_video(
    payload: dict,
    model: Optional[str] = Query(None, description="Model name for video generation."),
    x_api_key: Optional[str] = Header(None, alias="X-API-Key"),
):
    """
    Generate a video from a text prompt (placeholder — no providers registered yet).

    **Request Body:**
    ```json
    {
      "prompt": "a cat walking in space",
      "duration": 5,
      "width": 512,
      "height": 512,
      "fps": 24
    }
    ```
    """
    return await relay.route(
        task_type="video",
        model=model,
        payload=payload,
        api_key=x_api_key,
    )
