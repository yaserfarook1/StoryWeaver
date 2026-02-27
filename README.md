# StoryWeaver - AI Image/Video to Voice Converter

## Project Overview

**StoryWeaver** transforms images and videos into captivating stories with AI-generated narration. Upload an image or video, and the app will:
1. Analyze the visual content
2. Generate a creative story
3. Convert the story to audio narration

## How It Works

### Pipeline
```
Image/Video Upload
    ↓
Visual Analysis (BLIP Model)
    ↓
Story Generation (Google Gemini)
    ↓
Text-to-Speech (pyttsx3)
    ↓
Play Audio & Download
```

## Tech Stack & Models

### Backend (FastAPI)

**Models Used:**
- **BLIP (Salesforce/blip-image-captioning-base)** - Image/Video frame analysis
  - Why: Fast, lightweight, free, excellent at understanding visual content
  - For images: Direct caption generation
  - For videos: Analyzes 5 key frames and combines descriptions

- **Google Gemini 2.5 Flash** - Story generation
  - Why: Fast, free tier available, excellent narrative quality, handles complex prompts well
  - Converts descriptions into engaging 50-word stories

- **pyttsx3** - Text-to-speech
  - Why: Offline, instant, no API limits, no file size restrictions
  - Converts stories to MP3 audio files

### Frontend (Next.js + React)

- **Next.js 14** - React framework
- **TypeScript** - Type-safe code
- **Tailwind CSS** - Modern styling
- **Axios** - API communication
- **React Hot Toast** - Notifications

## Project Structure

```
production/
├── backend/
│   ├── main.py                          # FastAPI server entry point
│   ├── requirements.txt                 # Python dependencies
│   ├── .env.template                    # Environment variables template
│   ├── .env                             # Your API keys (git ignored)
│   │
│   ├── core/
│   │   ├── config.py                    # Configuration (API keys, paths, models)
│   │   └── models.py                    # Pydantic request/response models
│   │
│   ├── services/
│   │   ├── image_service.py             # Image analysis using BLIP
│   │   ├── video_service.py             # Video frame extraction & analysis
│   │   ├── story_service.py             # Story generation using Gemini
│   │   └── audio_service.py             # Text-to-speech using pyttsx3
│   │
│   ├── api/
│   │   └── routes.py                    # REST API endpoints (/api/*)
│   │
│   └── utils/
│       └── helpers.py                   # Utility functions
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx                 # Landing page
│   │   │   ├── app/page.tsx             # Main application page
│   │   │   ├── layout.tsx               # Root layout & theme provider
│   │   │   └── globals.css              # Global styles & CSS variables
│   │   │
│   │   ├── components/
│   │   │   ├── Navbar.tsx               # Navigation bar
│   │   │   ├── Landing.tsx              # Landing page hero section
│   │   │   ├── Hero.tsx                 # App page hero section
│   │   │   ├── UploadZone.tsx           # Drag-and-drop file upload
│   │   │   ├── SampleGrid.tsx           # Sample images/videos grid
│   │   │   ├── Results.tsx              # Results display (description, story, audio)
│   │   │   ├── AudioPlayer.tsx          # Minimal audio player control
│   │   │   ├── LoadingSpinner.tsx       # Loading animation
│   │   │   └── ThemeProvider.tsx        # Dark/light theme manager
│   │   │
│   │   ├── hooks/
│   │   │   └── useApi.ts                # Custom hook for API calls & state management
│   │   │
│   │   ├── utils/
│   │   │   └── api.ts                   # Axios API client with endpoints
│   │   │
│   │   └── types/
│   │       └── index.ts                 # TypeScript interfaces & types
│   │
│   ├── package.json                     # NPM dependencies
│   ├── next.config.js                   # Next.js configuration
│   ├── tsconfig.json                    # TypeScript configuration
│   ├── tailwind.config.ts               # Tailwind CSS configuration
│   ├── postcss.config.js                # PostCSS configuration
│   └── .env.local.example               # Environment variables template
│
├── data/                                # Sample images and videos
│   ├── happy_family.jpg
│   ├── nature_landscape.jpg
│   ├── sunset_beach.jpg
│   ├── Galaxy_video.mp4
│   └── Spinner_Video.mp4
│
└── SETUP.md                             # Quick setup instructions
```

## API Endpoints

### Image Analysis
```
POST /api/analyze/image
- Upload an image (JPG, PNG)
- Returns: description, story, audio_url, processing_time
```

### Video Analysis
```
POST /api/analyze/video
- Upload a video (MP4, WebM)
- Returns: description (combined from 5 frames), story, audio_url, processing_time
```

### Audio Streaming
```
GET /api/audio/{filename}
- Stream generated MP3 audio files
```

### Sample Files
```
GET /api/samples
- List available sample images/videos

GET /api/samples/{filename}
- Download a sample file
```

## Why These Models?

| Model | Why | Alternative | Trade-off |
|-------|-----|-------------|-----------|
| **BLIP** | Fast, free, accurate | Llava | Llava is slower, heavier |
| **Gemini 2.5 Flash** | Fast, free tier, good quality | GPT-4, Claude | Ollama/local = slower, less capable |
| **pyttsx3** | Offline, instant, no limits | Google TTS, Azure TTS | Online APIs = cost, latency |

## Key Features

✅ **Free to Use** - No API costs (pyttsx3 is free, Gemini has free tier)
✅ **Fast Processing** - Average 5-10 seconds per file
✅ **Offline Audio** - pyttsx3 requires no internet after model download
✅ **Beautiful UI** - Glassmorphism design with animations
✅ **Dark Theme** - Eye-friendly dark mode by default
✅ **Sample Files** - Quick testing with pre-loaded samples
✅ **Responsive** - Works on mobile, tablet, desktop

## Getting Started

See `SETUP.md` for installation instructions.

## Performance

- **Image Processing**: ~3-5 seconds
- **Video Processing**: ~5-8 seconds (5 frames analyzed)
- **Audio Generation**: ~2-3 seconds
- **Total Time**: ~10-15 seconds average

## Known Limitations

- Video analysis uses 5 frames (configurable in `backend/core/config.py`)
- Gemini free tier has rate limits (~2-3 requests per minute)
- pyttsx3 voice is system-default (no voice selection currently)

## License

Open source - use freely for personal/commercial projects
