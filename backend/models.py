from sqlalchemy import Column, Integer, String, Float, DateTime, JSON, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base


# ==============================
# USER MODEL
# ==============================
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True)
    email = Column(String(150), unique=True, index=True)
    hashed_password = Column(String(255))
    role = Column(String(50), default="user")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    schemas = relationship("Schema", back_populates="owner")
    synthesis_jobs = relationship("SynthesisJob", back_populates="owner")


# ==============================
# SCHEMA MODEL
# ==============================
class Schema(Base):
    __tablename__ = "schemas"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String(150), index=True)
    schema_definition = Column(JSON)
    attributes = Column(JSON)
    sensitive_fields = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    owner = relationship("User", back_populates="schemas")
    synthesis_jobs = relationship("SynthesisJob", back_populates="schema")


# ==============================
# SYNTHESIS JOB MODEL
# ==============================
class SynthesisJob(Base):
    __tablename__ = "synthesis_jobs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    schema_id = Column(Integer, ForeignKey("schemas.id"))
    job_name = Column(String(150), index=True)
    status = Column(String(50), default="pending")
    num_records = Column(Integer)
    demographic_config = Column(JSON)
    output_path = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    error_message = Column(String(255), nullable=True)

    owner = relationship("User", back_populates="synthesis_jobs")
    schema = relationship("Schema", back_populates="synthesis_jobs")
    monitoring_results = relationship("MonitoringResult", back_populates="synthesis_job")


# ==============================
# MONITORING RESULT MODEL
# ==============================
class MonitoringResult(Base):
    __tablename__ = "monitoring_results"

    id = Column(Integer, primary_key=True, index=True)
    synthesis_job_id = Column(Integer, ForeignKey("synthesis_jobs.id"))
    fairness_metrics = Column(JSON)
    drift_metrics = Column(JSON)
    model_predictions = Column(JSON)
    alerts = Column(JSON)
    timestamp = Column(DateTime, default=datetime.utcnow)

    synthesis_job = relationship("SynthesisJob", back_populates="monitoring_results")


# ==============================
# AUDIT LOG MODEL
# ==============================
class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True)
    action = Column(String(150))
    resource = Column(String(150))
    details = Column(JSON)
    timestamp = Column(DateTime, default=datetime.utcnow)


# ==============================
# FAIRNESS HISTORY MODEL
# ==============================
class FairnessHistory(Base):
    __tablename__ = "fairness_history"

    id = Column(Integer, primary_key=True, index=True)
    original_fairness = Column(Float)
    mitigated_fairness = Column(Float)
    improvement = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)