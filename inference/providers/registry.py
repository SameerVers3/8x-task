"""Provider registry for auto-discovery and lookup."""

import inspect
import pkgutil
from typing import Type, Dict, Tuple
from providers.base import BaseProvider, ProviderNotFoundError


class ProviderRegistry:
    """
    Registry that holds all available inference providers.

    Providers are keyed by (task_type, model_name) for fast lookup.
    """

    def __init__(self):
        self._providers: Dict[Tuple[str, str], BaseProvider] = {}
        self._provider_classes: Dict[Tuple[str, str], Type[BaseProvider]] = {}

    def register(self, provider_class: Type[BaseProvider]) -> None:
        """
        Register a provider class for all its supported models.

        Args:
            provider_class: Subclass of BaseProvider to register
        """
        if not inspect.isclass(provider_class) or not issubclass(provider_class, BaseProvider):
            raise ValueError(f"Provider must be a subclass of BaseProvider, got {type(provider_class)}")

        for model in provider_class.supported_models:
            key = (provider_class.task_type, model.lower())
            self._provider_classes[key] = provider_class

    def get_provider(self, task_type: str, model: str) -> BaseProvider:
        """
        Get an instance of the provider for a task type and model.

        Args:
            task_type: Category of inference (image, video, text, enhance)
            model: Model name

        Returns:
            Provider instance

        Raises:
            ProviderNotFoundError: If no provider is registered for the task/model
        """
        key = (task_type, model.lower())
        provider_class = self._provider_classes.get(key)

        if provider_class is None:
            # Try fallback to default model for this task type
            available = self.list_models(task_type)
            raise ProviderNotFoundError(
                f"No provider found for task '{task_type}' with model '{model}'. "
                f"Available models: {available}"
            )

        return provider_class()

    def list_models(self, task_type: str | None = None) -> list[str]:
        """
        List all available models, optionally filtered by task type.

        Args:
            task_type: Optional filter by task category

        Returns:
            List of model names in "task_type/model_name" format
        """
        models = []
        for (tt, model), provider_class in self._provider_classes.items():
            if task_type is None or tt == task_type:
                models.append(f"{tt}/{model}")
        return sorted(models)

    def list_providers(self) -> list[str]:
        """Return list of registered provider class names."""
        return sorted(list(set(cls.__name__ for cls in self._provider_classes.values())))

    def auto_discover(self) -> None:
        """
        Auto-discover and register all BaseProvider subclasses in the providers package.

        This scans all modules in the providers package for concrete provider classes.
        """
        import providers.pollinations as pollinations

        # Register known providers explicitly
        # In the future, this can scan all submodules dynamically
        self.register(pollinations.PollinationsProvider)

        # TODO: Dynamic scanning
        # for importer, modname, ispkg in pkgutil.iter_modules(providers.__path__):
        #     module = importer.find_module(modname).load_module(modname)
        #     for name, obj in inspect.getmembers(module, inspect.isclass):
        #         if issubclass(obj, BaseProvider) and obj is not BaseProvider and not inspect.isabstract(obj):
        #             self.register(obj)
