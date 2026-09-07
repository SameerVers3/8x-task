"""Abstract base class for all inference providers."""

from abc import ABC, abstractmethod
from typing import Any, Type
from pydantic import BaseModel


class ProviderNotFoundError(Exception):
    """Raised when a requested provider or model is not found."""

    pass


class ProviderAPIError(Exception):
    """Raised when a provider API call fails."""

    pass


class ProviderValidationError(Exception):
    """Raised when input validation fails for a provider."""

    pass


class BaseProvider(ABC):
    """
    Abstract base class that all inference providers must implement.

    Each provider defines:
    - task_type: The category of inference (image, video, text, enhance)
    - supported_models: List of model names this provider supports
    - request_model: Pydantic model for validating input
    - response_model: Pydantic model for structuring output
    """

    task_type: str = ""
    supported_models: list[str] = []
    request_model: Type[BaseModel] | None = None
    response_model: Type[BaseModel] | None = None

    @classmethod
    def supports_model(cls, model: str) -> bool:
        """Check if this provider supports the given model."""
        return model.lower() in [m.lower() for m in cls.supported_models]

    @classmethod
    def validate_input(cls, data: dict) -> BaseModel:
        """
        Validate incoming request data against the provider's request model.

        Args:
            data: Raw dictionary from the request body

        Returns:
            Validated pydantic model instance

        Raises:
            ProviderValidationError: If validation fails
        """
        if cls.request_model is None:
            raise ProviderValidationError(f"Provider {cls.__name__} has no request_model defined")

        try:
            return cls.request_model(**data)
        except Exception as e:
            raise ProviderValidationError(f"Input validation failed: {str(e)}") from e

    @abstractmethod
    async def generate(self, request: BaseModel, api_key: str | None = None) -> dict:
        """
        Execute the inference request against the provider's API.

        Args:
            request: Validated request model
            api_key: Optional API key for authentication

        Returns:
            Dictionary with standardized response data

        Raises:
            ProviderAPIError: If the API call fails
        """
        pass

    @abstractmethod
    def format_output(self, raw_response: Any, request: BaseModel) -> dict:
        """
        Normalize the raw provider response into a standardized dictionary.

        Args:
            raw_response: Raw response from the provider API
            request: Original validated request

        Returns:
            Standardized dictionary matching the provider's response_model
        """
        pass

    def get_headers(self, api_key: str | None = None) -> dict:
        """
        Build headers for the provider API call.

        Args:
            api_key: Optional API key

        Returns:
            Dictionary of HTTP headers
        """
        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
        }
        if api_key:
            headers["Authorization"] = f"Bearer {api_key}"
        return headers

    @classmethod
    def list_models(cls) -> list[str]:
        """Return the list of models supported by this provider."""
        return cls.supported_models.copy()
