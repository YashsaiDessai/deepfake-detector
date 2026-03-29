# Deepfake & Voice Detection UI

A web-based interface for detecting AI-generated deepfake media and synthetic voices.
This project provides a simple and interactive dashboard where users can upload images, videos, or audio files and analyze them for possible manipulation using AI models.

---

## Features

* Drag and drop media upload
* Supports **image, video, and audio files**
* Media preview before analysis
* AI-based deepfake detection result display
* Real vs Fake **confidence probability meter**
* Clean modern UI built with Tailwind CSS
* React-based component architecture

---

## Tech Stack

Frontend:

* React
* Tailwind CSS
* Vite

Backend (planned):

* Python
* FastAPI
* Deepfake detection models (PyTorch / TensorFlow)

---
## Installation

Clone the repository

```
git clone https://github.com/YashsaiDessai/deepfake-detector
cd deepfake-detector/frontend
```

Install dependencies

```
npm install
```

Run the development server

```
npm run dev
```

Open the app in your browser at

```
http://localhost:5173
```

---

## Future Improvements

* Real deepfake detection model integration
* Voice recording for live analysis
* Audio spectrogram visualization
* Face landmark detection
* Detection history dashboard

---

## Disclaimer

This project is for **educational and research purposes only**.
Detection results shown in the current version are simulated until an actual AI model is integrated.
