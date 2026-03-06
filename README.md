# FitLife - AI Fitness and Nutrition Coach

<div align="center">

**Scan food labels, review workout form, and ask FitLife Coach for meal and recovery guidance.**

[![Python](https://img.shields.io/badge/Python-3.11+-blue)](https://python.org)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org)
[![Flask](https://img.shields.io/badge/Flask-3.0-green)](https://flask.palletsprojects.com)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4.0-38bdf8)](https://tailwindcss.com)

</div>

---

## Overview

FitLife is a resume-ready full-stack wellness product with three demoable surfaces:

- **Fuel Scan** - Photograph any nutrition label and get a fit score, nutrient breakdown, and profile-aware recommendations using OCR + AI scoring.
- **Form Coach** - Upload a workout video and receive movement feedback, rep counting, and coaching cues powered by pose estimation.
- **FitLife Coach** - A RAG-based nutrition assistant for meal ideas, ingredient swaps, and recovery guidance.

The goal of this version is to present the project as a polished portfolio app: stronger branding, clearer product positioning, and frontend flows that feel intentionally designed for walkthroughs and interviews.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, React 19, Tailwind CSS 4, TypeScript |
| Backend API | Flask, SQLAlchemy, PyJWT, Flask-Login |
| AI / ML | YOLOv8, EasyOCR, Groq (Llama 3), RAG retrieval |
| Async Tasks | Celery + Redis |
| Database | SQLite (dev), PostgreSQL-ready |
| Deployment | Vercel (frontend) + Koyeb (backend), Render optional |

---

## Project Structure

```
fitlife/
├── frontend/                # Next.js frontend (port 3000)
│   ├── src/app/             # 20 page routes
│   ├── src/components/      # Reusable UI components
│   ├── src/lib/             # API client, auth context, types
│   └── src/hooks/           # Custom React hooks
│
├── gateway/                 # Flask API Gateway (port 5000)
│   ├── app.py               # Main app with JSON API + legacy routes
│   ├── auth_jwt.py          # JWT authentication
│   ├── celery_app.py        # Async task config
│   └── tasks.py             # Celery tasks
│
├── services/
│   ├── nutri_ai_service/    # Nutrition scanning (port 5001)
│   │   └── core/ana/        # Ana RAG chatbot agent
│   ├── muscle_ai_service/   # Workout analysis (port 5002)
│   └── shared/database/     # SQLAlchemy models
│
├── data/
│   ├── nutri-ai/            # RAG knowledge base (book_chunks, diseases, nutrient_limits)
│   └── ml-models/yolo/      # YOLO model weights (not in repo, see setup)
│
└── web/                     # Legacy Jinja2 templates (kept for compatibility)
```

---

## Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- (Optional) Redis for async Form Coach processing

### 1. Clone and set up

```bash
git clone https://github.com/shinzoxD/FitLife-AI.git
cd FitLife-AI
```

### 2. Backend setup

```bash
python -m venv .venv

# Windows
.\.venv\Scripts\Activate.ps1
# macOS / Linux
source .venv/bin/activate

pip install -r requirements.txt

cp env.example .env
# Edit .env and add your GROQ_API_KEY (free at https://console.groq.com)
```

### 3. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env.local
cd ..
```

Set `NEXT_PUBLIC_API_URL=http://localhost:5000` in `frontend/.env.local` so the Next.js app talks to the Flask gateway during local development.

### 4. Download YOLO models (for Form Coach)

Place the YOLO `.pt` model files in `data/ml-models/yolo/`. These are not included in the repo due to size. Contact the maintainers or train your own models.

### 5. Run

Open two terminals:

```bash
# Terminal 1: Backend (port 5000)
python gateway/app.py

# Terminal 2: Frontend (port 3000)
cd frontend && npm run dev
```

Open **http://localhost:3000** in your browser.

---

## API Endpoints

All API routes are prefixed with `/api/v1/`:

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | - | Create account |
| POST | `/auth/login` | - | Get JWT tokens |
| POST | `/auth/refresh` | - | Refresh access token |
| GET | `/user` | JWT | Get user profile |
| PUT | `/user/settings` | JWT | Update profile |
| GET | `/user/scans` | JWT | Scan history (paginated) |
| GET | `/user/workouts` | JWT | Workout history (paginated) |
| GET | `/dashboard/stats` | JWT | Dashboard statistics |
| POST | `/nutri-ai/upload` | Optional | Upload nutrition label |
| POST | `/nutri-ai/analyze` | Optional | Analyze nutrition data |
| POST | `/muscle-ai/upload` | Optional | Upload workout video |
| GET | `/muscle-ai/task/:id` | - | Poll async task status |
| POST | `/ana/chat` | Optional | Chat with FitLife Coach |

---

## Environment Variables

See `env.example` for all configuration options. The only required variable for basic functionality is:

| Variable | Required | Description |
|---|---|---|
| `GROQ_API_KEY` | For FitLife Coach | Free API key from [console.groq.com](https://console.groq.com) |
| `SECRET_KEY` | Yes | Flask session secret |
| `JWT_SECRET_KEY` | Yes | JWT signing secret |

---

## Deployment

### Free Path: Vercel + Koyeb

This repo is set up for a free split deployment:

- `Vercel` hosts the Next.js frontend from `frontend/`
- `Koyeb` hosts the Flask gateway from the repo root using the included `Dockerfile`

#### 1. Deploy the frontend on Vercel

- Import the GitHub repo into Vercel
- Keep the existing root directory from `vercel.json`:
  - `frontend`
- Set:
  - `NEXT_PUBLIC_API_URL=https://your-koyeb-backend.koyeb.app`

#### 2. Deploy the backend on Koyeb

- Create a new Web Service from the same GitHub repo
- Deploy from the repo root so Koyeb uses the included `Dockerfile`
- Set these environment variables:
  - `SECRET_KEY`
  - `JWT_SECRET_KEY`
  - `GROQ_API_KEY`
  - `FRONTEND_URL=https://your-vercel-app.vercel.app`
  - `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` if you want Google auth

#### 3. Redeploy both once

- After Koyeb gives you the backend URL, update `NEXT_PUBLIC_API_URL` in Vercel
- After Vercel gives you the frontend URL, update `FRONTEND_URL` in Koyeb
- Redeploy both services once so CORS and frontend API calls point to the final domains

Notes:

- The backend container uses `requirements-render.txt` as the lightweight deployment dependency set for the API gateway.
- The default SQLite database is fine for a portfolio deploy, but PostgreSQL is the better production choice.
- If you want async Form Coach jobs in production, add Redis and Celery worker infrastructure.
- `render.yaml` is still included if you prefer Render later.

## Resume Positioning

Use [docs/RESUME_PROJECT.md](docs/RESUME_PROJECT.md) for resume bullets, a portfolio summary, and interview talking points for FitLife.

---

## Acknowledgments

- Harvard Medical School nutrition research (RAG knowledge base)
- Ultralytics YOLOv8 for pose estimation
- Groq for fast LLM inference
- EasyOCR for text extraction

---

## License

This project is licensed under the MIT License.
