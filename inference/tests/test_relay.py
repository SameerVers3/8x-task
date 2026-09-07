"""Unit tests for the inference relay."""

import pytest
from relay import InferenceRelay
from providers.base import ProviderNotFoundError, ProviderValidationError
from models.requests import ImageGenerationRequest


@pytest.fixture
def relay():
    """Create a fresh relay instance for each test."""
    # Reset singleton for testing
    InferenceRelay._instance = None
    return InferenceRelay()


class TestInferenceRelay:
    """Test the central relay routing logic."""

    def test_singleton_pattern(self, relay):
        """Relay should be a singleton."""
        relay2 = InferenceRelay()
        assert relay is relay2

    def test_auto_discovery(self, relay):
        """Relay should auto-discover providers on init."""
        providers = relay.list_providers()
        assert "PollinationsProvider" in providers

    def test_list_models(self, relay):
        """Should list all available models."""
        models = relay.list_models()
        assert "image/flux" in models
        assert "image/turbo" in models
        assert "image/any-dark" in models

    def test_list_models_filtered(self, relay):
        """Should filter models by task type."""
        image_models = relay.list_models(task_type="image")
        assert all(m.startswith("image/") for m in image_models)
        assert len(image_models) == 3

    def test_resolve_model_with_explicit(self, relay):
        """Should use the explicitly provided model."""
        model = relay._resolve_model("image", "turbo")
        assert model == "turbo"

    def test_resolve_model_default(self, relay):
        """Should fall back to default model when none provided."""
        model = relay._resolve_model("image", None)
        assert model == "flux"

    def test_resolve_model_no_default(self, relay):
        """Should raise error when no model and no default configured."""
        with pytest.raises(ProviderNotFoundError):
            relay._resolve_model("video", None)

    def test_get_provider_info_found(self, relay):
        """Should return provider info for a valid model."""
        info = relay.get_provider_info("image", "flux")
        assert info["model"] == "flux"
        assert info["task_type"] == "image"
        assert info["provider_class"] == "PollinationsProvider"

    def test_get_provider_info_not_found(self, relay):
        """Should return error info for invalid model."""
        info = relay.get_provider_info("image", "nonexistent")
        assert "error" in info

    @pytest.mark.asyncio
    async def test_route_success(self, relay):
        """Should route a valid image request successfully."""
        result = await relay.route(
            task_type="image",
            model="flux",
            payload={"prompt": "a test cat"},
        )
        assert result.success is True
        assert result.data is not None
        assert "image_url" in result.data
        assert result.data["model"] == "flux"
        assert result.error is None

    @pytest.mark.asyncio
    async def test_route_provider_not_found(self, relay):
        """Should return error for unknown model."""
        result = await relay.route(
            task_type="image",
            model="nonexistent",
            payload={"prompt": "test"},
        )
        assert result.success is False
        assert result.error is not None
        assert "No provider found" in result.error

    @pytest.mark.asyncio
    async def test_route_validation_error(self, relay):
        """Should return error for invalid input."""
        result = await relay.route(
            task_type="image",
            model="flux",
            payload={"prompt": ""},  # Empty prompt is invalid
        )
        assert result.success is False
        assert "Validation error" in result.error

    @pytest.mark.asyncio
    async def test_route_with_api_key(self, relay):
        """Should pass API key through to provider."""
        result = await relay.route(
            task_type="image",
            model="flux",
            payload={"prompt": "test"},
            api_key="test-key",
        )
        assert result.success is True
