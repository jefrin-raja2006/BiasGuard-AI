import pandas as pd
import numpy as np
from fairlearn.metrics import (
    MetricFrame,
    selection_rate,
    demographic_parity_difference,
    equalized_odds_difference
)
from sklearn.metrics import accuracy_score
from scipy.stats import ks_2samp, entropy as scipy_entropy


def analyze_bias(y_true, y_pred, sensitive_feature):

    metrics = {
        "accuracy": accuracy_score,
        "selection_rate": selection_rate
    }

    metric_frame = MetricFrame(
        metrics=metrics,
        y_true=y_true,
        y_pred=y_pred,
        sensitive_features=sensitive_feature
    )

    dp_diff = demographic_parity_difference(
        y_true=y_true,
        y_pred=y_pred,
        sensitive_features=sensitive_feature
    )

    eo_diff = equalized_odds_difference(
        y_true=y_true,
        y_pred=y_pred,
        sensitive_features=sensitive_feature
    )

    # 🔥 ENTERPRISE FAIRNESS SCORE
    fairness_score = round((1 - abs(dp_diff)) * 100, 2)

    # Clamp between 0 and 100
    if fairness_score < 0:
        fairness_score = 0
    if fairness_score > 100:
        fairness_score = 100

    result = {
        "fairness_score": fairness_score,
        "overall_accuracy": round(accuracy_score(y_true, y_pred) * 100, 2),
        "group_metrics": metric_frame.by_group.to_dict(),
        "demographic_parity_difference": round(dp_diff, 4),
        "equalized_odds_difference": round(eo_diff, 4)
    }

    return result


def jensen_shannon_divergence(p, q):
    """
    Calculate Jensen-Shannon divergence between two distributions.
    Handles edge cases with small values.
    """
    # Normalize to probability distributions
    p = np.array(p, dtype=float)
    q = np.array(q, dtype=float)
    
    # Handle empty or invalid arrays
    if len(p) == 0 or len(q) == 0:
        return 0.0
    
    # Pad to same length
    max_len = max(len(p), len(q))
    p_padded = np.zeros(max_len)
    q_padded = np.zeros(max_len)
    
    p_padded[:len(p)] = p
    q_padded[:len(q)] = q
    
    # Normalize
    p_norm = p_padded / (np.sum(p_padded) + 1e-10)
    q_norm = q_padded / (np.sum(q_padded) + 1e-10)
    
    # Calculate Jensen-Shannon divergence
    m = 0.5 * (p_norm + q_norm)
    js = 0.5 * scipy_entropy(p_norm, m) + 0.5 * scipy_entropy(q_norm, m)
    
    return float(np.clip(js, 0, 1))


def compare_distributions(original_df, synthetic_df):
    """
    Compare statistical distributions between original and synthetic data.
    
    Args:
        original_df: Original dataframe
        synthetic_df: Synthetic dataframe
        
    Returns:
        Dictionary with per-feature comparison metrics
    """
    
    comparison_results = {
        "overall_similarity": 0.0,
        "feature_metrics": {},
        "data_quality_score": 0.0
    }
    
    similarities = []
    
    # Get common columns
    common_cols = [col for col in original_df.columns if col in synthetic_df.columns]
    
    for col in common_cols:
        orig_values = original_df[col].dropna()
        synth_values = synthetic_df[col].dropna()
        
        if len(orig_values) == 0 or len(synth_values) == 0:
            continue
        
        # Numeric columns: KS test
        if pd.api.types.is_numeric_dtype(orig_values):
            statistic, p_value = ks_2samp(orig_values, synth_values)
            similarity = 1 - min(statistic, 1.0)
            
            comparison_results["feature_metrics"][col] = {
                "type": "numeric",
                "ks_statistic": float(np.round(statistic, 4)),
                "ks_p_value": float(np.round(p_value, 4)),
                "similarity": float(np.round(similarity, 4)),
                "original_mean": float(np.round(orig_values.mean(), 4)),
                "synthetic_mean": float(np.round(synth_values.mean(), 4)),
                "original_std": float(np.round(orig_values.std(), 4)),
                "synthetic_std": float(np.round(synth_values.std(), 4))
            }
        
        # Categorical columns: Jensen-Shannon divergence
        else:
            # Get value counts
            orig_counts = orig_values.value_counts(normalize=True).sort_index()
            synth_counts = synth_values.value_counts(normalize=True).sort_index()
            
            js_div = jensen_shannon_divergence(orig_counts.values, synth_counts.values)
            similarity = 1 - js_div
            
            comparison_results["feature_metrics"][col] = {
                "type": "categorical",
                "jensen_shannon_divergence": float(np.round(js_div, 4)),
                "similarity": float(np.round(similarity, 4)),
                "original_unique": int(orig_values.nunique()),
                "synthetic_unique": int(synth_values.nunique())
            }
        
        similarities.append(similarity)
    
    # Calculate overall similarity
    if similarities:
        overall_sim = float(np.round(np.mean(similarities), 4))
        comparison_results["overall_similarity"] = overall_sim
        
        # Data quality score: penalize if too few common columns
        quality_score = overall_sim * 100
        if len(common_cols) < len(original_df.columns) * 0.8:
            quality_score *= 0.8  # Penalize missing columns
        
        comparison_results["data_quality_score"] = float(np.round(quality_score, 2))
    
    return comparison_results
