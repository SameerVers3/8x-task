"""Shared request and response models for the inference relay."""

from models.requests import ImageGenerationRequest, VideoGenerationRequest, TextGenerationRequest, ImageEnhancementRequest
from models.responses import InferenceResponse, ImageGenerationResponse, VideoGenerationResponse, TextGenerationResponse, ImageEnhancementResponse

__all__ = [
    "ImageGenerationRequest",
    "VideoGenerationRequest",
    "TextGenerationRequest",
    "ImageEnhancementRequest",
    "InferenceResponse",
    "ImageGenerationResponse",
    "VideoGenerationResponse",
    "TextGenerationResponse",
    "ImageEnhancementResponse",
]
