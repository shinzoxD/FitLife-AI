"""
Application configuration
"""
import os
from pathlib import Path


def _resolve_model_dir() -> Path:
    candidates = [
        Path(os.path.abspath("./data/ml-models/yolo")),
        Path(os.path.abspath("./model/models")),
        Path(os.path.abspath("./model/muscle_ai/models")),
    ]
    for candidate in candidates:
        if candidate.exists():
            return candidate
    return candidates[0]

class Config:
    """Application configuration settings"""
    # File paths
    VIDEO_FOLDER =  os.path.abspath(os.path.join(os.path.dirname(__file__),'videos'))
    PROCESSED_FOLDER = os.path.abspath(os.path.join(os.path.dirname(__file__),'processed_videos'))
    STATIC_FOLDER = os.path.abspath(os.path.join(os.path.dirname(__file__),'static'))
    
    # File upload settings
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size
    
    # Exercise types
    SUPPORTED_EXERCISES = [
        'regular_deadlift',
        'sumo_deadlift', 
        'squat',
        'romanian_deadlift',
        'zercher_squat',
        'front_squat'
    ]
    
    # Model paths
    # MODEL_PATHS = {
    #     'regular_deadlift': 'models/best.pt',
    #     'sumo_deadlift': 'models/sumo_best.pt',
    #     'squat': 'models/squats_best.pt',
    #     'romanian_deadlift': 'models/best_romanian.pt',
    #     'zercher_squat': 'models/zercher_best.pt',
    #     'front_squat': 'models/front_squats_best.pt'
    # }
    MODEL_DIR = _resolve_model_dir()

    # Model paths
    MODEL_PATHS = {
        'regular_deadlift': str(MODEL_DIR / 'best.pt'),
        'sumo_deadlift': str(MODEL_DIR / 'sumo_best.pt'),
        'squat': str(MODEL_DIR / 'squats_best.pt'),
        'romanian_deadlift': str(MODEL_DIR / 'best_romanian.pt'),
        'zercher_squat': str(MODEL_DIR / 'zercher_best.pt'),
        'front_squat': str(MODEL_DIR / 'front_squats_best.pt'),
    }
