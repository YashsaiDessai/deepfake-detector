# Voice Detection / Audio Classification

This project trains a voice/audio classification model from your dataset and predicts class for one uploaded audio file.

## What this gives you

- Train on a dataset with class folders (for example emotion/speaker/command labels)
- Evaluate on a test split
- Generate analysis report files automatically:
  - `classification_report.json`
  - `classification_report.json` also includes `confidence_stats` (from test split)
  - `confusion_matrix.png`
  - `feature_importance.png`
- Predict class for a single uploaded audio file (CLI)
- Predict class + confidence via Postman (HTTP API)

## 1) Install dependencies

```bash
py -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

## 2) Dataset format (important)

Keep your dataset in class-wise folder structure:

```text
dataset_root/
  class_1/
    file1.wav
    file2.wav
  class_2/
    file3.wav
```

Supported audio formats: wav, mp3, flac, ogg, m4a, aac

## 3) Train model

### Option A: Local dataset path

```bash
python audio_model.py train --dataset_path "path_to_dataset_root" --output_dir artifacts
```

### Option B: Kaggle dataset slug

```bash
python audio_model.py train --kaggle_dataset "owner/dataset-name" --download_dir data --output_dir artifacts
```

For Kaggle mode, you need:

- `pip install kaggle`
- Kaggle API key configured (`kaggle.json`)

## 4) Predict one uploaded audio file

```bash
python audio_model.py predict --audio_file "path_to_uploaded_audio.wav" --artifacts_dir artifacts
```

## 5) Generated files

After training, check:

- `artifacts/voice_model.joblib` - trained model
- `artifacts/label_map.json` - class names
- `artifacts/classification_report.json` - precision/recall/f1 + accuracy
- `artifacts/confusion_matrix.png` - model confusion matrix
- `artifacts/feature_importance.png` - top model features
- `artifacts/classification_report.json` - includes precision/recall/f1/accuracy + `confidence_stats`

## 6) Postman / API (predict with confidence)

### Start the server

Run this from your project folder (`voice detection`):

```powershell
$env:ARTIFACTS_DIR="artifacts"
py -m uvicorn api_server:app --reload --port 8000
```

### Call `/predict`

- Method: `POST`
- URL: `http://localhost:8000/predict`
- Body: `form-data`
  - key: `file`
  - type: `File`
  - value: select your audio file (`.wav`, `.mp3`, etc.)

### Response

You will get JSON like:

```json
{
  "predicted_class": "Real",
  "confidence": {
    "Real": 0.92,
    "Synthesized": 0.08
  }
}
```

## 7) (Optional) Use pretrained weights from Google Drive

If you have a model file on Google Drive (for example `fake_real_google.pt`), download it into `artifacts/` before inference.

1. Upload to Google Drive and set share link to “Anyone with link can view”.
2. Extract the file ID from the link (between `id=` and `&` in `[https://drive.google.com/file/d/<id>/view](https://drive.google.com/file/d/1KRbvQJq8hyNYIhVlg6YxFvnUTLmvreyp/view?usp=sharing)`).
3. Download locally:

```bash
pip install gdown
cd "c:\Users\ameyk\OneDrive\Desktop\bits dashboard\deepfake-detector\VOICE DETECTION"
gdown "[https://drive.google.com/uc?id=<FILE_ID>](https://drive.google.com/file/d/1KRbvQJq8hyNYIhVlg6YxFvnUTLmvreyp/view?usp=sharing)" -O artifacts/fake_real_google.pt
```

4. Validate file exists:

```bash
python -c "import os; print(os.path.exists('artifacts/fake_real_google.pt'))"
```

5. Point model loader in `audio_model.py` or `api_server.py` to the downloaded path:

```python
model_path = 'artifacts/fake_real_google.pt'
# if using PyTorch:
# model.load_state_dict(torch.load(model_path, map_location='cpu'))
```

6. Run prediction or API server as normal.

> Note: if your file is named `fake_real_googjle.pt` due to typo, rename it to `fake_real_google.pt` to match scripts.

## Notes

- Model currently uses `RandomForestClassifier` with engineered audio features (MFCC, mel, chroma, spectral stats).
- For best accuracy, use balanced datasets and similar audio quality across classes.
- If you share your Kaggle dataset slug, I can help you tune this for better performance.
