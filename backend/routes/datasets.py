from fastapi import APIRouter
import os

router = APIRouter()

@router.get("/")
def list_datasets():

    if not os.path.exists("uploads"):
        return []

    files = os.listdir("uploads")

    return [
        {"name": f}
        for f in files
        if f.endswith(".csv")
    ]