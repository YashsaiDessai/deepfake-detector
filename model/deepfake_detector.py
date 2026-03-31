import torch
import torch.nn as nn
from torchvision import transforms
from torchvision.models import resnet18
from PIL import Image
import sys

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

print("Loading model...")

model = resnet18()
model.fc = nn.Linear(model.fc.in_features, 2)

model.load_state_dict(torch.load("weights/trained_model.pth", map_location=device))
model.to(device)
model.eval()

transform = transforms.Compose([
    transforms.Resize((224,224)),
    transforms.ToTensor(),
    transforms.Normalize(
        [0.485,0.456,0.406],
        [0.229,0.224,0.225]
    )
])


def detect_image(image_path):

    image = Image.open(image_path).convert("RGB")
    image = transform(image).unsqueeze(0).to(device)

    with torch.no_grad():
        outputs = model(image)
        probs = torch.nn.functional.softmax(outputs, dim=1)

    confidence, predicted = torch.max(probs, 1)

    label = "fake" if predicted.item() == 0 else "real"

    return label, float(confidence.item())


# CLI testing only
if __name__ == "__main__":

    image_path = sys.argv[1]
    label, confidence = detect_image(image_path)

    print("Prediction:", label)
    print("Confidence:", round(confidence * 100, 2), "%")