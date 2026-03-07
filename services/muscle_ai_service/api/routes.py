"""
Muscle AI Service - API Routes
Handles exercise form analysis and video processing endpoints
"""

from flask import Blueprint, render_template, request, url_for, Response, jsonify
import os
import logging
from datetime import datetime
from pathlib import Path

# Import service core modules
try:
    from ..core.analysis import analyze_saved_video
    from ..core.models.yolo import get_yolo_models
except ImportError:
    analyze_saved_video = None
    get_yolo_models = None

logger = logging.getLogger(__name__)

# Create blueprint - templates loaded from app's template_folder + 'muscle-ai/'
muscle_ai_bp = Blueprint(
    'muscle',
    __name__,
    url_prefix='/muscle'
)

SUPPORTED_EXERCISES = [
    'regular_deadlift',
    'sumo_deadlift',
    'squat',
    'romanian_deadlift',
    'zercher_squat',
    'front_squat'
]

VIDEO_FOLDER = Path('data/uploads/videos')
PROCESSED_FOLDER = Path('data/processed/videos')
WEB_FOLDER = Path('web/static/videos')

for folder in [VIDEO_FOLDER, PROCESSED_FOLDER, WEB_FOLDER]:
    folder.mkdir(parents=True, exist_ok=True)

models = None

def init_models():
    """Initialize YOLO models"""
    global models
    if models is None:
        try:
            if get_yolo_models is None:
                raise RuntimeError("YOLO loader not available")
            models = get_yolo_models()
            logger.info("YOLO models loaded successfully")
        except Exception as e:
            logger.error(f"Failed to load YOLO models: {e}")
            models = {}


def _save_upload(file_storage) -> Path:
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    base_filename = os.path.splitext(file_storage.filename)[0]
    filename = f"{timestamp}_{base_filename}.mp4"
    video_path = VIDEO_FOLDER / filename
    file_storage.save(str(video_path))
    logger.info(f"Saved video: {video_path}")
    return video_path


def _validate_upload_request():
    if 'video' not in request.files:
        return 'No video file uploaded'

    file = request.files['video']
    if file.filename == '':
        return 'No selected file'

    if not file.filename.lower().endswith(('.mp4', '.avi', '.mov')):
        return 'Invalid file type. Please upload MP4, AVI, or MOV files'

    exercise_type = request.form.get('exercise_type')
    if exercise_type not in SUPPORTED_EXERCISES:
        return 'Invalid exercise type'

    return None


@muscle_ai_bp.route('/')
@muscle_ai_bp.route('/index')
def index():
    """Muscle AI landing page"""
    init_models()
    return render_template(
        'muscle-ai/index.html',
        gateway_url=os.environ.get('GATEWAY_URL', 'http://127.0.0.1:5000').rstrip('/'),
        supported_exercises=SUPPORTED_EXERCISES
    )


@muscle_ai_bp.route('/upload', methods=['POST'])
def upload():
    """Handle video upload and processing"""
    init_models()
    gateway_url = os.environ.get('GATEWAY_URL', 'http://127.0.0.1:5000').rstrip('/')
    error_message = _validate_upload_request()
    if error_message:
        return render_template(
            'muscle-ai/index.html',
            message=error_message,
            gateway_url=gateway_url,
            supported_exercises=SUPPORTED_EXERCISES
        )

    file = request.files['video']
    exercise_type = request.form.get('exercise_type')

    try:
        if not models or exercise_type not in models or analyze_saved_video is None:
            return render_template(
                'muscle-ai/index.html',
                message=f'Model for {exercise_type} not available',
                gateway_url=gateway_url,
                supported_exercises=SUPPORTED_EXERCISES
            )

        video_path = _save_upload(file)
        result = analyze_saved_video(video_path, exercise_type)
        if video_path.exists():
            video_path.unlink()

        return render_template(
            'muscle-ai/index.html',
            video_url=result.get('video_url'),
            movement_analysis={
                'score': result['form_score'],
                'metrics': result,
            },
            gateway_url=gateway_url,
            supported_exercises=SUPPORTED_EXERCISES
        )
    except Exception as e:
        logger.error(f"Error processing upload: {e}", exc_info=True)
        return render_template(
            'muscle-ai/index.html',
            message=f'Error processing video: {str(e)}',
            gateway_url=gateway_url,
            supported_exercises=SUPPORTED_EXERCISES
        )


@muscle_ai_bp.route('/api/analyze', methods=['POST'])
def api_analyze():
    """Handle JSON-based upload and analysis for gateway consumers."""
    init_models()
    error_message = _validate_upload_request()
    if error_message:
        return jsonify({'error': error_message}), 400

    file = request.files['video']
    exercise_type = request.form.get('exercise_type')

    try:
        if not models or exercise_type not in models or analyze_saved_video is None:
            return jsonify({'error': f'Model for {exercise_type} not available'}), 503

        video_path = _save_upload(file)
        result = analyze_saved_video(video_path, exercise_type)
        if video_path.exists():
            video_path.unlink()
        return jsonify(result), 200
    except Exception as e:
        logger.error(f"Error processing API upload: {e}", exc_info=True)
        return jsonify({'error': f'Error processing video: {str(e)}'}), 500


@muscle_ai_bp.route('/api/exercises', methods=['GET'])
def api_exercises():
    """Get list of supported exercises"""
    return jsonify({'exercises': SUPPORTED_EXERCISES}), 200


@muscle_ai_bp.route('/api/health', methods=['GET'])
def api_health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'muscle-ai-service',
        'version': '2.0.0',
        'models_loaded': models is not None and len(models) > 0
    }), 200


init_models()
