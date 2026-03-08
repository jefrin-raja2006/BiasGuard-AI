"""
Configuration module for FastAPI application
"""

import os
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # API
    app_name: str = "Synthetic Healthcare Data Platform"
    app_version: str = "1.0.0"
    debug: bool = os.getenv("DEBUG", False)
    
    # Database
    database_url: str = os.getenv(
        "DATABASE_URL",
        "postgresql://synthetic_user:secure_password@localhost:5432/synthetic_health_db"
    )
    
    # Security
    secret_key: str = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    algorithm: str = "HS256"
    access_token_expire_hours: int = 24
    
    # CORS
    cors_origins: List[str] = ["http://localhost:3000", "http://localhost:3001"]
    
    # ML
    model_type: str = "CTGAN"
    batch_size: int = 128
    epochs: int = 300
    
    # Fairness
    fairness_threshold: float = 0.8
    drift_threshold: float = 0.3
    
    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()
