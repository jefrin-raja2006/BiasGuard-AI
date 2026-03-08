from fastapi import APIRouter, Body, Request
import pandas as pd
import os
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import LabelEncoder

from bias_engine.metrics import analyze_bias, compare_distributions
from bias_engine.training import train_model_from_csv
from bias_engine.gan import generate_balanced_data

from models import FairnessHistory
from database import SessionLocal

router = APIRouter()


# =====================================================
# 1️⃣ ANALYZE BIAS (Original + GAN Mitigation)
# =====================================================
@router.post("/analyze-bias")
async def analyze(request: Request, config: dict = Body(default={})):

    latest_uploaded_file = request.app.state.latest_uploaded_file

    if latest_uploaded_file is None:
        return {
            "error": "No dataset uploaded",
            "message": "Please upload a CSV dataset first using the Dataset Upload page",
            "base_fairness": 0,
            "mitigated_fairness": 0,
            "improvement": 0
        }

    # =====================================================
    # STEP 1: Base Model Training
    # =====================================================
    try:
        training_results = train_model_from_csv(latest_uploaded_file)

        base_fairness = (1 - training_results["demographic_parity_difference"]) * 100
        base_fairness = round(base_fairness, 2)

        df = pd.read_csv(latest_uploaded_file).dropna()

        # Detect target column
        target = None
        for col in df.columns:
            if df[col].nunique() == 2:
                target = col
                break

        if target is None:
            return {"error": "No binary target column found in dataset"}

        if df[target].dtype == "object":
            le = LabelEncoder()
            df[target] = le.fit_transform(df[target])

        # Detect sensitive column
        sensitive = None
        for col in df.columns:
            if col != target and (
                df[col].dtype == "object" or 2 <= df[col].nunique() <= 5
            ):
                sensitive = col
                break

        if sensitive is None:
            return {"error": "No suitable sensitive column found"}

        if df[sensitive].dtype == "object":
            le = LabelEncoder()
            df[sensitive] = le.fit_transform(df[sensitive])

        # =====================================================
        # STEP 2: GAN-Based Mitigation
        # =====================================================
        apply_mitigation = config.get("apply_mitigation", True)

        mitigated_fairness = base_fairness
        mitigation_applied = False
        final_result = {
            "demographic_parity_difference": training_results["demographic_parity_difference"],
            "equalized_odds_difference": 0
        }

        if apply_mitigation and base_fairness < 80:

            mitigation_applied = True

            balanced_df = generate_balanced_data(df, target, sensitive)

            balanced_df_encoded = pd.get_dummies(balanced_df)
            balanced_df_encoded = balanced_df_encoded.apply(pd.to_numeric, errors="coerce")
            balanced_df_encoded = balanced_df_encoded.dropna()

            X_bal = balanced_df_encoded.drop(columns=[target])
            y_bal = balanced_df_encoded[target]

            model = LogisticRegression(max_iter=5000, solver="liblinear")
            model.fit(X_bal, y_bal)

            y_pred_bal = model.predict(X_bal)

            mitigated_result = analyze_bias(
                y_true=y_bal,
                y_pred=y_pred_bal,
                sensitive_feature=balanced_df[sensitive]
            )

            mitigated_fairness = round(mitigated_result["fairness_score"], 2)
            final_result = mitigated_result

        # =====================================================
        # STEP 3: Improvement Calculation
        # =====================================================
        improvement = round(mitigated_fairness - base_fairness, 2)

        request.app.state.latest_fairness_score = mitigated_fairness

        # =====================================================
        # STEP 4: Save Fairness History
        # =====================================================
        db = SessionLocal()

        history = FairnessHistory(
            original_fairness=base_fairness,
            mitigated_fairness=mitigated_fairness,
            improvement=improvement
        )

        db.add(history)
        db.commit()
        db.close()

        # =====================================================
        # RESPONSE
        # =====================================================
        return {
            "accuracy": training_results["accuracy"] * 100,
            "original_fairness": base_fairness,
            "mitigated_fairness": mitigated_fairness,
            "fairness_improvement": improvement,
            "mitigation_applied": mitigation_applied,
            "fairness_score": mitigated_fairness,
            "demographic_parity_difference": final_result["demographic_parity_difference"],
            "equalized_odds_difference": final_result.get("equalized_odds_difference", 0)
        }
    
    except Exception as e:
        return {
            "error": f"Bias analysis failed: {str(e)}",
            "message": "Please ensure your dataset has a binary target column and a sensitive attribute",
            "base_fairness": 0,
            "mitigated_fairness": 0,
            "improvement": 0
        }


# =====================================================
# 2️⃣ COMPARE ORIGINAL VS SYNTHETIC DATASETS (ENHANCED)
# =====================================================
@router.post("/compare-datasets")
def compare_datasets(config: dict):

    original_dataset = config.get("original_dataset")
    synthetic_dataset = config.get("synthetic_dataset")

    if not original_dataset or not synthetic_dataset:
        return {"error": "Both dataset paths are required"}

    original_path = os.path.join("uploads", original_dataset)
    synthetic_path = os.path.join("uploads", synthetic_dataset)

    if not os.path.exists(original_path):
        return {"error": "Original dataset not found"}

    if not os.path.exists(synthetic_path):
        return {"error": "Synthetic dataset not found"}

    # Load datasets
    original_df = pd.read_csv(original_path).dropna()
    synthetic_df = pd.read_csv(synthetic_path).dropna()

    # =====================================================
    # STEP 1: Train & Evaluate Original
    # =====================================================
    original_results = train_model_from_csv(original_path)

    # =====================================================
    # STEP 2: Train & Evaluate Synthetic
    # =====================================================
    synthetic_results = train_model_from_csv(synthetic_path)

    original_dp = original_results["demographic_parity_difference"]
    synthetic_dp = synthetic_results["demographic_parity_difference"]

    # Fairness = 1 - |DP|
    original_fairness = 1 - abs(original_dp)
    synthetic_fairness = 1 - abs(synthetic_dp)

    fairness_improvement = round((synthetic_fairness - original_fairness) * 100, 2)

    # =====================================================
    # STEP 3: Distribution Comparison
    # =====================================================
    distribution_metrics = compare_distributions(original_df, synthetic_df)

    # =====================================================
    # FINAL RESPONSE (ENHANCED)
    # =====================================================
    return {
        "original_accuracy": round(original_results["accuracy"] * 100, 2),
        "synthetic_accuracy": round(synthetic_results["accuracy"] * 100, 2),
        "accuracy_difference": round(
            abs(original_results["accuracy"] - synthetic_results["accuracy"]) * 100, 
            2
        ),
        "original_dp": round(original_dp, 4),
        "synthetic_dp": round(synthetic_dp, 4),
        "original_fairness": round(original_fairness * 100, 2),
        "synthetic_fairness": round(synthetic_fairness * 100, 2),
        "fairness_improvement": fairness_improvement,
        "data_quality_score": distribution_metrics.get("data_quality_score", 0.0),
        "overall_similarity": distribution_metrics.get("overall_similarity", 0.0),
        "feature_metrics": distribution_metrics.get("feature_metrics", {})
    }
