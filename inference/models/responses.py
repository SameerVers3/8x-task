"""Response models for inference tasks."""

from pydantic import BaseModel, Field
from typing import Any, Optional


class InferenceResponse(BaseModel):
    """Standardized wrapper for all inference responses."""

    success: bool = Field(default=True, description="Whether the inference succeeded")
    data: Any | None = Field(default=None, description="Response data (provider-specific)")
    error: Optional[str] = Field(default=None, description="Error message if success is False")

    @classmethod
    def create_success(cls, data: Any) -> "InferenceResponse":
        """Factory for a successful response."""
        return cls(success=True, data=data, error=None)

    @classmethod
    def create_error(cls, message: str) -> "InferenceResponse":
        """Factory for an error response."""
        return cls(success=False, data=None, error=message)


class BaseGenerationResponse(BaseModel):
    """Base response for generation tasks."""

    model: str = Field(..., description="Model used for generation")
    prompt: Optional[str] = Field(default=None, description="Original prompt")
    metadata: dict = Field(default_factory=dict, description="Additional metadata")


class ImageGenerationResponse(BaseGenerationResponse):
    """Response model for image generation."""

    image_url: str = Field(..., description="URL to the generated image")
    width: Optional[int] = Field(default=None, description="Image width")
    height: Optional[int] = Field(default=None, description="Image height")
    seed: Optional[int] = Field(default=None, description="Seed used for generation")


class VideoGenerationResponse(BaseGenerationResponse):
    """Response model for video generation (placeholder)."""

    video_url: str = Field(..., description="URL to the generated video")
    duration: Optional[int] = Field(default=None, description="Video duration in seconds")
    fps: Optional[int] = Field(default=None, description="Frames per second")


class TextGenerationResponse(BaseGenerationResponse):
    """Response model for text generation (placeholder)."""

    text: str = Field(..., description="Generated text content")
    tokens_used: Optional[int] = Field(default=None, description="Number of tokens consumed")


class ImageEnhancementResponse(BaseGenerationResponse):
    """Response model for image enhancement (placeholder)."""

    enhanced_image_url: str = Field(..., description="URL to the enhanced image")
    enhancement_type: str = Field(..., description="Type of enhancement applied")
    scale_factor: Optional[float] = Field(default=None, description="Upscaling factor if applicable")
