"""Unit tests for the JSON2Video provider."""

import pytest
from providers.json2video import JSON2VideoProvider
from providers.base import ProviderValidationError, ProviderAPIError
from models.requests import VideoGenerationRequest


class TestJSON2VideoProvider:
    """Test the JSON2Video video provider."""

    @pytest.fixture
    def provider(self):
        return JSON2VideoProvider()

    def test_task_type(self, provider):
        assert provider.task_type == "video"

    def test_supported_models(self, provider):
        assert "json2video" in provider.supported_models

    def test_supports_model(self, provider):
        assert provider.supports_model("json2video") is True
        assert provider.supports_model("JSON2VIDEO") is True  # Case insensitive
        assert provider.supports_model("nonexistent") is False

    def test_validate_input_valid(self, provider):
        data = {"prompt": "a cat in space", "width": 512, "height": 512, "duration": 5, "fps": 24}
        result = provider.validate_input(data)
        assert isinstance(result, VideoGenerationRequest)
        assert result.prompt == "a cat in space"
        assert result.width == 512
        assert result.height == 512
        assert result.duration == 5
        assert result.fps == 24

    def test_validate_input_json_mode(self, provider):
        data = {
            "json": {
                "scenes": [{"text": "Hello", "duration": 3}]
            },
            "width": 512,
            "height": 512,
        }
        result = provider.validate_input(data)
        assert isinstance(result, VideoGenerationRequest)
        assert result.definition is not None
        assert result.definition["scenes"][0]["text"] == "Hello"

    def test_validate_input_empty_prompt(self, provider):
        with pytest.raises(ProviderValidationError):
            provider.validate_input({"prompt": ""})

    def test_validate_input_missing_prompt_and_json(self, provider):
        with pytest.raises(ProviderValidationError):
            provider.validate_input({"width": 512})

    def test_build_payload_simple_mode(self, provider):
        request = VideoGenerationRequest(prompt="a cat walking", duration=5, width=512, height=512, fps=24)
        payload = provider._build_payload(request)

        assert payload["prompt"] == "a cat walking"
        assert payload["duration"] == 5
        assert payload["width"] == 512
        assert payload["height"] == 512
        assert payload["fps"] == 24

    def test_build_payload_json_mode(self, provider):
        request = VideoGenerationRequest(
            prompt="",
            definition={"scenes": [{"text": "Hello", "duration": 3}]},
            width=512,
            height=512,
            fps=30,
        )
        payload = provider._build_payload(request)

        assert payload["scenes"][0]["text"] == "Hello"
        assert payload["width"] == 512
        assert payload["height"] == 512
        assert payload["fps"] == 30

    def test_build_payload_json_mode_preserves_existing(self, provider):
        request = VideoGenerationRequest(
            prompt="",
            definition={
                "scenes": [{"text": "Hello", "duration": 3}],
                "width": 720,
                "fps": 60,
            },
            width=512,
            height=512,
            fps=24,
        )
        payload = provider._build_payload(request)

        # Existing values in definition should not be overwritten
        assert payload["width"] == 720
        assert payload["fps"] == 60

    def test_format_output(self, provider):
        request = VideoGenerationRequest(
            prompt="a cat walking",
            duration=5,
            width=512,
            height=512,
            fps=24,
        )
        raw_response = {
            "video_url": "https://example.com/video.mp4",
            "job_id": "job-123",
            "status": "completed",
        }
        result = provider.format_output(raw_response, request)

        assert result["video_url"] == "https://example.com/video.mp4"
        assert result["prompt"] == "a cat walking"
        assert result["duration"] == 5
        assert result["fps"] == 24
        assert result["metadata"]["job_id"] == "job-123"
        assert result["metadata"]["status"] == "completed"
        assert result["metadata"]["provider"] == "json2video"

    def test_format_output_non_dict(self, provider):
        request = VideoGenerationRequest(prompt="test", duration=5, width=512, height=512, fps=24)
        result = provider.format_output("https://example.com/video.mp4", request)

        assert result["video_url"] == "https://example.com/video.mp4"
        assert result["metadata"]["status"] == "unknown"

    def test_get_headers_no_key(self, provider):
        headers = provider.get_headers()
        assert "Authorization" not in headers
        assert "X-API-Key" not in headers

    def test_get_headers_with_key(self, provider):
        headers = provider.get_headers("secret-key")
        assert headers["Authorization"] == "Bearer secret-key"
        assert headers["X-API-Key"] == "secret-key"

    @pytest.mark.asyncio
    async def test_generate_no_api_key(self, provider):
        """Generation without API key should raise error."""
        request = VideoGenerationRequest(prompt="test cat")
        with pytest.raises(ProviderAPIError):
            await provider.generate(request)
