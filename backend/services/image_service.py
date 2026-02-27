"""
Image analysis service using BLIP model
"""
from PIL import Image
from typing import Any
from transformers.models.blip.processing_blip import BlipProcessor
from transformers.models.blip.modeling_blip import BlipForConditionalGeneration
from core.config import BLIP_MODEL_NAME


class ImageAnalyzer:
    """Analyzes images using BLIP model"""

    def __init__(self):
        self.processor: Any = None
        self.model: Any = None
        self._load_models()

    def _load_models(self):
        """Load BLIP processor and model"""
        print(f"Loading BLIP model: {BLIP_MODEL_NAME}")
        self.processor = BlipProcessor.from_pretrained(BLIP_MODEL_NAME)
        self.model = BlipForConditionalGeneration.from_pretrained(BLIP_MODEL_NAME)
        print("BLIP model loaded successfully")

    def analyze(self, image_path: str) -> str:
        """
        Analyze an image and generate a description

        :param image_path: Path to the image file
        :return: Generated text description
        """
        try:
            print(f"Analyzing image: {image_path}")

            # Load and convert image
            image = Image.open(image_path).convert('RGB')

            # Process image
            inputs: Any = self.processor(images=image, return_tensors="pt")

            # Generate description
            out: Any = self.model.generate(**inputs)
            generated_text: str = self.processor.decode(out[0], skip_special_tokens=True)

            print(f"Generated description: {generated_text}")
            return generated_text

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
