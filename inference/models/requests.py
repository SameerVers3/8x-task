"""Request models for inference tasks."""

from pydantic import BaseModel, Field, field_validator
from typing import Optional


class BaseInferenceRequest(BaseModel):
    """Base class for all inference requests."""

    pass


class ImageGenerationRequest(BaseInferenceRequest):
    """Request model for image generation."""

    prompt: str = Field(..., min_length=1, max_length=10000, description="Text prompt describing the desired image")
    width: int = Field(default=1024, ge=64, le=4096, description="Image width in pixels")
    height: int = Field(default=1024, ge=64, le=4096, description="Image height in pixels")
    seed: Optional[int] = Field(default=None, ge=0, le=999999, description="Random seed for reproducibility")
    negative_prompt: Optional[str] = Field(default=None, max_length=5000, description="Things to avoid in the image")
    nologo: bool = Field(default=True, description="Remove watermark/logo from generated image")
    private: bool = Field(default=False, description="Use private generation (requires API key)")

    @field_validator("prompt")
    @classmethod
    def validate_prompt_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Prompt cannot be empty or whitespace only")
        return v.strip()


class VideoGenerationRequest(BaseInferenceRequest):
    """Request model for video generation (placeholder for future)."""

    prompt: str = Field(..., min_length=1, max_length=10000, description="Text prompt describing the desired video")
    duration: Optional[int] = Field(default=5, ge=1, le=60, description="Video duration in seconds")
    width: Optional[int] = Field(default=512, ge=64, le=4096, description="Video width in pixels")
    height: Optional[int] = Field(default=512, ge=64, le=4096, description="Video height in pixels")
    fps: Optional[int] = Field(default=24, ge=1, le=60, description="Frames per second")

    @field_validator("prompt")
    @classmethod
    def validate_prompt_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Prompt cannot be empty or whitespace only")
        return v.strip()


class TextGenerationRequest(BaseInferenceRequest):
    """Request model for text generation (placeholder for future)."""

    prompt: str = Field(..., min_length=1, max_length=10000, description="Text prompt or instruction")
    max_tokens: Optional[int] = Field(default=1024, ge=1, le=8000, description="Maximum tokens to generate")
    temperature: Optional[float] = Field(default=0.7, ge=0.0, le=2.0, description="Sampling temperature")
    top_p: Optional[float] = Field(default=1.0, ge=0.0, le=1.0, description="Nucleus sampling parameter")

    @field_validator("prompt")
    @classmethod
    def validate_prompt_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Prompt cannot be empty or whitespace only")
        return v.strip()


class ImageEnhancementRequest(BaseInferenceRequest):
    """Request model for image enhancement (placeholder for future)."""

    image_url: str = Field(..., min_length=1, description="URL of the image to enhance")
    enhancement_type: str = Field(default="upscale", description="Type of enhancement: upscale, denoise, restore, etc.")
    scale_factor: Optional[float] = Field(default=2.0, ge=1.0, le=4.0, description="Upscaling factor")
