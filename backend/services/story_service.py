"""
Story generation service using Google Gemini API
"""
from typing import Any
import google.generativeai as genai
from core.config import GEMINI_API_KEY, GEMINI_MODEL_NAME

# Configure Gemini API
genai.configure(api_key=GEMINI_API_KEY)


class StoryGenerator:
    """Generates stories using Google Gemini API"""

    def generate(self, scenario: str) -> str:
        """
        Generate a short story from a scenario/description

        :param scenario: Input text/scenario
        :return: Generated story (max 50 words)
        """
        try:
            print(f"Generating story from: {scenario[:100]}...")

            prompt_template: str = f"""You are a talented story teller who can create a story from a simple narrative.
Create a story using the following scenario; the story should be maximum 50 words long:

CONTEXT: {scenario}
STORY:"""

            model: Any = genai.GenerativeModel(GEMINI_MODEL_NAME)
            response: Any = model.generate_content(prompt_template)
            generated_story: str = response.text.strip()

            print(f"Story generated: {generated_story[:100]}...")
            return generated_story

        except Exception as e:
            print(f"Error generating story: {e}")
            raise


# Create singleton instance
_story_generator = None


def get_story_generator() -> StoryGenerator:
    """Get or create the story generator instance"""
    global _story_generator
    if _story_generator is None:
        _story_generator = StoryGenerator()
    return _story_generator
