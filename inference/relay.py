"""Central inference relay that routes requests to providers."""

from typing import Any

from providers.base import BaseProvider, ProviderNotFoundError, ProviderAPIError, ProviderValidationError
from providers.registry import ProviderRegistry
from models.responses import InferenceResponse
from config import settings


class InferenceRelay:
    """
    Single relay class that handles all inference requests.

    The relay:
    1. Maintains a registry of all available providers
    2. Routes incoming requests to the correct provider based on task_type + model
    3. Validates input using the provider's request model
    4. Executes generation
    5. Returns standardized responses

    Usage:
        relay = InferenceRelay()
        result = await relay.route("image", "flux", {"prompt": "a cat"}, api_key="...")
    """

    _instance: "InferenceRelay | None" = None

    def __new__(cls):
        """Singleton pattern to ensure one relay instance across the app."""
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if self._initialized:
            return

        self.registry = ProviderRegistry()
        self.registry.auto_discover()
        self._initialized = True

    async def route(
        self,
        task_type: str,
        model: str | None,
        payload: dict,
        api_key: str | None = None,
    ) -> InferenceResponse:
        """
        Route an inference request to the appropriate provider.

        Args:
            task_type: Category of inference (image, video, text, enhance)
            model: Model name. If None, uses the default model for the task type.
            payload: Request body dictionary
            api_key: Optional API key from X-API-Key header

        Returns:
            Standardized InferenceResponse
        """
        try:
            # Resolve model name
            resolved_model = self._resolve_model(task_type, model)

            # Look up the provider
            provider = self.registry.get_provider(task_type, resolved_model)

            # Validate input using the provider's request model
            validated_request = provider.validate_input(payload)

            # Execute generation
            raw_output = await provider.generate(validated_request, api_key=api_key)

            # Ensure model name is set correctly in the output
            if isinstance(raw_output, dict):
                raw_output["model"] = resolved_model

            # Format output (already done by generate, but we could add post-processing here)
            return InferenceResponse.create_success(raw_output)

        except ProviderNotFoundError as e:
            return InferenceResponse.create_error(str(e))
        except ProviderValidationError as e:
            return InferenceResponse.create_error(f"Validation error: {str(e)}")
        except ProviderAPIError as e:
            return InferenceResponse.create_error(f"Provider API error: {str(e)}")
        except Exception as e:
            return InferenceResponse.create_error(f"Unexpected error: {str(e)}")

    def _resolve_model(self, task_type: str, model: str | None) -> str:
        """
        Resolve model name. If not provided, use default from settings.

        Args:
            task_type: Category of inference
            model: Requested model name or None

        Returns:
            Resolved model name
        """
        if model:
            return model

        # Use default model for the task type
        defaults = {
            "image": settings.DEFAULT_IMAGE_MODEL,
            "video": settings.DEFAULT_VIDEO_MODEL,
            "text": settings.DEFAULT_TEXT_MODEL,
            "enhance": settings.DEFAULT_ENHANCE_MODEL,
        }

        default = defaults.get(task_type)
        if default is None:
            raise ProviderNotFoundError(f"No default model configured for task type '{task_type}'")

        return default

    def list_models(self, task_type: str | None = None) -> list[str]:
        """
        List all available models, optionally filtered by task type.

        Args:
            task_type: Optional task category filter

        Returns:
            List of available models in "task/model" format
        """
        return self.registry.list_models(task_type)

    def list_providers(self) -> list[str]:
        """Return list of registered provider names."""
        return self.registry.list_providers()

    def get_provider_info(self, task_type: str, model: str) -> dict:
        """
        Get information about a specific provider.

        Args:
            task_type: Task category
            model: Model name

        Returns:
            Dictionary with provider metadata
        """
        try:
            provider = self.registry.get_provider(task_type, model)
            return {
                "task_type": task_type,
                "model": model,
                "provider_class": type(provider).__name__,
                "supported_models": provider.list_models(),
            }
        except ProviderNotFoundError:
            return {
                "task_type": task_type,
                "model": model,
                "error": "Provider not found",
            }
