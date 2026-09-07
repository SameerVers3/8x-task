"""Text generation route (placeholder for future providers)."""

from fastapi import APIRouter, Header, Query
from typing import Optional

from relay import InferenceRelay
from models.responses import InferenceResponse

router = APIRouter()
relay = InferenceRelay()


@router.post("/text", response_model=InferenceResponse)
async def generate_text(
    payload: dict,
    model: Optional[str] = Query(None, description="Model name for text generation."),
    x_api_key: Optional[str] = Header(None, alias="X-API-Key"),
):
    """
    Generate text from a prompt (placeholder — no providers registered yet).

    **Request Body:**
    ```json
    {
      "prompt": "Write a paragraph about space exploration",
      "max_tokens": 1024,
      "temperature": 0.7,
      "top_p": 1.0
    }
    ```
    """
    return await relay.route(
        task_type="text",
        model=model,
        payload=payload,
        api_key=x_api_key,
    )
