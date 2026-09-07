"""Image enhancement route (placeholder for future providers)."""

from fastapi import APIRouter, Header, Query
from typing import Optional

from relay import InferenceRelay
from models.responses import InferenceResponse

router = APIRouter()
relay = InferenceRelay()


@router.post("/enhance", response_model=InferenceResponse)
async def enhance_image(
    payload: dict,
    model: Optional[str] = Query(None, description="Model name for enhancement."),
    x_api_key: Optional[str] = Header(None, alias="X-API-Key"),
):
    """
    Enhance an existing image (placeholder — no providers registered yet).

    **Request Body:**
    ```json
    {
      "image_url": "https://example.com/image.jpg",
      "enhancement_type": "upscale",
      "scale_factor": 2.0
    }
    ```
    """
    return await relay.route(
        task_type="enhance",
        model=model,
        payload=payload,
        api_key=x_api_key,
    )
