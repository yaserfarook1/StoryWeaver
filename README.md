# StoryWeaver - AI Image/Video to Multilingual Story & Audio Converter

## Project Overview

**StoryWeaver** transforms images and videos into captivating stories with AI-generated narration in **4 languages** (English, Tamil, Malayalam, Hindi). Upload an image or video, select your language, and the app will:

1. **Analyze** the visual content with detailed descriptions
2. **Generate** a creative story in your chosen language
3. **Convert** the story to natural-sounding audio in that language
4. **Play** the audio or download it

## Key Features

✨ **Multilingual Support**
- 🇬🇧 English
- 🇮🇳 Tamil
- 🇮🇳 Malayalam
- 🇮🇳 Hindi
- All stories and audio generated in selected language

🎯 **Detailed Image Analysis**
- 2-line simple, factual descriptions
- Uses BLIP for visual understanding + Gemini for enhancement
- For videos: Analyzes 5 key frames and synthesizes descriptions

🎬 **Story Generation**
- Google Gemini creates engaging 50-word stories
- Context-aware, language-specific narratives

🔊 **Multilingual Audio**
- gTTS (Google Text-to-Speech) generates natural-sounding audio
- Supports all 4 languages with native speakers
- High-quality MP3 format with proper duration

🌙 **Beautiful UI**
- Glassmorphism design with animations
- Dark/light theme toggle
- Responsive for mobile, tablet, desktop
- Language selector in navigation bar

## How It Works

### Pipeline
```
Image/Video Upload
    ↓
Select Language (English, Tamil, Malayalam, Hindi)
    ↓
Visual Analysis
  ├─ BLIP Model: Generate initial caption
  └─ Gemini: Enhance to 2-line description
    ↓
Story Generation (Gemini in selected language)
    ↓
Audio Generation (gTTS in selected language)
    ↓
Play Audio & Download
```

## Tech Stack & Models

### Backend (FastAPI + Python 3.13)

**Vision & Language Models:**
- **BLIP (Salesforce/blip-image-captioning-base)** - Image/Video analysis
  - Fast, lightweight (~1GB), free, excellent visual understanding
  - For images: Generates initial caption
  - For videos: Analyzes 5 key frames, combines into coherent description

- **Google Gemini 2.5 Flash** - Story & description enhancement
  - Fast, free tier, multilingual support
  - Enhances BLIP captions to 2-line descriptions
  - Generates 50-word stories in 4 languages

- **gTTS (Google Text-to-Speech)** - Multilingual audio
  - Supports 4 languages: English, Tamil, Malayalam, Hindi
  - Natural-sounding voices with proper prosody
  - MP3 format, high quality

### Frontend (Next.js 14 + React + TypeScript)

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe, robust code
- **Tailwind CSS** - Modern, responsive styling
- **Axios** - Async HTTP client
- **React Hooks** - State management (useState, useEffect, useContext)

## Project Structure

```
StoryWeaver/
├── backend/
│   ├── main.py                          # FastAPI server entry point
│   ├── requirements.txt                 # Python dependencies (fastapi, torch, transformers, gtts, etc.)
│   ├── .env                             # API keys (GEMINI_API_KEY)
│   │
│   ├── core/
│   │   ├── config.py                    # Configuration (API keys, model names, language settings)
│   │   └── models.py                    # Pydantic request/response models
│   │
│   ├── services/
│   │   ├── image_service.py             # BLIP + Gemini for image analysis & enhancement
│   │   ├── video_service.py             # Video frame extraction, BLIP analysis, Gemini synthesis
│   │   ├── story_service.py             # Gemini story generation (multilingual)
│   │   └── audio_service.py             # gTTS multilingual audio generation
│   │
│   ├── api/
│   │   └── routes.py                    # REST API endpoints with language support
│   │
│   └── generated_audio/                 # Output directory for generated MP3 files
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx                 # Landing page (marketing)
│   │   │   ├── app/page.tsx             # Main app page with language selector
│   │   │   ├── layout.tsx               # Root layout, theme provider
│   │   │   └── globals.css              # Global styles, theme CSS variables
│   │   │
│   │   ├── components/
│   │   │   ├── Navbar.tsx               # Navigation + Language Selector Dropdown ⭐ NEW
│   │   │   ├── Hero.tsx                 # App hero section
│   │   │   ├── UploadZone.tsx           # Drag-and-drop file upload
│   │   │   ├── SampleGrid.tsx           # Sample images/videos
│   │   │   ├── Results.tsx              # Display description, story, audio player
│   │   │   ├── AudioPlayer.tsx          # Custom audio player
│   │   │   └── LoadingSpinner.tsx       # Loading state
│   │   │
│   │   ├── hooks/
│   │   │   └── useApi.ts                # API calls with language parameter
│   │   │
│   │   ├── utils/
│   │   │   └── api.ts                   # Axios client, language parameter support ⭐ UPDATED
│   │   │
│   │   └── types/
│   │       └── index.ts                 # TypeScript interfaces
│   │
│   ├── package.json
│   ├── next.config.js
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   └── postcss.config.js
│
├── data/                                # Sample images and videos
│   ├── happy_family.jpg
│   ├── nature_landscape.jpg
│   ├── sunset_beach.jpg
│   ├── Forest_Video.mp4
│   ├── Galaxy_video (1).mp4
│   └── Sunset_video.mp4
│
└── README.md                            # This file
```

