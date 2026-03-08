import pandas as pd
import torch
import torch.nn as nn
import torch.optim as optim
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score
from fairlearn.metrics import demographic_parity_difference


# -------------------------------
# Simple Neural Network Model
# -------------------------------
class SimpleModel(nn.Module):
    def __init__(self, input_dim):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(input_dim, 16),
            nn.ReLU(),
            nn.Linear(16, 1),
            nn.Sigmoid()
        )

    def forward(self, x):
        return self.net(x)


# -------------------------------
# Train Model From CSV
# -------------------------------
def train_model_from_csv(csv_path):

    # Load dataset
    df = pd.read_csv(csv_path).dropna()

    # -------------------------------
    # Auto Detect Target Column
    # -------------------------------
    target = None
    for col in df.columns:
        if df[col].nunique() == 2:
            target = col
            break

    if target is None:
        raise Exception("No binary target column found")

    # Encode target if needed
    if df[target].dtype == "object":
        le = LabelEncoder()
        df[target] = le.fit_transform(df[target])

    # -------------------------------
    # Auto Detect Sensitive Column
    # -------------------------------
    sensitive = None
    for col in df.columns:
        if col != target and (
            df[col].dtype == "object" or 2 <= df[col].nunique() <= 5
        ):
            sensitive = col
            break

    if sensitive is None:
        raise Exception("No suitable sensitive column found")

    # Encode sensitive if needed
    if df[sensitive].dtype == "object":
        le = LabelEncoder()
        df[sensitive] = le.fit_transform(df[sensitive])

    # -------------------------------
    # SAFE Data Preparation
    # -------------------------------
    df_encoded = pd.get_dummies(df)

    # Convert everything to numeric
    df_encoded = df_encoded.apply(pd.to_numeric, errors="coerce")

    # Drop rows that became NaN
    df_encoded = df_encoded.dropna()

    X = df_encoded.drop(columns=[target])
    y = df_encoded[target]

    # Ensure correct numeric types
    X = X.astype("float32")
    y = y.astype("float32")

    # Convert to tensors
    X_tensor = torch.tensor(X.values, dtype=torch.float32)
    y_tensor = torch.tensor(y.values, dtype=torch.float32)

    # -------------------------------
    # Train Neural Network
    # -------------------------------
    model = SimpleModel(X_tensor.shape[1])
    optimizer = optim.Adam(model.parameters(), lr=0.001)
    criterion = nn.BCELoss()

    for epoch in range(30):
        optimizer.zero_grad()
        outputs = model(X_tensor).squeeze()
        loss = criterion(outputs, y_tensor)
        loss.backward()
        optimizer.step()

    # Predictions
    predictions = (outputs.detach().numpy() > 0.5).astype(int)

    # -------------------------------
    # Metrics
    # -------------------------------
    accuracy = accuracy_score(y, predictions)

    dp = demographic_parity_difference(
        y,
        predictions,
        sensitive_features=df[sensitive]
    )

    return {
        "accuracy": float(accuracy),
        "demographic_parity_difference": float(dp),
        "target": target,
        "sensitive": sensitive
    }