FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8000

WORKDIR /app

COPY requirements-render.txt ./

RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements-render.txt

COPY gateway ./gateway
COPY services ./services
COPY web ./web
COPY data/nutri-ai ./data/nutri-ai

EXPOSE 8000

CMD ["sh", "-c", "gunicorn gateway.app:app --bind 0.0.0.0:${PORT:-8000} --workers 1 --timeout 120"]