**⭐ = Multilingual features added/updated**

## API Endpoints

All endpoints support the **language parameter** (english, tamil, malayalam, hindi):

### Image Analysis
```
POST /api/analyze/image?language=english
Content-Type: multipart/form-data

Request: file (JPG, PNG)
Response: {
  status: "success",
  description: "2-line description",
  story: "50-word story in selected language",
  audio_url: "/api/audio/audio_english_xxxxx.mp3",
  language: "english",
  processing_time: 8.5
}
```

### Video Analysis
```
POST /api/analyze/video?language=tamil
Content-Type: multipart/form-data

Request: file (MP4, WebM)
Response: {
  status: "success",
  description: "Description from 5 frames analysis",
  story: "50-word story in Tamil",
  audio_url: "/api/audio/audio_tamil_xxxxx.mp3",
  language: "tamil",
  processing_time: 12.3
}
```

### Story Generation
```
POST /api/generate/story
Content-Type: application/json

Request: {
  text: "Image description",
  language: "malayalam"
}
Response: {
  status: "success",
  story: "50-word story in Malayalam",
  language: "malayalam",
  processing_time: 3.2
}
```

### Audio Generation
```
POST /api/generate/audio
Content-Type: application/json

Request: {
  text: "Story text",
  language: "hindi"
}
Response: {
  status: "success",
  audio_url: "/api/audio/audio_hindi_xxxxx.mp3",
  language: "hindi",
  processing_time: 2.1
}
```

### Audio Streaming
```
GET /api/audio/{filename}
Response: MP3 audio file (audio/mpeg)
```

### Sample Files
```
GET /api/samples
Response: [
  {
    id: "happy_family_jpg",
    name: "Happy Family",
    filename: "happy_family.jpg",
    type: "image",
    emoji: "🖼️"
  },
  ...
]

GET /api/samples/{filename}
Response: Binary file data
```

## Why These Models?

| Model | Purpose | Why This One | Alternatives | Trade-off |
|-------|---------|-------------|--------------|-----------|
| **BLIP** | Image analysis | Fast, lightweight (1GB), free, accurate | LLaVA, BLIP-2 | LLaVA needs more VRAM, BLIP-2 is 15GB |
| **Gemini 2.5 Flash** | Story & enhancement | Fast, free tier, multilingual, excellent quality | GPT-4, Claude API | Local models slower, less capable |
| **gTTS** | Multilingual audio | Supports 4 languages, natural voices, free | Coqui TTS | Coqui requires Python <3.12 |

## Requirements

