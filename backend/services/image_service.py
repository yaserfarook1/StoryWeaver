"""
Image analysis service using BLIP model and Gemini for detailed descriptions
"""
from PIL import Image
from typing import Any
import google.generativeai as genai
from transformers import BlipProcessor, BlipForConditionalGeneration
from core.config import GEMINI_MODEL_NAME, GEMINI_API_KEY


# Configure Gemini API
genai.configure(api_key=GEMINI_API_KEY)


class ImageAnalyzer:
    """Analyzes images using BLIP model with Gemini enhancement for detailed descriptions"""

    def __init__(self):
        self.processor: Any = None
        self.model: Any = None
        self._load_models()

    def _load_models(self):
        """Load BLIP processor and model"""
        print(f"Loading image analysis model...")
        print("Note: First download will be ~1GB. This is a one-time download.")

        try:
            model_name = "Salesforce/blip-image-captioning-base"

            # Load processor
            self.processor = BlipProcessor.from_pretrained(model_name)

            # Load model
            self.model = BlipForConditionalGeneration.from_pretrained(model_name)

            print("Image analysis model loaded successfully")
        except Exception as e:
            print(f"Error loading model: {e}")
            raise

    def analyze(self, image_path: str) -> str:
        """
        Analyze an image and generate a detailed description

        :param image_path: Path to the image file
        :return: Generated detailed text description (3-5 sentences)
        """
        try:
            print(f"Analyzing image: {image_path}")

            # Load image
            image = Image.open(image_path).convert('RGB')

            # Generate initial caption with BLIP
            inputs = self.processor(image, return_tensors="pt")
            out = self.model.generate(**inputs, max_length=100)
            caption = self.processor.decode(out[0], skip_special_tokens=True)
            print(f"Generated initial caption: {caption}")

            # Enhance caption with Gemini for a brief 2-line description
            print("Enhancing description with Gemini...")
            gemini_model: Any = genai.GenerativeModel(GEMINI_MODEL_NAME)
            prompt: str = f"""Based on this image caption, write a simple 2-line factual description of what's in the image.
Just describe the content plainly - no flowery language, no emotions, just what you see.

Image caption: {caption}

Simple description (2 lines):"""

            response: Any = gemini_model.generate_content(prompt)
            simple_description: str = response.text.strip()

            print(f"Generated description: {simple_description[:100]}...")
            return simple_description

        except Exception as e:
            print(f"Error analyzing image: {e}")
            raise


# Create singleton instance
_image_analyzer = None


def get_image_analyzer() -> ImageAnalyzer:
    """Get or create the image analyzer instance"""
    global _image_analyzer
    if _image_analyzer is None:
        _image_analyzer = ImageAnalyzer()
    return _image_analyzer
