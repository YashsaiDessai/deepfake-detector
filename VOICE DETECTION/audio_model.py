from __future__ import annotations

import argparse
import json
import subprocess
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable, List, Optional, Tuple

import joblib
import librosa
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from tqdm import tqdm

AUDIO_EXTENSIONS = {".wav", ".mp3", ".flac", ".ogg", ".m4a", ".aac"}


@dataclass
class ModelArtifacts:
    model_path: Path
    label_map_path: Path
    report_json_path: Path
    confusion_matrix_path: Path
    feature_importance_path: Path


def maybe_download_kaggle_dataset(dataset_name: str, output_dir: Path) -> None:
    """
    Download and unzip a Kaggle dataset if a slug was provided.
    Example slug: "uwrfkaggler/ravdess-emotional-speech-audio"
    """
    output_dir.mkdir(parents=True, exist_ok=True)
    cmd = [
        "kaggle",
        "datasets",
        "download",
        "-d",
        dataset_name,
        "-p",
        str(output_dir),
        "--unzip",
    ]
    print(f"[INFO] Downloading Kaggle dataset: {dataset_name}")
    try:
        subprocess.run(cmd, check=True)
    except FileNotFoundError as exc:
        raise RuntimeError(
            "Kaggle CLI not found. Install it via `pip install kaggle` and configure API key."
        ) from exc
    except subprocess.CalledProcessError as exc:
        raise RuntimeError(
            "Kaggle download failed. Check dataset slug and Kaggle API credentials."
        ) from exc


def extract_features(audio_path: Path, target_sr: int = 22050) -> np.ndarray:
    y, sr = librosa.load(audio_path, sr=target_sr, mono=True)
    if y.size == 0:
        raise ValueError(f"Empty audio file: {audio_path}")

    # Core spectral and temporal features
    zcr = librosa.feature.zero_crossing_rate(y)[0]
    rmse = librosa.feature.rms(y=y)[0]
    spec_centroid = librosa.feature.spectral_centroid(y=y, sr=sr)[0]
    spec_bandwidth = librosa.feature.spectral_bandwidth(y=y, sr=sr)[0]
    spec_rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr)[0]

    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=20)
    chroma = librosa.feature.chroma_stft(y=y, sr=sr)
    mel = librosa.feature.melspectrogram(y=y, sr=sr, n_mels=40)

    feature_vector = np.concatenate(
        [
            [np.mean(zcr), np.std(zcr)],
            [np.mean(rmse), np.std(rmse)],
            [np.mean(spec_centroid), np.std(spec_centroid)],
            [np.mean(spec_bandwidth), np.std(spec_bandwidth)],
            [np.mean(spec_rolloff), np.std(spec_rolloff)],
            np.mean(mfcc, axis=1),
            np.std(mfcc, axis=1),
            np.mean(chroma, axis=1),
            np.std(chroma, axis=1),
            np.mean(mel, axis=1),
            np.std(mel, axis=1),
        ]
    )
    return feature_vector


def collect_dataset(audio_root: Path) -> Tuple[np.ndarray, np.ndarray, List[str]]:
    """
    Expects class-wise folders:
    audio_root/
        class_a/*.wav
        class_b/*.wav
    """
    if not audio_root.exists():
        raise FileNotFoundError(f"Dataset path not found: {audio_root}")

    class_dirs = sorted([p for p in audio_root.iterdir() if p.is_dir()])
    if not class_dirs:
        raise ValueError(
            "No class folders found. Organize dataset as root/<class_name>/*.wav"
        )

    x_data: List[np.ndarray] = []
    y_data: List[int] = []
    labels = [p.name for p in class_dirs]

    for class_idx, class_dir in enumerate(class_dirs):
        files = [
            p
            for p in class_dir.rglob("*")
            if p.is_file() and p.suffix.lower() in AUDIO_EXTENSIONS
        ]
        if not files:
            print(f"[WARN] No audio files found for class '{class_dir.name}'")
            continue

        print(f"[INFO] Reading class '{class_dir.name}' ({len(files)} files)")
        for file_path in tqdm(files, desc=f"Extracting {class_dir.name}"):
            try:
                feats = extract_features(file_path)
                x_data.append(feats)
                y_data.append(class_idx)
            except Exception as err:
                print(f"[WARN] Skipping {file_path}: {err}")

    if not x_data:
        raise ValueError("No valid audio files processed from dataset.")

    return np.vstack(x_data), np.array(y_data), labels


