"""
Video analysis service using frame extraction and BLIP model
"""
import cv2
from PIL import Image
from typing import Any, List
import google.generativeai as genai
from transformers.models.blip.processing_blip import BlipProcessor
from transformers.models.blip.modeling_blip import BlipForConditionalGeneration
from core.config import BLIP_MODEL_NAME, VIDEO_FRAME_COUNT, GEMINI_MODEL_NAME, GEMINI_API_KEY


# Configure Gemini API
genai.configure(api_key=GEMINI_API_KEY)


class VideoAnalyzer:
    """Analyzes videos using frame extraction and BLIP model with Gemini synthesis"""

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

    def extract_frames(self, video_path: str, num_frames: int = VIDEO_FRAME_COUNT) -> List[Image.Image]:
        """
        Extract evenly spaced frames from video

        :param video_path: Path to video file
        :param num_frames: Number of frames to extract
        :return: List of PIL Image frames
        """
        try:
            print(f"Extracting {num_frames} frames from: {video_path}")
            cap = cv2.VideoCapture(video_path)

            total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            frame_indices = [int(i * total_frames / num_frames) for i in range(num_frames)]

            frames: List[Image.Image] = []
            for idx in frame_indices:
                cap.set(cv2.CAP_PROP_POS_FRAMES, idx)
                ret, frame = cap.read()
                if ret:
                    # Convert BGR to RGB for PIL
                    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                    pil_image = Image.fromarray(frame_rgb)
                    frames.append(pil_image)

            cap.release()
            print(f"Successfully extracted {len(frames)} frames")
            return frames

        except Exception as e:
            print(f"Error extracting frames: {e}")
            raise

    def analyze(self, video_path: str) -> str:
        """
        Analyze a video and generate a description

        :param video_path: Path to the video file
        :return: Generated description of video content
        """
        try:
            print(f"Analyzing video: {video_path}")

            # Extract frames
            frames = self.extract_frames(video_path)

            if not frames:
                raise ValueError("Could not extract frames from video")

            # Analyze frames with BLIP
            print("Analyzing frames with BLIP model...")
            frame_descriptions: List[str] = []

            for i, frame in enumerate(frames):
                inputs: Any = self.processor(images=frame, return_tensors="pt")
                out: Any = self.model.generate(**inputs)
                description: str = self.processor.decode(out[0], skip_special_tokens=True)
                frame_descriptions.append(description)
                print(f"  Frame {i+1}: {description}")

            # Combine frame descriptions
            combined_frames = " ".join(frame_descriptions)

            # Use Gemini to create coherent narrative
            print("Generating coherent description with Gemini...")
            gemini_model: Any = genai.GenerativeModel(GEMINI_MODEL_NAME)
            prompt: str = f"""Based on these frame-by-frame descriptions from a video, create a coherent and detailed description of what's happening:

Frame descriptions: {combined_frames}

Provide a concise summary (2-3 sentences) that captures the essence and flow of the video."""

            response: Any = gemini_model.generate_content(prompt)
            video_description: str = response.text.strip()

            print(f"Video analysis complete: {video_description[:100]}...")
            return video_description

        except Exception as e:
            print(f"Error analyzing video: {e}")
            raise


# Create singleton instance
_video_analyzer = None


def get_video_analyzer() -> VideoAnalyzer:
    """Get or create the video analyzer instance"""
    global _video_analyzer
    if _video_analyzer is None:
        _video_analyzer = VideoAnalyzer()
    return _video_analyzer
