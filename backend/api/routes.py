"""
API routes for Image-to-Voice converter
"""
import time
import os
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from core.models import (
    ImageAnalysisResponse,
    VideoAnalysisResponse,
    StoryGenerationRequest,
    StoryGenerationResponse,
    AudioGenerationRequest,
    AudioGenerationResponse,
    SampleListResponse,
    SampleFile,
    ErrorResponse,
)
from services.image_service import get_image_analyzer
from services.video_service import get_video_analyzer
from services.story_service import get_story_generator
from services.audio_service import get_audio_generator
from core.config import UPLOAD_DIR, ALLOWED_IMAGE_TYPES, ALLOWED_VIDEO_TYPES, AUDIO_OUTPUT_DIR

router = APIRouter(prefix="/api", tags=["processing"])


# ============ Image Analysis ============
@router.post("/analyze/image", response_model=ImageAnalysisResponse)
async def analyze_image(file: UploadFile = File(...)):
    """Analyze an image and generate description, story, and audio"""
    start_time = time.time()

    try:
        # Validate file
        if not file.filename:
            raise HTTPException(status_code=400, detail="No filename provided")

        file_ext = file.filename.split(".")[-1].lower()
        if file_ext not in ALLOWED_IMAGE_TYPES:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid file type. Allowed: {ALLOWED_IMAGE_TYPES}",
            )

        # Save uploaded file
        temp_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(temp_path, "wb") as f:
            content = await file.read()
            f.write(content)

        try:
            # Analyze image
            image_analyzer = get_image_analyzer()
            description = image_analyzer.analyze(temp_path)

            # Generate story
            story_generator = get_story_generator()
            story = story_generator.generate(description)

            # Generate audio
            audio_generator = get_audio_generator()
            audio_path = audio_generator.generate(story)

            processing_time = time.time() - start_time

            return ImageAnalysisResponse(
                status="success",
                description=description,
                story=story,
                audio_url=f"/api/audio/{os.path.basename(audio_path)}",
                processing_time=round(processing_time, 2),
            )

        finally:
            # Clean up temp file
            if os.path.exists(temp_path):
                os.remove(temp_path)

    except HTTPException as e:
        raise e
    except Exception as e:
        processing_time = time.time() - start_time
        raise HTTPException(
            status_code=500,
            detail=f"Error analyzing image: {str(e)}",
        )


# ============ Video Analysis ============
@router.post("/analyze/video", response_model=VideoAnalysisResponse)
async def analyze_video(file: UploadFile = File(...)):
    """Analyze a video and generate description, story, and audio"""
    start_time = time.time()

    try:
        # Validate file
        if not file.filename:
            raise HTTPException(status_code=400, detail="No filename provided")

        file_ext = file.filename.split(".")[-1].lower()
        if file_ext not in ALLOWED_VIDEO_TYPES:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid file type. Allowed: {ALLOWED_VIDEO_TYPES}",
            )

        # Save uploaded file
        temp_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(temp_path, "wb") as f:
            content = await file.read()
            f.write(content)

        try:
            # Analyze video
            video_analyzer = get_video_analyzer()
            description = video_analyzer.analyze(temp_path)

            # Generate story
            story_generator = get_story_generator()
            story = story_generator.generate(description)

            # Generate audio
            audio_generator = get_audio_generator()
            audio_path = audio_generator.generate(story)

            processing_time = time.time() - start_time

            return VideoAnalysisResponse(
                status="success",
                description=description,
                story=story,
                audio_url=f"/api/audio/{os.path.basename(audio_path)}",
                processing_time=round(processing_time, 2),
            )

        finally:
            # Clean up temp file
            if os.path.exists(temp_path):
                os.remove(temp_path)

    except HTTPException as e:
        raise e
    except Exception as e:
        processing_time = time.time() - start_time
        raise HTTPException(
            status_code=500,
            detail=f"Error analyzing video: {str(e)}",
        )


# ============ Story Generation ============
@router.post("/generate/story", response_model=StoryGenerationResponse)
async def generate_story(request: StoryGenerationRequest):
    """Generate a story from text"""
    start_time = time.time()

    try:
        story_generator = get_story_generator()
        story = story_generator.generate(request.text)

        processing_time = time.time() - start_time

        return StoryGenerationResponse(
            status="success",
            story=story,
            processing_time=round(processing_time, 2),
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating story: {str(e)}")


# ============ Audio Generation ============
@router.post("/generate/audio", response_model=AudioGenerationResponse)
async def generate_audio(request: AudioGenerationRequest):
    """Generate audio from text"""
    start_time = time.time()

    try:
        audio_generator = get_audio_generator()
        audio_path = audio_generator.generate(request.text)

        processing_time = time.time() - start_time

        return AudioGenerationResponse(
            status="success",
            audio_url=f"/api/audio/{os.path.basename(audio_path)}",
            processing_time=round(processing_time, 2),
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating audio: {str(e)}")


# ============ Sample Files ============
@router.get("/samples", response_model=SampleListResponse)
async def list_samples():
    """List available sample images and videos"""
    try:
        # Get the data directory
        # __file__ = backend/api/routes.py
        # dirname = backend/api
        # dirname(dirname) = backend
        # dirname(dirname(dirname)) = production
        api_dir = os.path.dirname(os.path.abspath(__file__))
        backend_dir = os.path.dirname(api_dir)
        production_dir = os.path.dirname(backend_dir)
        data_dir = os.path.join(production_dir, "data")

        samples = []

        if os.path.exists(data_dir):
            for filename in os.listdir(data_dir):
                if filename.lower().endswith(('.jpg', '.jpeg', '.png')):
                    sample_type = "image"
                    emoji = "🖼️"
                elif filename.lower().endswith(('.mp4', '.webm')):
                    sample_type = "video"
                    emoji = "🎬"
                else:
                    continue

                # Create user-friendly name
                name = filename.rsplit(".", 1)[0].replace("_", " ").title()

                samples.append(
                    SampleFile(
                        id=filename.replace(".", "_"),
                        name=name,
                        filename=filename,
                        type=sample_type,
                        emoji=emoji,
                    )
                )

        return SampleListResponse(status="success", samples=samples)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error listing samples: {str(e)}")


@router.get("/samples/{filename}")
async def get_sample_file(filename: str):
    """Get a sample image or video file"""
    try:
        # Security: prevent path traversal
        if ".." in filename or "/" in filename or "\\" in filename:
            raise HTTPException(status_code=403, detail="Access denied")

        # Get the data directory
        # __file__ = backend/api/routes.py
        # dirname = backend/api
        # dirname(dirname) = backend
        # dirname(dirname(dirname)) = production
        api_dir = os.path.dirname(os.path.abspath(__file__))
        backend_dir = os.path.dirname(api_dir)
        production_dir = os.path.dirname(backend_dir)
        data_dir = os.path.join(production_dir, "data")

        file_path = os.path.join(data_dir, filename)

        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail=f"Sample file not found: {filename}")

        return FileResponse(file_path)

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving file: {str(e)}")


# ============ Audio Serving ============
@router.get("/audio/{filename}")
async def get_audio_file(filename: str):
    """Serve generated audio files"""
    try:
        # Security: prevent path traversal
        if ".." in filename or "/" in filename or "\\" in filename:
            raise HTTPException(status_code=403, detail="Access denied")

        file_path = os.path.join(AUDIO_OUTPUT_DIR, filename)

        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail=f"Audio file not found: {filename}")

        return FileResponse(file_path, media_type="audio/mpeg")

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving audio: {str(e)}")
