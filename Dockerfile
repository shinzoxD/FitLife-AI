FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    FITLIFE_RUNTIME=huggingface \
    PORT=7860

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends ffmpeg libgl1 libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements-space.txt ./

RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements-space.txt

COPY gateway ./gateway
COPY services ./services
COPY data/nutri-ai ./data/nutri-ai
COPY model/models ./model/models

EXPOSE 7860

CMD ["python", "gateway/app.py"]
