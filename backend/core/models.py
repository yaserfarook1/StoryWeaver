"""
Pydantic models for request/response validation
"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


# ============ Image Analysis ============
class ImageAnalysisResponse(BaseModel):
    status: str = Field(..., description="Status of the analysis")
    description: str = Field(..., description="Generated description from image")
    story: str = Field(..., description="Generated story")
    audio_url: Optional[str] = Field(None, description="URL to generated audio file")
    language: str = Field("english", description="Language of story and audio")
    processing_time: float = Field(..., description="Time taken to process in seconds")


# ============ Video Analysis ============
class VideoAnalysisResponse(BaseModel):
    status: str = Field(..., description="Status of the analysis")
    description: str = Field(..., description="Generated description from video")
    story: str = Field(..., description="Generated story")
    audio_url: Optional[str] = Field(None, description="URL to generated audio file")
    language: str = Field("english", description="Language of story and audio")
    processing_time: float = Field(..., description="Time taken to process in seconds")


# ============ Story Generation ============
class StoryGenerationRequest(BaseModel):
    text: str = Field(..., description="Input text to generate story from")
    language: str = Field("english", description="Language for the story")


class StoryGenerationResponse(BaseModel):
    status: str = Field(..., description="Status of the generation")
    story: str = Field(..., description="Generated story")
    language: str = Field("english", description="Language of the generated story")
    processing_time: float = Field(..., description="Time taken to process in seconds")


# ============ Audio Generation ============
class AudioGenerationRequest(BaseModel):
    text: str = Field(..., description="Text to convert to speech")
    language: str = Field("english", description="Language for audio generation")


class AudioGenerationResponse(BaseModel):
    status: str = Field(..., description="Status of the generation")
    audio_url: Optional[str] = Field(None, description="URL to generated audio file")
    language: str = Field("english", description="Language of the generated audio")
    processing_time: float = Field(..., description="Time taken to process in seconds")


# ============ Sample Files ============
class SampleFile(BaseModel):
    id: str = Field(..., description="Unique identifier")
    name: str = Field(..., description="Display name")
    filename: str = Field(..., description="Actual filename")
    type: str = Field(..., description="Type: image or video")
    emoji: str = Field(..., description="Emoji icon")


class SampleListResponse(BaseModel):
    status: str = Field(..., description="Status")
    samples: list[SampleFile] = Field(..., description="List of sample files")


# ============ Error Response ============
class ErrorResponse(BaseModel):
    status: str = Field(..., description="Status: error")
    message: str = Field(..., description="Error message")
    details: Optional[str] = Field(None, description="Additional error details")
