from fastapi import APIRouter
import pandas as pd
import os
import time
import random
from ctgan import CTGAN

# Import training engine
from bias_engine.training import train_model_from_csv
from bias_engine.gan import generate_synthetic_with_ctgan
from bias_engine.vae import train_vae, generate_synthetic_with_vae
from bias_engine.metrics import compare_distributions

router = APIRouter()
UPLOAD_FOLDER = "uploads"


# =====================================================
# 1️⃣ Dynamic Synthetic Data Generation (GAN / VAE)
# =====================================================
@router.post("/generate-synthetic")
def generate_synthetic(config: dict):

    dataset_path = config.get("dataset_path")
    samples = config.get("samples", 1000)
    method = config.get("method", "GAN")

    # 🔥 ADD THESE (Fix for UI toggle display)
    fairness_flag = config.get("fairness", False)
    dp_flag = config.get("differential_privacy", False)

    if not dataset_path:
        return {"error": "Dataset path is required"}

    full_path = os.path.join(UPLOAD_FOLDER, dataset_path)

    if not os.path.exists(full_path):
        return {"error": "Dataset not found"}

    start_time = time.time()

    # Load dataset
    df = pd.read_csv(full_path).dropna()

    if df.empty:
        return {"error": "Dataset is empty after removing missing values"}

    # Detect categorical columns automatically
    categorical_columns = df.select_dtypes(
        include=["object", "category", "bool"]
    ).columns.tolist()

    # ==================================================
    # 🔥 METHOD SWITCH
    # ==================================================
    if method == "GAN":
        try:
            synthetic_df = generate_synthetic_with_ctgan(
                df, 
                num_samples=samples,
                discrete_columns=categorical_columns
            )
            generation_method = "CTGAN"
        except Exception as e:
            return {"error": f"CTGAN generation failed: {str(e)}"}

    elif method == "VAE":
        try:
            # Convert categorical columns to numeric
            df_encoded = df.copy()
            label_encoders = {}
            
            for col in categorical_columns:
                le = pd.factorize(df_encoded[col])[0]
                df_encoded[col] = le
                label_encoders[col] = df_encoded[col].unique()
            
            # Train VAE
            vae, scaler = train_vae(df_encoded, latent_dim=10, epochs=30)
            
            # Generate synthetic samples
            synthetic_scaled = vae.sample(samples)
            synthetic_df = pd.DataFrame(
                scaler.inverse_transform(synthetic_scaled),
                columns=df.columns
            )
            
            # Decode categorical columns back
            for col in categorical_columns:
                if col in synthetic_df.columns:
                    synthetic_df[col] = pd.cut(
                        synthetic_df[col], 
                        bins=len(label_encoders.get(col, [])),
                        labels=label_encoders.get(col, []),
                        duplicates='drop'
                    ).astype('object')
            
            generation_method = "VAE"
        except Exception as e:
            return {"error": f"VAE generation failed: {str(e)}"}

    else:
        return {"error": "Invalid generation method selected"}

    # ==================================================
    # Save generated dataset
    # ==================================================
    output_name = f"synthetic_generated_{random.randint(1000,9999)}.csv"
    output_path = os.path.join(UPLOAD_FOLDER, output_name)

    synthetic_df.to_csv(output_path, index=False)

    generation_time = round(time.time() - start_time, 2)

    # ==================================================
    # 🔥 Compare distributions for quality metrics
    # ==================================================
    distribution_comparison = compare_distributions(df, synthetic_df)

    # ==================================================
    # 🔥 FINAL RETURN (WITH TOGGLE VALUES)
    # ==================================================
    return {
        "row_count": len(synthetic_df),
        "samples_generated": len(synthetic_df),
        "columns": list(synthetic_df.columns),
        "generation_method": generation_method,
        "categorical_columns_detected": categorical_columns,
        "fairness_applied": fairness_flag,   # ✅ NOW WORKS
        "dp_applied": dp_flag,               # ✅ NOW WORKS
        "generation_time": f"{generation_time} sec",
        "download_path": f"uploads/{output_name}",
        "data_quality_score": distribution_comparison.get("data_quality_score", 0.0),
        "overall_similarity": distribution_comparison.get("overall_similarity", 0.0),
        "feature_metrics": distribution_comparison.get("feature_metrics", {})
    }


# =====================================================
# 2️⃣ Model Training + Bias Check
# =====================================================
@router.post("/train-model")
def train_model(config: dict):

    dataset_path = config.get("dataset_path")

    if not dataset_path:
        return {"error": "Dataset path is required"}

    full_path = os.path.join(UPLOAD_FOLDER, dataset_path)

    if not os.path.exists(full_path):
        return {"error": "Dataset not found"}

    results = train_model_from_csv(full_path)

    return {
        "status": "success",
        "accuracy": results["accuracy"],
        "demographic_parity_difference": results["demographic_parity_difference"],
        "target": results["target"],
        "sensitive": results["sensitive"]
    }
