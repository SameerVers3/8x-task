"""JSON2Video provider for video generation from JSON scene descriptions.

Supports generating videos by sending structured JSON scene definitions
to the JSON2Video API. Users describe video scenes, elements, text overlays,
and transitions in JSON format.

API: https://api.json2video.com (or your configured endpoint)
Auth: API key via X-API-Key header or Authorization Bearer token
"""

import httpx
from pydantic import BaseModel
from typing import Any, Optional

from config import settings
from models.requests import VideoGenerationRequest
from models.responses import VideoGenerationResponse
from providers.base import BaseProvider, ProviderAPIError, ProviderValidationError


class JSON2VideoProvider(BaseProvider):
    """
    JSON2Video provider for video generation from structured JSON.

    Accepts either:
    - A simple text prompt (basic mode) — auto-wrapped into a single scene
    - A full JSON scene definition (advanced mode) — scenes, elements, transitions, etc.

    Supported models: json2video
    """

    task_type = "video"
    supported_models = ["json2video"]
    request_model = VideoGenerationRequest
    response_model = VideoGenerationResponse

    def __init__(self):
        self.base_url = settings.JSON2VIDEO_BASE_URL.rstrip("/")
        self.api_key = settings.JSON2VIDEO_API_KEY
        self.timeout = settings.REQUEST_TIMEOUT

    async def generate(self, request: BaseModel, api_key: str | None = None) -> dict:
        """
        Generate a video via JSON2Video API.

        Args:
            request: Validated VideoGenerationRequest
            api_key: Optional API key (falls back to settings.JSON2VIDEO_API_KEY)

        Returns:
            Standardized response dictionary

        Raises:
            ProviderAPIError: If the API call fails
            ProviderValidationError: If input is invalid
        """
        if not isinstance(request, VideoGenerationRequest):
            raise ProviderAPIError(
                f"Expected VideoGenerationRequest, got {type(request)}"
            )

        key = api_key or self.api_key
        if not key:
            raise ProviderAPIError(
                "JSON2Video API key is required. Set JSON2VIDEO_API_KEY in .env or pass X-API-Key header."
            )

        # Build the JSON payload for the API
        payload = self._build_payload(request)

        headers = self.get_headers(key)

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(
                    f"{self.base_url}/generate",
                    json=payload,
                    headers=headers,
                )
                response.raise_for_status()
                data = response.json()

                return self.format_output(data, request)

        except httpx.HTTPStatusError as e:
            raise ProviderAPIError(
                f"JSON2Video API error: {e.response.status_code} - {e.response.text}"
            ) from e
        except httpx.RequestError as e:
            raise ProviderAPIError(
                f"JSON2Video request failed: {str(e)}"
            ) from e

    def _build_payload(self, request: VideoGenerationRequest) -> dict:
        """
        Build the JSON payload for the JSON2Video API.

        If the request contains a `json` / `definition` field with a full scene
        definition, use it as-is (advanced mode). Otherwise, wrap the prompt
        into a simple single-scene video (simple mode).

        Args:
            request: Validated video generation request

        Returns:
            Dictionary payload ready for JSON2Video API
        """
        # Advanced mode: user provided a full JSON scene definition
        if request.definition is not None:
            payload = dict(request.definition)
            # Inject resolution and fps if not already specified
            payload.setdefault("width", request.width)
            payload.setdefault("height", request.height)
            payload.setdefault("fps", request.fps)
            return payload

        # Simple mode: wrap prompt into a single-scene video
        return {
            "prompt": request.prompt,
            "duration": request.duration,
            "width": request.width,
            "height": request.height,
            "fps": request.fps,
        }

    def format_output(self, raw_response: Any, request: BaseModel) -> dict:
        """
        Format the JSON2Video API response into a standardized dictionary.

        Args:
            raw_response: JSON response from JSON2Video API
            request: Original validated request

        Returns:
            Dictionary matching VideoGenerationResponse
        """
        if not isinstance(request, VideoGenerationRequest):
            raise ProviderAPIError(
                f"Expected VideoGenerationRequest, got {type(request)}"
            )

        # JSON2Video API response shape:
        # { "video_url": "...", "job_id": "...", "status": "completed" }
        if isinstance(raw_response, dict):
            video_url = raw_response.get("video_url", "")
            job_id = raw_response.get("job_id", "")
            status = raw_response.get("status", "unknown")
        else:
            video_url = str(raw_response)
            job_id = ""
            status = "unknown"

        return {
            "video_url": video_url,
            "model": "json2video",
            "prompt": request.prompt,
            "duration": request.duration,
            "fps": request.fps,
            "metadata": {
                "width": request.width,
                "height": request.height,
                "job_id": job_id,
                "status": status,
                "provider": "json2video",
            },
        }

    def get_headers(self, api_key: str | None = None) -> dict:
        """Build headers for JSON2Video API."""
        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
        }
        if api_key:
            headers["Authorization"] = f"Bearer {api_key}"
            headers["X-API-Key"] = api_key
        return headers
