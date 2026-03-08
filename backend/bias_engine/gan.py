import pandas as pd
import numpy as np
from ctgan import CTGAN
from sklearn.preprocessing import LabelEncoder


def generate_balanced_data(df, target_col, sensitive_col):
    """Generate balanced data using CTGAN with improved preprocessing."""
    
    group_counts = df[sensitive_col].value_counts()
    max_count = group_counts.max()

    balanced_df = df.copy()

    for group, count in group_counts.items():
        if count < max_count:
            deficit = max_count - count
            group_df = df[df[sensitive_col] == group].copy()
            
            # Improved CTGAN with better hyperparameters
            ctgan = CTGAN(epochs=50, batch_size=64, verbose=False)
            
            # Detect discrete columns
            discrete_cols = group_df.select_dtypes(
                include=["object", "category", "bool"]
            ).columns.tolist()
            
            ctgan.fit(group_df, discrete_columns=discrete_cols)
            synthetic = ctgan.sample(deficit)
            
            balanced_df = pd.concat([balanced_df, synthetic], ignore_index=True)

    return balanced_df.reset_index(drop=True)


def generate_synthetic_with_ctgan(df, num_samples, discrete_columns=None):
    """
    Generate synthetic data using CTGAN with quality validation.
    
    Args:
        df: Original dataframe
        num_samples: Number of synthetic samples to generate
        discrete_columns: List of discrete/categorical column names
        
    Returns:
        Synthetic dataframe with same schema as original
    """
    
    if discrete_columns is None:
        discrete_columns = df.select_dtypes(
            include=["object", "category", "bool"]
        ).columns.tolist()
    
    # Create and train CTGAN
    ctgan = CTGAN(epochs=30, batch_size=128, verbose=False)
    ctgan.fit(df, discrete_columns=discrete_columns)
    
    # Generate synthetic data
    synthetic_df = ctgan.sample(num_samples)
    
    # Post-processing: ensure data types match original
    for col in synthetic_df.columns:
        if col in df.columns:
            original_dtype = df[col].dtype
            
            # Handle categorical columns
            if col in discrete_columns and original_dtype == 'object':
                # Round to nearest unique value if numeric representation exists
                original_values = df[col].unique()
                if pd.api.types.is_numeric_dtype(synthetic_df[col]):
                    synthetic_df[col] = synthetic_df[col].round().astype(int)
                    synthetic_df[col] = synthetic_df[col].clip(0, len(original_values) - 1)
            
            # Handle numerical columns
            elif pd.api.types.is_numeric_dtype(original_dtype):
                # Ensure values are within original range with small buffer
                min_val = df[col].min()
                max_val = df[col].max()
                synthetic_df[col] = synthetic_df[col].clip(min_val, max_val)
    
    return synthetic_df