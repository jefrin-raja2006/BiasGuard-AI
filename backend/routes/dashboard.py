from fastapi import APIRouter
from datetime import datetime
import os
import random
from sqlalchemy import desc

from database import SessionLocal
from models import FairnessHistory

router = APIRouter()


@router.get("/overview")
def dashboard_overview():

    db = SessionLocal()

    # ------------------------------------
    # ✅ Get Latest Fairness From Database
    # ------------------------------------
    latest_record = (
        db.query(FairnessHistory)
        .order_by(desc(FairnessHistory.created_at))
        .first()
    )

    db.close()

    if latest_record:
        fairness_score = latest_record.mitigated_fairness
        improvement = latest_record.improvement
    else:
        fairness_score = 0
        improvement = 0

    # ------------------------------------
    # Synthetic Dataset Count
    # ------------------------------------
    synthetic_count = 0
    if os.path.exists("uploads"):
        synthetic_count = len(
            [f for f in os.listdir("uploads") if f.startswith("synthetic")]
        )

    # ------------------------------------
    # Model Monitoring Simulation
    # ------------------------------------
    models = []
    alerts = []

    drift_score = round(abs(random.normalvariate(0.15, 0.05)), 3)

    status = "healthy"

    if drift_score > 0.20:
        status = "critical"
        alerts.append({
            "message": "Model drift exceeded threshold",
            "time": "Just now"
        })

    models.append({
        "name": "Active Model",
        "fairness": fairness_score,
        "accuracy": round(random.uniform(85, 95), 2),
        "drift": round(drift_score * 100, 2),
        "status": status
    })

    deployed_models = len(models)

    return {
        "fairness_score": fairness_score,
        "improvement": improvement,
        "active_alerts": len(alerts),
        "deployed_models": deployed_models,
        "synthetic_datasets": synthetic_count,
        "models": models,
        "alerts": alerts,
        "timestamp": datetime.utcnow().isoformat()
    }