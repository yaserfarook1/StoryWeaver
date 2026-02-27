"""
FastAPI application for StoryWeaver
Transform images and videos into captivating stories with AI-powered narration
"""
import os
from fastapi import FastAPI
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from core.config import API_TITLE, API_VERSION, API_DESCRIPTION, AUDIO_OUTPUT_DIR
from api.routes import router

# Create FastAPI app
app = FastAPI(
    title=API_TITLE,
    version=API_VERSION,
    description=API_DESCRIPTION,
    docs_url="/docs",
    redoc_url="/redoc",
)

# Add CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(router)


# ============ Health Check ============
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "StoryWeaver API"}


# ============ Audio File Serving ============
@app.get("/api/audio/{filename}")
async def get_audio(filename: str):
    """Serve generated audio files"""
    try:
        file_path = os.path.join(AUDIO_OUTPUT_DIR, filename)

        if not os.path.exists(file_path):
            return JSONResponse(
                status_code=404, content={"error": "Audio file not found"}
            )

        return FileResponse(file_path, media_type="audio/mpeg")

    except Exception as e:
        return JSONResponse(
            status_code=500, content={"error": f"Error serving audio: {str(e)}"}
        )


# ============ Root Endpoint ============
@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "service": API_TITLE,
        "version": API_VERSION,
        "description": API_DESCRIPTION,
        "docs": "/docs",
        "endpoints": {
            "analyze_image": "POST /api/analyze/image",
            "analyze_video": "POST /api/analyze/video",
            "generate_story": "POST /api/generate/story",
            "generate_audio": "POST /api/generate/audio",
            "list_samples": "GET /api/samples",
            "health": "GET /health",
        },
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info",
    )