def build_model(random_state: int = 42) -> Pipeline:
    clf = RandomForestClassifier(
        n_estimators=400,
        max_depth=None,
        min_samples_split=2,
        min_samples_leaf=1,
        n_jobs=-1,
        random_state=random_state,
        class_weight="balanced_subsample",
    )
    return Pipeline(
        [
            ("scaler", StandardScaler()),
            ("classifier", clf),
        ]
    )


def save_report(
    y_true: np.ndarray,
    y_pred: np.ndarray,
    labels: List[str],
    model: Pipeline,
    report_dir: Path,
    confidence_stats: Optional[dict] = None,
) -> ModelArtifacts:
    report_dir.mkdir(parents=True, exist_ok=True)

    report = classification_report(
        y_true,
        y_pred,
        target_names=labels,
        output_dict=True,
        zero_division=0,
    )
    report["accuracy"] = accuracy_score(y_true, y_pred)
    if confidence_stats is not None:
        report["confidence_stats"] = confidence_stats

    report_json_path = report_dir / "classification_report.json"
    with report_json_path.open("w", encoding="utf-8") as f:
        json.dump(report, f, indent=2)

    cm = confusion_matrix(y_true, y_pred)
    plt.figure(figsize=(8, 6))
    sns.heatmap(
        cm,
        annot=True,
        fmt="d",
        cmap="Blues",
        xticklabels=labels,
        yticklabels=labels,
    )
    plt.title("Confusion Matrix")
    plt.xlabel("Predicted")
    plt.ylabel("Actual")
    confusion_matrix_path = report_dir / "confusion_matrix.png"
    plt.tight_layout()
    plt.savefig(confusion_matrix_path, dpi=140)
    plt.close()

    rf: RandomForestClassifier = model.named_steps["classifier"]
    importances = rf.feature_importances_
    top_indices = np.argsort(importances)[::-1][:20]
    plt.figure(figsize=(10, 5))
    sns.barplot(x=np.arange(len(top_indices)), y=importances[top_indices], color="steelblue")
    plt.title("Top 20 Feature Importances")
    plt.xlabel("Feature Index")
    plt.ylabel("Importance")
    feature_importance_path = report_dir / "feature_importance.png"
    plt.tight_layout()
    plt.savefig(feature_importance_path, dpi=140)
    plt.close()

    artifacts = ModelArtifacts(
        model_path=report_dir / "voice_model.joblib",
        label_map_path=report_dir / "label_map.json",
        report_json_path=report_json_path,
        confusion_matrix_path=confusion_matrix_path,
        feature_importance_path=feature_importance_path,
    )
    return artifacts


def train(
    dataset_path: Path,
    output_dir: Path,
    test_size: float = 0.2,
    random_state: int = 42,
) -> ModelArtifacts:
    x_data, y_data, labels = collect_dataset(dataset_path)

    x_train, x_test, y_train, y_test = train_test_split(
        x_data,
        y_data,
        test_size=test_size,
        random_state=random_state,
        stratify=y_data if len(np.unique(y_data)) > 1 else None,
    )

    model = build_model(random_state=random_state)
    print("[INFO] Training model ...")
    model.fit(x_train, y_train)

    y_pred = model.predict(x_test)
    confidence_stats: Optional[dict] = None
    if hasattr(model.named_steps["classifier"], "predict_proba"):
        probs = model.predict_proba(x_test)
        max_conf = probs.max(axis=1)
        correct_mask = y_pred == y_test

        # Simple confidence summary for the test split.
        confidence_stats = {
            "n_test_samples": int(len(y_test)),
            "mean_max_confidence": float(np.mean(max_conf)),
            "max_confidence_percentiles": {
                "p10": float(np.percentile(max_conf, 10)),
                "p50": float(np.percentile(max_conf, 50)),
                "p90": float(np.percentile(max_conf, 90)),
            },
            "mean_max_confidence_correct": float(np.mean(max_conf[correct_mask]))
            if np.any(correct_mask)
            else None,
            "mean_max_confidence_incorrect": float(np.mean(max_conf[~correct_mask]))
            if np.any(~correct_mask)
            else None,
            "mean_max_confidence_per_predicted_class": {},
        }

        for idx, label in enumerate(labels):
            mask = y_pred == idx
            if np.any(mask):
                confidence_stats["mean_max_confidence_per_predicted_class"][label] = float(
                    np.mean(max_conf[mask])
                )

    artifacts = save_report(
        y_test,
        y_pred,
        labels,
        model,
        output_dir,
        confidence_stats=confidence_stats,
    )

    print("[INFO] Saving model artifacts ...")
    joblib.dump(model, artifacts.model_path)
    with artifacts.label_map_path.open("w", encoding="utf-8") as f:
        json.dump({"labels": labels}, f, indent=2)

    print(f"[INFO] Accuracy: {accuracy_score(y_test, y_pred):.4f}")
    print(f"[INFO] Model saved at: {artifacts.model_path}")
    print(f"[INFO] Report saved at: {artifacts.report_json_path}")
    return artifacts


