"""
Audio generation service using gTTS (Google Text-to-Speech) for multilingual audio.
Supports English, Tamil, Malayalam, and Hindi.
"""
import os
import uuid
from typing import Optional
from gtts import gTTS
from core.config import AUDIO_OUTPUT_DIR, DEFAULT_LANGUAGE


# Language code mapping for gTTS
LANGUAGE_CODES = {
    "english": "en",
    "tamil": "ta",
    "malayalam": "ml",
    "hindi": "hi",
}


class AudioGenerator:
    """Generates audio from text using gTTS with multilingual support"""

    def __init__(self):
        print("AudioGenerator initialized (using gTTS)")

    def generate(self, text: str, language: str = DEFAULT_LANGUAGE) -> Optional[str]:
        """
        Generate audio from text and save to file

        :param text: Text to convert to speech
        :param language: Language for audio generation (english, tamil, malayalam, hindi)
        :return: Path to generated audio file
        """
        try:
            language_lower = language.lower()
            print(f"Generating speech for text: {text[:50]}... in {language}")

            # Get language code for gTTS
            lang_code = LANGUAGE_CODES.get(language_lower)
            if not lang_code:
                raise ValueError(f"Unsupported language: {language}")

            # Generate unique filename with language tag
            audio_filename = f"audio_{language_lower}_{uuid.uuid4().hex[:8]}.mp3"
            output_path = os.path.join(AUDIO_OUTPUT_DIR, audio_filename)

            # Generate speech using gTTS
            tts = gTTS(text=text, lang=lang_code, slow=False)
            tts.save(output_path)

            # Verify file was created and has content
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
