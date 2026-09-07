"""Pollinations.ai image generation provider.

Supports free tier models via URL construction and private generation
via API key.

API: https://image.pollinations.ai/prompt/{prompt}?width=...&height=...&seed=...&nologo=...&model=...
Docs: https://pollinations.ai/
"""

import urllib.parse
import httpx
from pydantic import BaseModel
from typing import Any

from config import settings
from models.requests import ImageGenerationRequest
from models.responses import ImageGenerationResponse
from providers.base import BaseProvider, ProviderAPIError


class PollinationsProvider(BaseProvider):
    """
    Pollinations.ai provider for image generation.

    Supports free models: flux, turbo, any-dark
    No API key required for free tier.
    Private generation requires API key in X-API-Key header.
    """

    task_type = "image"
    supported_models = ["flux", "turbo", "any-dark"]
    request_model = ImageGenerationRequest
    response_model = ImageGenerationResponse

    def __init__(self):
        self.base_url = settings.POLLINATIONS_BASE_URL.rstrip("/")
        self.timeout = settings.REQUEST_TIMEOUT

    async def generate(self, request: BaseModel, api_key: str | None = None) -> dict:
        """
        Generate an image via Pollinations.ai.

        For free tier: constructs the generation URL and returns metadata.
        For private tier: makes an authenticated POST request.

        Args:
            request: Validated ImageGenerationRequest
            api_key: Optional API key for private generation

        Returns:
            Standardized response dictionary

        Raises:
            ProviderAPIError: If the request fails
        """
        if not isinstance(request, ImageGenerationRequest):
            raise ProviderAPIError(f"Expected ImageGenerationRequest, got {type(request)}")

        if request.private and not api_key:
            raise ProviderAPIError("Private generation requires an API key in the X-API-Key header")

        # Build the generation URL with query parameters
        image_url = self._build_url(request)

        # For private generation, we need to proxy the request with the API key
        if request.private:
            return await self._generate_private(request, image_url, api_key)

        # For free tier, return the URL directly
        return self.format_output(image_url, request)

    def _build_url(self, request: ImageGenerationRequest) -> str:
        """Construct the Pollinations generation URL from request parameters."""
        encoded_prompt = urllib.parse.quote(request.prompt)
        url = f"{self.base_url}/prompt/{encoded_prompt}"

        params = {}
        if request.width != 1024:
            params["width"] = request.width
        if request.height != 1024:
            params["height"] = request.height
        if request.seed is not None:
            params["seed"] = request.seed
        if request.nologo:
            params["nologo"] = "true"
        if request.negative_prompt:
            params["negative"] = urllib.parse.quote(request.negative_prompt)

        # Add model parameter - default to flux if not specified or unknown
        # The model is determined by the route parameter, not the request body
        # This will be set by the relay when routing

        if params:
            query = urllib.parse.urlencode(params)
            url = f"{url}?{query}"

        return url

    def set_model_in_url(self, url: str, model: str) -> str:
        """Append the model parameter to the URL."""
        separator = "&" if "?" in url else "?"
        return f"{url}{separator}model={model}"

    async def _generate_private(self, request: ImageGenerationRequest, url: str, api_key: str) -> dict:
        """
        Make an authenticated request for private generation.

        Pollinations private generation fetches the image with the API key
        and returns a unique private URL.
        """
        headers = self.get_headers(api_key)
        # Pollinations uses X-API-Key for private generation
        headers["X-API-Key"] = api_key

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(url, headers=headers, follow_redirects=True)
                response.raise_for_status()

                # If the response is an image, we could store it and return a local URL
                # For now, return the URL with a note that it's private
                return self.format_output(url, request, private=True)
        except httpx.HTTPStatusError as e:
            raise ProviderAPIError(f"Pollinations API error: {e.response.status_code} - {e.response.text}") from e
        except httpx.RequestError as e:
            raise ProviderAPIError(f"Pollinations request failed: {str(e)}") from e

    def format_output(self, raw_response: Any, request: BaseModel, private: bool = False) -> dict:
        """
        Format the provider response into a standardized dictionary.

        Args:
            raw_response: The generated image URL (for free tier) or response data
            request: Original validated request
            private: Whether this is a private generation

        Returns:
            Dictionary matching ImageGenerationResponse
        """
        if not isinstance(request, ImageGenerationRequest):
            raise ProviderAPIError(f"Expected ImageGenerationRequest, got {type(request)}")

        image_url = str(raw_response) if raw_response else ""

        return {
            "image_url": image_url,
            "model": "flux",  # Will be overridden by relay with actual model
            "prompt": request.prompt,
            "width": request.width,
            "height": request.height,
            "seed": request.seed,
            "metadata": {
                "nologo": request.nologo,
                "negative_prompt": request.negative_prompt,
                "private": private,
                "provider": "pollinations",
            },
        }

    def get_headers(self, api_key: str | None = None) -> dict:
        """Build headers for Pollinations API."""
        headers = {
            "Accept": "image/*, application/json",
        }
        if api_key:
            headers["X-API-Key"] = api_key
        return headers
