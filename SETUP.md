# StoryWeaver - Setup & Run

## Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
# or: source venv/bin/activate  # Mac/Linux

pip install -r requirements.txt
copy .env.template .env
# Edit .env and add your GEMINI_API_KEY
python main.py
```

Backend runs on: **http://localhost:8000**

## Frontend Setup

```bash
cd frontend
npm install
copy .env.local.example .env.local
npm run dev
```

Frontend runs on: **http://localhost:3000**

## That's it!

Open browser to http://localhost:3000 and start creating stories.