### Backend
- Python 3.13
- 8GB RAM minimum (16GB recommended for BLIP model download)
- GEMINI_API_KEY (free tier at https://makersuite.google.com/app/apikey)

### Frontend
- Node.js 18+
- npm or pnpm

### System Dependencies
- ffmpeg (for video processing) - Optional for videos

## Getting Started

### Quick Start (5 minutes)

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/StoryWeaver.git
   cd StoryWeaver
   ```

2. **Backend Setup**
   ```bash
   cd backend

   # Create virtual environment
   python -m venv myenv
   myenv\Scripts\activate  # Windows
   # or: source myenv/bin/activate  # Linux/Mac

   # Install dependencies
   pip install -r requirements.txt

   # Create .env file with your Gemini API key
   # Get free key at: https://makersuite.google.com/app/apikey
   echo GEMINI_API_KEY=your_key_here > .env

   # Start backend (will download BLIP model on first run ~1GB)
   python main.py
   ```
   Backend runs on: http://localhost:8000

3. **Frontend Setup**
   ```bash
   cd ../frontend

   # Install dependencies
   npm install

   # Start development server
   npm run dev
   ```
   Frontend runs on: http://localhost:3000

4. **Open in Browser**
   - Navigate to http://localhost:3000/app
   - Select a language from dropdown (English, Tamil, Malayalam, Hindi)
   - Upload an image or select a sample
   - Wait for story and audio generation
   - Click ▶ to play audio

### Environment Variables

**Backend (.env file)**
```
GEMINI_API_KEY=your_google_api_key_here
```

Get your free Gemini API key: https://makersuite.google.com/app/apikey

## Performance Benchmarks

| Operation | Time | Notes |
|-----------|------|-------|
| Image analysis (description) | 2-3s | BLIP caption + Gemini enhancement |
| Story generation | 2-3s | Gemini API call, ~50 words |
| Audio generation | 1-2s | gTTS API call, depends on text length |
| **Total (image)** | **6-8s** | Per uploaded image |
| **Total (video)** | **10-12s** | 5 frames extracted + analyzed |

First run may take longer due to model downloads:
- BLIP model: ~1GB (one-time download, cached)

## Supported Languages

| Language | Code | TTS Quality | Story Quality | Status |
|----------|------|------------|---------------|--------|
| English | en | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ✅ Full |
| Tamil | ta | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ✅ Full |
| Malayalam | ml | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ✅ Full |
| Hindi | hi | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ✅ Full |

## Known Limitations & Future Improvements

### Current Limitations
- Video analysis uses 5 frames (configurable in `backend/core/config.py`)
- Gemini free tier has rate limits (~2-3 requests per minute)
- gTTS voice is system-default (no voice selection)
- Maximum file size: 50MB

### Future Enhancements
- [ ] Voice selection (male/female voices per language)
- [ ] More languages support (Spanish, French, German, etc.)
- [ ] Video subtitles in selected language
- [ ] Batch processing for multiple files
- [ ] User accounts and history
- [ ] Custom story templates
- [ ] Download as video with subtitles

## Troubleshooting

### Issue: "No API_KEY found"
**Solution:** Create `.env` file in `backend/` folder with:
```
GEMINI_API_KEY=your_key_here
```
Get free key at: https://makersuite.google.com/app/apikey

### Issue: Model download stuck
**Solution:** The BLIP model (~1GB) downloads on first run. Check your internet connection. It's cached after first download.

### Issue: Audio not playing
**Solution:**
- Check browser console for errors (F12)
- Ensure backend is running on port 8000
- Try a different language
- Clear browser cache

### Issue: "Port already in use"
**Solution:**
```bash
# Windows: Find process using port 8000
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Linux/Mac: Kill process on port 8000
lsof -ti:8000 | xargs kill -9
```

## Development

### Adding a New Language

1. **Update config** (`backend/core/config.py`):
   ```python
   SUPPORTED_LANGUAGES = ["english", "tamil", "malayalam", "hindi", "spanish"]
   ```

2. **Update audio service** (`backend/services/audio_service.py`):
   ```python
   LANGUAGE_CODES = {
       ...
       "spanish": "es",
   }
   ```

3. **Update frontend** (`frontend/src/components/Navbar.tsx`):
   ```tsx
   const LANGUAGES = [
       ...
       { code: "spanish", label: "Spanish" },
   ]
   ```

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - feel free to use for personal and commercial projects

## Support

- 📧 Email: support@storyweaver.dev
- 🐛 Issues: https://github.com/yourusername/StoryWeaver/issues
- 💬 Discussions: https://github.com/yourusername/StoryWeaver/discussions

## Credits

Built with ❤️ using:
- BLIP (Salesforce Research)
- Google Gemini & gTTS APIs
- Next.js & React
- FastAPI & Python