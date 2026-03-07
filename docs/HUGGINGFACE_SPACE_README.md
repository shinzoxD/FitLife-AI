---
title: FitLife AI API
emoji: "🏋️"
colorFrom: blue
colorTo: green
sdk: docker
app_port: 7860
pinned: false
---

# FitLife AI API

This Space runs the Flask backend for FitLife.

Set these Space variables before the first launch:

- `SECRET_KEY`
- `JWT_SECRET_KEY`
- `GROQ_API_KEY`
- `FRONTEND_URL`
- `GOOGLE_CLIENT_ID` (optional)
- `GOOGLE_CLIENT_SECRET` (optional)

The backend serves:

- `/health`
- `/api/v1/health`
- `/api/v1/nutri-ai/*`
- `/api/v1/muscle-ai/*`
- `/api/v1/ana/chat`
