# Realio Flutter App

A premium AI Deepfake & Voice Detection Platform built with Flutter.

## Features
- **UI/UX Excellence**: Beautiful purple-light purple gradient with gold accents and a glassmorphic aesthetic.
- **Authentication**: Secure Login and Signup pages. The signup page features robust password validation (min 8 characters, uppercase, lowercase, numbers, and special characters).
- **Interactive Dashboard**: A tabbed dashboard featuring dedicated screens for:
  - Video & Photos Deepfake Detection
  - Voice Cloning Detection

## How to Run

1. **Install Flutter**: Make sure you have the [Flutter SDK](https://docs.flutter.dev/get-started/install) installed on your system.
2. **Navigate to Project Directory**: Open your terminal and change the directory to this project folder:
   ```bash
   cd path/to/realio
   ```
3. **Install Dependencies**: Fetch required flutter packages:
   ```bash
   flutter pub get
   ```
4. **Run the App**: Launch the app on an emulator or a connected device (e.g., Chrome for web, Android/iOS emulator, or Windows desktop):
   ```bash
   flutter run
   ```

Enjoy the Realio application!

---

# Deepfake & Voice Detection UI (Legacy/Web Version)

A web-based interface for detecting AI-generated deepfake media and synthetic voices.
This project provides a simple and interactive dashboard where users can upload images, videos, or audio files and analyze them for possible manipulation using AI models.

## Features

* Drag and drop media upload
* Supports **image, video, and audio files**
* Media preview before analysis
* AI-based deepfake detection result display
* Real vs Fake **confidence probability meter**
* Clean modern UI built with Tailwind CSS
* React-based component architecture

## Tech Stack

Frontend:

* React
* Tailwind CSS
* Vite

Backend (planned):

* Python
* FastAPI
* Deepfake detection models (PyTorch / TensorFlow)

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
