r"""
Inspect FitLife workout checkpoints and optionally run a fresh validation set.

Usage:
    G:\fitlife\.venv\Scripts\python.exe scripts\evaluate_muscle_models.py
    G:\fitlife\.venv\Scripts\python.exe scripts\evaluate_muscle_models.py --data path\to\config.yaml
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

from ultralytics import YOLO


DEFAULT_MODEL_DIR = Path('model/models')


def _to_float(value: Any) -> float | None:
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


def _format_embedded_metrics(train_metrics: dict[str, Any]) -> dict[str, float]:
    keys = [
        'metrics/precision(P)',
        'metrics/recall(P)',
        'metrics/mAP50(P)',
        'metrics/mAP50-95(P)',
    ]
    formatted: dict[str, float] = {}
    for key in keys:
        value = _to_float(train_metrics.get(key))
        if value is not None:
            formatted[key] = value
    return formatted


def _extract_validation_metrics(validation: Any) -> dict[str, float]:
    results_dict = getattr(validation, 'results_dict', None)
    if isinstance(results_dict, dict):
        extracted = {k: v for k, v in ((_k, _to_float(_v)) for _k, _v in results_dict.items()) if v is not None}
        if extracted:
            return extracted

    extracted: dict[str, float] = {}
    for namespace_name, prefix in [('box', 'box'), ('pose', 'pose')]:
        namespace = getattr(validation, namespace_name, None)
        if namespace is None:
            continue
        for attr in ['mp', 'mr', 'map50', 'map']:
            value = _to_float(getattr(namespace, attr, None))
            if value is not None:
                extracted[f'{prefix}.{attr}'] = value
    return extracted


def _print_summary(summary: list[dict[str, Any]]) -> None:
    print('\nCheckpoint metrics')
    print('-' * 80)
    for item in summary:
        embedded = item.get('embedded_metrics', {})
        print(
            f"{item['model']}: "
            f"precision={embedded.get('metrics/precision(P)', 0):.4f}, "
            f"recall={embedded.get('metrics/recall(P)', 0):.4f}, "
            f"mAP50={embedded.get('metrics/mAP50(P)', 0):.4f}, "
            f"mAP50-95={embedded.get('metrics/mAP50-95(P)', 0):.4f}"
        )

    if not summary:
        return

    averages = {}
    for key in [
        'metrics/precision(P)',
        'metrics/recall(P)',
        'metrics/mAP50(P)',
        'metrics/mAP50-95(P)',
    ]:
        values = [item['embedded_metrics'][key] for item in summary if key in item['embedded_metrics']]
        if values:
            averages[key] = sum(values) / len(values)

    if averages:
        print('-' * 80)
        print(
            'AVERAGE: '
            + ', '.join(f"{key}={value:.4f}" for key, value in averages.items())
        )


def main() -> int:
    parser = argparse.ArgumentParser(description='Evaluate FitLife workout checkpoints')
    parser.add_argument('--model-dir', default=str(DEFAULT_MODEL_DIR), help='Directory containing .pt files')
    parser.add_argument('--data', help='Optional Ultralytics dataset YAML for fresh validation')
    parser.add_argument('--split', default='val', help='Dataset split to validate against')
    parser.add_argument('--device', default='cpu', help='Validation device, e.g. cpu or 0')
    parser.add_argument('--imgsz', type=int, help='Optional override for image size')
    parser.add_argument('--json', action='store_true', help='Print the summary as JSON')
    args = parser.parse_args()

    model_dir = Path(args.model_dir)
    if not model_dir.exists():
        raise SystemExit(f'Model directory not found: {model_dir}')

    summary: list[dict[str, Any]] = []

    for path in sorted(model_dir.glob('*.pt')):
        model = YOLO(str(path))
        ckpt = getattr(model, 'ckpt', {}) or {}
        train_args = ckpt.get('train_args', {}) if isinstance(ckpt, dict) else {}
        embedded_metrics = _format_embedded_metrics(ckpt.get('train_metrics', {}) if isinstance(ckpt, dict) else {})

        item: dict[str, Any] = {
            'model': path.name,
            'task': model.task,
            'labels': model.names,
            'train_args': {
                'data': train_args.get('data'),
                'imgsz': train_args.get('imgsz'),
                'epochs': train_args.get('epochs'),
                'batch': train_args.get('batch'),
                'model': train_args.get('model'),
            },
            'embedded_metrics': embedded_metrics,
        }

        if args.data:
            validation = model.val(
                data=args.data,
                split=args.split,
                imgsz=args.imgsz or train_args.get('imgsz', 640),
                device=args.device,
                verbose=False,
            )
            item['fresh_validation'] = _extract_validation_metrics(validation)

        summary.append(item)

    if args.json:
        print(json.dumps(summary, indent=2))
    else:
        _print_summary(summary)
        if args.data:
            print('\nFresh validation metrics')
            print('-' * 80)
            for item in summary:
                print(f"{item['model']}: {item.get('fresh_validation', {})}")

    return 0


if __name__ == '__main__':
    raise SystemExit(main())
