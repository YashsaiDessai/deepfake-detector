from fastapi import FastAPI, UploadFile, File
import shutil
import os

from deepfake_detector import detect_image

app = FastAPI()


@app.get("/")
def home():
    return {"message": "Deepfake Detection API Running"}


@app.post("/detect")
async def detect(file: UploadFile = File(...)):

    # Save uploaded file temporarily
    temp_path = f"temp_{file.filename}"

    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        # Run prediction
        result = detect_image(temp_path)

        return {
            "type": "image",
            "result": result
        }

    finally:
        # Remove temp file
        if os.path.exists(temp_path):
            os.remove(temp_path)