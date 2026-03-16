import pandas as pd
import numpy as np
import os
from pathlib import Path

def auto_clean_dataset(input_file_path, output_path=None):
    """
    Automatically clean ANY dataset by detecting column types and fixing values.
    Works with any CSV file - no hardcoded column names!
    
    Args:
        input_file_path: Path to your CSV file
        output_path: Path to save cleaned dataset (optional)
    
    Returns:
        Cleaned pandas DataFrame
    """
    
    print("=" * 70)
    print("🧹 UNIVERSAL DATASET CLEANER")
    print("=" * 70)
    
    # Check if file exists
    if not os.path.exists(input_file_path):
        print(f"❌ Error: File not found at {input_file_path}")
        return None
    
    # Load the dataset
    df = pd.read_csv(input_file_path)
    
    print(f"\n📊 Loaded: {os.path.basename(input_file_path)}")
    print(f"   Shape: {df.shape} ({len(df)} rows, {len(df.columns)} columns)")
    print(f"   Memory: {df.memory_usage(deep=True).sum() / 1024**2:.2f} MB")
    
    # Show sample of raw data
    print("\n🔍 Raw data sample (first 5 rows):")
    print("-" * 70)
    print(df.head())
    
    print("\n📊 Data types before cleaning:")
    print(df.dtypes)
    
    # Create a copy
    cleaned_df = df.copy()
    
    # ============================================
    # STEP 1: Auto-detect column types
    # ============================================
    
    categorical_cols = []
    binary_cols = []
    numerical_cols = []
    integer_cols = []
    
    for col in df.columns:
        # Skip if all values are null
        if df[col].isnull().all():
            continue
            
        # Get unique values (excluding NaN)
        unique_vals = df[col].dropna().unique()
        n_unique = len(unique_vals)
        
        # Check if column is likely categorical
        if n_unique <= 20:  # Few unique values = categorical
            # Check if it's binary (2 unique values)
            if n_unique == 2:
                binary_cols.append(col)
            else:
                categorical_cols.append(col)
        
        # Check if column is numerical
        elif pd.api.types.is_numeric_dtype(df[col]):
            # Check if it should be integer (all values are whole numbers)
            if all(df[col].dropna() % 1 == 0):
                integer_cols.append(col)
            else:
                numerical_cols.append(col)
    
    print(f"\n🔍 Auto-detected column types:")
    print(f"   Binary columns: {binary_cols}")
    print(f"   Categorical columns: {categorical_cols}")
    print(f"   Integer columns: {integer_cols}")
    print(f"   Numerical columns: {numerical_cols}")
    
    # ============================================
    # STEP 2: Clean binary columns (should be 0/1)
    # ============================================
    
    if binary_cols:
        print("\n🔧 Cleaning binary columns (rounding to 0/1)...")
        for col in binary_cols:
            unique_before = sorted(df[col].dropna().unique())
            
            # Round to nearest integer and clip to 0/1
            cleaned_df[col] = cleaned_df[col].round(0).clip(0, 1)
            cleaned_df[col] = pd.to_numeric(cleaned_df[col], errors='coerce').fillna(0).astype(int)
            
            unique_after = sorted(cleaned_df[col].unique())
            print(f"  ✓ {col}: {unique_before[:5]} → {unique_after}")
    
    # ============================================
    # STEP 3: Clean categorical columns
    # ============================================
    
    if categorical_cols:
        print("\n🔧 Cleaning categorical columns...")
        for col in categorical_cols:
            unique_before = sorted(df[col].dropna().unique())
            
            # For categorical, round to nearest integer
            cleaned_df[col] = cleaned_df[col].round(0)
            
            # Convert to integer if possible
            try:
                cleaned_df[col] = pd.to_numeric(cleaned_df[col], errors='coerce')
                # Find min and max to clip
                min_val = cleaned_df[col].min()
                max_val = cleaned_df[col].max()
                cleaned_df[col] = cleaned_df[col].clip(min_val, max_val).astype(int)
            except:
                # Keep as is if can't convert to numeric
                pass
            
            unique_after = sorted(cleaned_df[col].dropna().unique())
            print(f"  ✓ {col}: {len(unique_before)} unique → {len(unique_after)} unique")
    
    # ============================================
    # STEP 4: Clean integer columns
    # ============================================
    
    if integer_cols:
        print("\n🔧 Cleaning integer columns...")
        for col in integer_cols:
            unique_before = sorted(df[col].dropna().unique()[:5])
            
            # Round to nearest integer
            cleaned_df[col] = cleaned_df[col].round(0).astype(int)
            
            unique_after = sorted(cleaned_df[col].unique()[:5])
            print(f"  ✓ {col}: {unique_before} → {unique_after}")
    
    # ============================================
    # STEP 5: Handle missing values
    # ============================================
    
    missing_before = df.isnull().sum().sum()
    if missing_before > 0:
        print(f"\n🔧 Handling {missing_before} missing values...")
        
        for col in cleaned_df.columns:
            if cleaned_df[col].isnull().any():
                if col in binary_cols + categorical_cols:
                    # For categorical, fill with mode
                    mode_val = cleaned_df[col].mode()
                    if len(mode_val) > 0:
                        cleaned_df[col].fillna(mode_val[0], inplace=True)
                else:
                    # For numerical, fill with median
                    cleaned_df[col].fillna(cleaned_df[col].median(), inplace=True)
    
    missing_after = cleaned_df.isnull().sum().sum()
    print(f"   Missing values: {missing_before} → {missing_after}")
    
    # ============================================
    # STEP 6: Final verification
    # ============================================
    
    print("\n📊 Data types after cleaning:")
    print(cleaned_df.dtypes)
    
    print("\n✅ Cleaned data sample:")
    print(cleaned_df.head())
    
    # ============================================
    # STEP 7: Save cleaned dataset
    # ============================================
    
    if output_path is None:
        base_name = os.path.basename(input_file_path)
        dir_name = os.path.dirname(input_file_path)
        name_without_ext = os.path.splitext(base_name)[0]
        output_path = os.path.join(dir_name, f"cleaned_{base_name}")
    
    cleaned_df.to_csv(output_path, index=False)
    
    # File size comparison
    original_size = os.path.getsize(input_file_path) / 1024
    cleaned_size = os.path.getsize(output_path) / 1024
    
    print(f"\n💾 Saved cleaned dataset to: {output_path}")
    print(f"   Original size: {original_size:.2f} KB")
    print(f"   Cleaned size:  {cleaned_size:.2f} KB")
    print(f"   Compression:   {(1 - cleaned_size/original_size)*100:.1f}% reduction")
    
    return cleaned_df

# ============================================
# BATCH PROCESSING - Clean multiple files
# ============================================

def batch_clean_datasets(folder_path, pattern="*.csv"):
    """
    Clean all CSV files in a folder
    """
    import glob
    
    csv_files = glob.glob(os.path.join(folder_path, pattern))
    
    print(f"\n📁 Found {len(csv_files)} CSV files in {folder_path}")
    
    for i, file_path in enumerate(csv_files, 1):
        print(f"\n[{i}/{len(csv_files)}] Processing: {os.path.basename(file_path)}")
        auto_clean_dataset(file_path)
        print("-" * 70)

# ============================================
# USAGE EXAMPLES
# ============================================

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='Clean any dataset automatically')
    parser.add_argument('input', help='Input CSV file path or folder path')
    parser.add_argument('--output', '-o', help='Output file path (optional)')
    parser.add_argument('--batch', '-b', action='store_true', help='Process all CSV files in folder')
    
    args = parser.parse_args()
    
    if args.batch:
        # Process all CSV files in folder
        batch_clean_datasets(args.input)
    else:
        # Process single file
        auto_clean_dataset(args.input, args.output)