"""Image generation route."""

from fastapi import APIRouter, Header, Query
from typing import Optional

from relay import InferenceRelay
from models.responses import InferenceResponse

router = APIRouter()
relay = InferenceRelay()


@router.post("/image", response_model=InferenceResponse)
async def generate_image(
    payload: dict,
    model: Optional[str] = Query(None, description="Model name (e.g., flux, turbo, any-dark). Defaults to env setting."),
    x_api_key: Optional[str] = Header(None, alias="X-API-Key"),
):
    """
    Generate an image from a text prompt.

    **Query Parameters:**
    - `model`: Model to use. Defaults to `DEFAULT_IMAGE_MODEL` from env.

    **Headers:**
    - `X-API-Key`: Optional API key for private generation.

    **Request Body:**
    ```json
    {
      "prompt": "a cat in space",
      "width": 1024,
      "height": 1024,
      "seed": 42,
      "negative_prompt": "blurry",
      "nologo": true,
      "private": false
    }
    ```

    **Response:**
    ```json
    {
      "success": true,
      "data": {
        "image_url": "https://image.pollinations.ai/prompt/...",
        "model": "flux",
        "prompt": "a cat in space",
        "width": 1024,
        "height": 1024,
        "seed": 42,
        "metadata": {...}
      },
      "error": null
    }
    ```
    """
    return await relay.route(
        task_type="image",
        model=model,
        payload=payload,
        api_key=x_api_key,
    )
