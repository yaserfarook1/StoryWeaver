"""
Configuration settings for the Image-to-Voice API
"""
import os
from dotenv import find_dotenv, load_dotenv

load_dotenv(find_dotenv())

# API Settings
API_TITLE = "StoryWeaver API"
API_VERSION = "1.0.0"
API_DESCRIPTION = "Transform images and videos into captivating stories with AI-powered narration"

# API Keys
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
HUGGINGFACE_API_TOKEN = os.getenv("HUGGINGFACE_API_TOKEN", "")

# File Settings
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB
ALLOWED_IMAGE_TYPES = {"jpg", "jpeg", "png"}
ALLOWED_VIDEO_TYPES = {"mp4", "webm"}
UPLOAD_DIR = "temp_uploads"
AUDIO_OUTPUT_DIR = "generated_audio"

# Model Settings
BLIP_MODEL_NAME = "Salesforce/blip-image-captioning-base"
LLAVA_MODEL_NAME = "llava-hf/llava-1.5-7b-hf"
LLAVA_QUANTIZATION = "4bit"  # 4-bit quantization reduces model size to ~8GB
GEMINI_MODEL_NAME = "gemini-2.5-flash"

# Language Settings
SUPPORTED_LANGUAGES = ["english", "tamil", "malayalam", "hindi"]
DEFAULT_LANGUAGE = "english"

# Language to Coqui TTS Model Mapping
LANGUAGE_TO_TTS_MODEL = {
    "english": "tts_models/en/ljspeech/tacotron2-DDC",
    "tamil": "tts_models/ta/mozilla/tacotron2-DDC",
    "malayalam": "tts_models/ml/mozilla/tacotron2-DDC",
    "hindi": "tts_models/hi/mozilla/tacotron2-DDC",
}

# Video Settings
VIDEO_FRAME_COUNT = 5

# Ensure upload directories exist
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(AUDIO_OUTPUT_DIR, exist_ok=True)
