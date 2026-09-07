"""Unit tests for the Pollinations.ai provider."""

import pytest
from providers.pollinations import PollinationsProvider
from providers.base import ProviderValidationError, ProviderAPIError
from models.requests import ImageGenerationRequest


class TestPollinationsProvider:
    """Test the Pollinations.ai image provider."""

    @pytest.fixture
    def provider(self):
        return PollinationsProvider()

    def test_task_type(self, provider):
        assert provider.task_type == "image"

    def test_supported_models(self, provider):
        assert "flux" in provider.supported_models
        assert "turbo" in provider.supported_models
        assert "any-dark" in provider.supported_models

    def test_supports_model(self, provider):
        assert provider.supports_model("flux") is True
        assert provider.supports_model("FLUX") is True  # Case insensitive
        assert provider.supports_model("nonexistent") is False

    def test_validate_input_valid(self, provider):
        data = {"prompt": "a cat in space", "width": 1024, "height": 768}
        result = provider.validate_input(data)
        assert isinstance(result, ImageGenerationRequest)
        assert result.prompt == "a cat in space"
        assert result.width == 1024
        assert result.height == 768

    def test_validate_input_empty_prompt(self, provider):
        with pytest.raises(ProviderValidationError):
            provider.validate_input({"prompt": ""})

    def test_validate_input_missing_prompt(self, provider):
        with pytest.raises(ProviderValidationError):
            provider.validate_input({"width": 1024})

    def test_build_url_basic(self, provider):
        request = ImageGenerationRequest(prompt="a cat")
        url = provider._build_url(request)
        assert url.startswith("https://image.pollinations.ai/prompt/")
        assert "a%20cat" in url

    def test_build_url_with_params(self, provider):
        request = ImageGenerationRequest(
            prompt="a cat",
            width=512,
            height=512,
            seed=42,
            nologo=True,
        )
        url = provider._build_url(request)
        assert "width=512" in url
        assert "height=512" in url
        assert "seed=42" in url
        assert "nologo=true" in url

    def test_build_url_negative_prompt(self, provider):
        request = ImageGenerationRequest(
            prompt="a cat",
            negative_prompt="blurry",
        )
        url = provider._build_url(request)
        assert "negative=blurry" in url

    def test_build_url_defaults_omitted(self, provider):
        """Default values (width=1024, height=1024, nologo default) should be handled."""
        request = ImageGenerationRequest(prompt="a cat")
        url = provider._build_url(request)
        # Default nologo is True, so it should be included
        assert "nologo=true" in url

    def test_set_model_in_url(self, provider):
        url = "https://example.com/prompt/test?width=1024"
        result = provider.set_model_in_url(url, "flux")
        assert "model=flux" in result

        url_no_query = "https://example.com/prompt/test"
        result2 = provider.set_model_in_url(url_no_query, "turbo")
        assert "?model=turbo" in result2

    def test_format_output(self, provider):
        request = ImageGenerationRequest(prompt="a cat", width=512, height=512, seed=42)
        result = provider.format_output("https://example.com/image.png", request)

        assert result["image_url"] == "https://example.com/image.png"
        assert result["prompt"] == "a cat"
        assert result["width"] == 512
        assert result["height"] == 512
        assert result["seed"] == 42
        assert result["metadata"]["nologo"] is True
        assert result["metadata"]["provider"] == "pollinations"

    def test_get_headers_no_key(self, provider):
        headers = provider.get_headers()
        assert "X-API-Key" not in headers

    def test_get_headers_with_key(self, provider):
        headers = provider.get_headers("secret-key")
        assert headers["X-API-Key"] == "secret-key"

    @pytest.mark.asyncio
    async def test_generate_free_tier(self, provider):
        """Test generation for free tier (returns URL, no API call)."""
        request = ImageGenerationRequest(prompt="test cat")
        result = await provider.generate(request)

        assert "image_url" in result
        assert result["prompt"] == "test cat"
        assert result["metadata"]["private"] is False

    @pytest.mark.asyncio
    async def test_generate_private_no_key(self, provider):
        """Private generation without API key should raise error."""
        request = ImageGenerationRequest(prompt="test", private=True)
        with pytest.raises(ProviderAPIError):
            await provider.generate(request)
