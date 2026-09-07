"""Application configuration loaded from .env file."""

from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List


class Settings(BaseSettings):
    """Pydantic settings with .env support."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # Server settings
    APP_HOST: str = "0.0.0.0"
    APP_PORT: int = 8000
    APP_DEBUG: bool = False

    # Pollinations.ai settings
    POLLINATIONS_BASE_URL: str = "https://image.pollinations.ai"
    POLLINATIONS_API_KEY: str | None = None

    # Default models
    DEFAULT_IMAGE_MODEL: str = "flux"
    DEFAULT_VIDEO_MODEL: str | None = None
    DEFAULT_TEXT_MODEL: str | None = None
    DEFAULT_ENHANCE_MODEL: str | None = None

    # Request limits
    REQUEST_TIMEOUT: int = 60
    MAX_IMAGE_WIDTH: int = 2048
    MAX_IMAGE_HEIGHT: int = 2048
    MAX_IMAGE_SEED: int = 999999

    # CORS
    CORS_ORIGINS: str = "http://localhost:3000"

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]


settings = Settings()
