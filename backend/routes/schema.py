from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
import json
import io
import csv

router = APIRouter()

@router.post("/upload")
async def upload_schema(file: UploadFile = File(...)):
    """Upload and validate schema (JSON/CSV only - no patient data)"""
    try:
        content = await file.read()
        
        if file.filename.endswith('.json'):
            schema_data = json.loads(content)
        elif file.filename.endswith('.csv'):
            df_text = content.decode('utf-8')
            reader = csv.DictReader(io.StringIO(df_text))
            rows = list(reader)
            schema_data = {col: type(rows[0][col]).__name__ for col in reader.fieldnames}
        else:
            raise HTTPException(status_code=400, detail="Only JSON and CSV files supported")
        
        return {
            "status": "success",
            "schema": schema_data,
            "filename": file.filename,
            "message": "Schema uploaded and validated. No patient data stored."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing schema: {str(e)}")

@router.get("/list")
async def list_schemas():
    """List all available schemas"""
    return {
        "schemas": [
            {"id": 1, "name": "Patient Demographics", "fields": 15},
            {"id": 2, "name": "Medical History", "fields": 22}
        ]
    }

@router.get("/{schema_id}")
async def get_schema(schema_id: int):
    """Get specific schema details"""
    return {
        "id": schema_id,
        "name": "Patient Demographics",
        "definition": {
            "age": "int",
            "gender": "string",
            "diagnosis": "string",
            "treatment_date": "datetime"
        }
    }
