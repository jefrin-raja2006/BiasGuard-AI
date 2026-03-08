from pydantic import BaseModel, EmailStr
from typing import List, Dict, Optional, Any
from datetime import datetime

# Auth Schemas
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    role: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# Schema Management
class SchemaDef(BaseModel):
    name: str
    schema_definition: Dict[str, str]
    attributes: List[str]
    sensitive_fields: List[str]

class SchemaResponse(BaseModel):
    id: int
    user_id: int
    name: str
    schema_definition: Dict
    attributes: List[str]
    sensitive_fields: List[str]
    created_at: datetime
    
    class Config:
        from_attributes = True

# Synthesis
class DemographicConfig(BaseModel):
    age_distribution: Optional[Dict[str, float]] = None
    gender_distribution: Optional[Dict[str, float]] = None
    ethnicity_distribution: Optional[Dict[str, float]] = None

class SynthesisRequest(BaseModel):
    schema_id: int
    job_name: str
    num_records: int
    demographic_config: DemographicConfig

class SynthesisJobResponse(BaseModel):
    id: int
    user_id: int
    schema_id: int
    job_name: str
    status: str
    num_records: int
    created_at: datetime
    completed_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Monitoring
class FairnessMetrics(BaseModel):
    feature_importance: Dict[str, float]
    bias_score: float
    fairness_violations: List[str]
    timestamp: datetime

class DriftMetrics(BaseModel):
    data_drift_score: float
    concept_drift_score: float
    threshold_exceeded: bool
    affected_features: List[str]

class MonitoringResponse(BaseModel):
    id: int
    synthesis_job_id: int
    fairness_metrics: Dict
    drift_metrics: Dict
    alerts: List[str]
    timestamp: datetime
    
    class Config:
        from_attributes = True
