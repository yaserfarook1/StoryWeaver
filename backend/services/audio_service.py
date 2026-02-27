"""
Audio generation service using pyttsx3 for text-to-speech
"""
import os
import uuid
from typing import Any
import pyttsx3
from core.config import AUDIO_OUTPUT_DIR


class AudioGenerator:
    """Generates audio from text using pyttsx3"""

    def generate(self, text: str) -> str:
        """
        Generate audio from text and save to file

        :param text: Text to convert to speech
        :return: Path to generated audio file
        """
        try:
            print(f"Generating speech for text: {text[:50]}...")

            # Generate unique filename
            audio_filename = f"audio_{uuid.uuid4().hex[:8]}.mp3"
            output_path = os.path.join(AUDIO_OUTPUT_DIR, audio_filename)

            # Initialize text-to-speech engine
            engine: Any = pyttsx3.init()
            engine.setProperty('rate', 150)  # Speed of speech
            engine.setProperty('volume', 0.9)  # Volume (0.0 to 1.0)

            # Save audio file
            engine.save_to_file(text, output_path)
            engine.runAndWait()

            # Verify file was created
            if os.path.exists(output_path):
                file_size = os.path.getsize(output_path)
                print(f"Audio generated successfully: {output_path} ({file_size} bytes)")
                return output_path
            else:
                raise Exception("Audio file was not created")

        except Exception as e:
            print(f"Error generating audio: {e}")
            raise


# Create singleton instance
_audio_generator = None


def get_audio_generator() -> AudioGenerator:
    """Get or create the audio generator instance"""
    global _audio_generator
    if _audio_generator is None:
        _audio_generator = AudioGenerator()
    return _audio_generator
