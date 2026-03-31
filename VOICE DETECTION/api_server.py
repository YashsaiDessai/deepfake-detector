from __future__ import annotations

import json
import os
import tempfile
from pathlib import Path
from typing import Dict, Optional

import joblib
from fastapi import FastAPI, File, HTTPException, UploadFile

from audio_model import extract_features

app = FastAPI(title="Voice Detection API")

ARTIFACTS_DIR = Path(os.getenv("ARTIFACTS_DIR", "artifacts"))
MODEL_PATH = ARTIFACTS_DIR / "voice_model.joblib"
LABEL_MAP_PATH = ARTIFACTS_DIR / "label_map.json"

_model: Optional[object] = None
_labels: Optional[list[str]] = None


def _load_artifacts() -> None:
    global _model, _labels

    if not MODEL_PATH.exists() or not LABEL_MAP_PATH.exists():
        raise FileNotFoundError(
            f"Artifacts not found in {ARTIFACTS_DIR}. Run training first."
        )

    _model = joblib.load(MODEL_PATH)
    with LABEL_MAP_PATH.open("r", encoding="utf-8") as f:
        _labels = json.load(f)["labels"]


@app.get("/health")
def health() -> Dict[str, str]:
    return {"status": "ok", "artifacts_dir": str(ARTIFACTS_DIR)}


@app.post("/predict")
async def predict(file: UploadFile = File(...)) -> Dict:
    if _model is None or _labels is None:
        try:
            _load_artifacts()
        except Exception as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from exc

    suffix = Path(file.filename or "audio").suffix
    if not suffix:
        suffix = ".wav"

    try:
        content = await file.read()
        if not content:
            raise HTTPException(status_code=400, detail="Uploaded file is empty.")

        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            tmp.write(content)
            tmp_path = Path(tmp.name)

        feats = extract_features(tmp_path).reshape(1, -1)

        pred_idx = int(_model.predict(feats)[0])  # type: ignore[union-attr]
        predicted_class = _labels[pred_idx]

        confidence: Dict[str, float] = {}
        if hasattr(_model, "predict_proba"):
            probs = _model.predict_proba(feats)[0]  # type: ignore[union-attr]
            confidence = {str(_labels[i]): float(probs[i]) for i in range(len(_labels))}

        return {
            "predicted_class": predicted_class,
            "confidence": confidence,
        }
    finally:
        # Best-effort cleanup for temp file.
        try:
            if "tmp_path" in locals() and tmp_path.exists():
                tmp_path.unlink()
        except Exception:
            pass

