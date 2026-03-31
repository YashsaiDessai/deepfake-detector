import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, transforms
from torchvision.models import resnet18, ResNet18_Weights
from torch.utils.data import DataLoader
import os


def main():

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print("Using device:", device)

    # ----------------------------
    # TRAIN TRANSFORMS
    # ----------------------------
    train_transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.RandomHorizontalFlip(),
        transforms.RandomRotation(15),
        transforms.ColorJitter(
            brightness=0.3,
            contrast=0.3,
            saturation=0.3
        ),
        transforms.ToTensor(),
        transforms.Normalize(
            [0.485, 0.456, 0.406],
            [0.229, 0.224, 0.225]
        )
    ])

    # ----------------------------
    # VALIDATION TRANSFORMS
    # ----------------------------
    val_transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(
            [0.485, 0.456, 0.406],
            [0.229, 0.224, 0.225]
        )
    ])

    # ----------------------------
    # DATASETS
    # ----------------------------
    train_dataset = datasets.ImageFolder(
        "datasets/train",
        transform=train_transform
    )

    val_dataset = datasets.ImageFolder(
        "datasets/validation",
        transform=val_transform
    )

    print("Class mapping:", train_dataset.class_to_idx)
    print("Training images:", len(train_dataset))
    print("Validation images:", len(val_dataset))

    # ----------------------------
    # DATALOADERS
    # ----------------------------
    train_loader = DataLoader(
        train_dataset,
        batch_size=32,
        shuffle=True,
        num_workers=4,
        pin_memory=True
    )

    val_loader = DataLoader(
        val_dataset,
        batch_size=32,
        shuffle=False,
        num_workers=4,
        pin_memory=True
    )

    # ----------------------------
    # MODEL
    # ----------------------------
    model = resnet18(weights=ResNet18_Weights.DEFAULT)
    model.fc = nn.Linear(model.fc.in_features, 2)
    model = model.to(device)

    # ----------------------------
    # LOSS + OPTIMIZER
    # ----------------------------
    class_weights = torch.tensor([1.0, 1.5]).to(device)

    criterion = nn.CrossEntropyLoss(weight=class_weights)

    optimizer = optim.Adam(
        model.parameters(),
        lr=0.0001
    )

    num_epochs = 10

    # ----------------------------
    # TRAINING LOOP
    # ----------------------------
    for epoch in range(num_epochs):

        model.train()
        running_loss = 0

        for batch_idx, (images, labels) in enumerate(train_loader):

            images = images.to(device)
            labels = labels.to(device)

            optimizer.zero_grad()

            outputs = model(images)

            loss = criterion(outputs, labels)

            loss.backward()
            optimizer.step()

            running_loss += loss.item()

            if batch_idx % 100 == 0:
                print(f"Batch {batch_idx}/{len(train_loader)} Loss: {loss.item():.4f}")

        print(f"\nEpoch {epoch+1}/{num_epochs} finished")

        # ----------------------------
        # VALIDATION
        # ----------------------------
        model.eval()

        correct = 0
        total = 0

        with torch.no_grad():
            for images, labels in val_loader:

                images = images.to(device)
                labels = labels.to(device)

                outputs = model(images)

                _, predicted = torch.max(outputs, 1)

                total += labels.size(0)
                correct += (predicted == labels).sum().item()

        accuracy = 100 * correct / total
        print(f"Validation Accuracy: {accuracy:.2f}%\n")

    # ----------------------------
    # SAVE MODEL
    # ----------------------------
    os.makedirs("weights", exist_ok=True)

    torch.save(
        model.state_dict(),
        "weights/trained_model.pth"
    )

    print("Model saved!")


if __name__ == "__main__":
    main()