def predict(audio_file: Path, artifacts_dir: Path) -> Tuple[str, dict]:
    model_path = artifacts_dir / "voice_model.joblib"
    label_map_path = artifacts_dir / "label_map.json"

    if not model_path.exists() or not label_map_path.exists():
        raise FileNotFoundError(
            f"Model artifacts not found in: {artifacts_dir}. Please run training first."
        )

    model: Pipeline = joblib.load(model_path)
    with label_map_path.open("r", encoding="utf-8") as f:
        labels = json.load(f)["labels"]

    feats = extract_features(audio_file).reshape(1, -1)
    pred_idx = int(model.predict(feats)[0])
    pred_label = labels[pred_idx]

    if hasattr(model.named_steps["classifier"], "predict_proba"):
        probs = model.predict_proba(feats)[0]
        confidence_map = {labels[i]: float(probs[i]) for i in range(len(labels))}
    else:
        confidence_map = {}

    return pred_label, confidence_map


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Train and run voice/audio classification on a folder-based dataset."
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    train_parser = subparsers.add_parser("train", help="Train model and generate reports")
    train_parser.add_argument(
        "--dataset_path",
        type=Path,
        default=None,
        help="Path to extracted dataset root with class-wise subfolders",
    )
    train_parser.add_argument(
        "--kaggle_dataset",
        type=str,
        default=None,
        help="Kaggle dataset slug. If provided, dataset will be downloaded automatically.",
    )
    train_parser.add_argument(
        "--download_dir",
        type=Path,
        default=Path("data"),
        help="Directory to store downloaded Kaggle dataset",
    )
    train_parser.add_argument(
        "--output_dir",
        type=Path,
        default=Path("artifacts"),
        help="Where to save model and report files",
    )
    train_parser.add_argument("--test_size", type=float, default=0.2)
    train_parser.add_argument("--random_state", type=int, default=42)

    predict_parser = subparsers.add_parser("predict", help="Predict class for one audio file")
    predict_parser.add_argument("--audio_file", type=Path, required=True)
    predict_parser.add_argument(
        "--artifacts_dir",
        type=Path,
        default=Path("artifacts"),
        help="Directory containing saved model artifacts",
    )

    return parser.parse_args()


def main() -> None:
    args = parse_args()

    if args.command == "train":
        dataset_path = args.dataset_path

        if args.kaggle_dataset:
            maybe_download_kaggle_dataset(args.kaggle_dataset, args.download_dir)
            dataset_path = args.download_dir

        if dataset_path is None:
            raise ValueError(
                "Provide --dataset_path OR --kaggle_dataset for training."
            )

        train(
            dataset_path=dataset_path,
            output_dir=args.output_dir,
            test_size=args.test_size,
            random_state=args.random_state,
        )
        return

    if args.command == "predict":
        label, confidence = predict(args.audio_file, args.artifacts_dir)
        print(f"[RESULT] Predicted class: {label}")
        if confidence:
            sorted_conf = dict(
                sorted(confidence.items(), key=lambda x: x[1], reverse=True)
            )
            print("[RESULT] Class probabilities:")
            print(json.dumps(sorted_conf, indent=2))


if __name__ == "__main__":
    main()
