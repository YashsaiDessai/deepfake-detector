import cv2
from PIL import Image


def extract_frames(video_path, frame_skip=30):

    frames = []

    cap = cv2.VideoCapture(video_path)

    frame_count = 0

    while True:

        ret, frame = cap.read()

        if not ret:
            break

        if frame_count % frame_skip == 0:

            frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

            frames.append(Image.fromarray(frame))

        frame_count += 1

    cap.release()

    return frames