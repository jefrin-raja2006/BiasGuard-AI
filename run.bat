@echo off
REM Quick Start Script for SyntheticHealth Platform

echo.
echo ========================================
echo   SyntheticHealth Platform - Quick Start
echo ========================================
echo.

REM Check if backend venv exists
if not exist "backend\venv" (
    echo Creating Python virtual environment...
    cd backend
    python -m venv venv
    call venv\Scripts\activate
    echo Installing Python dependencies...
    pip install -r requirements.txt
    cd ..
) else (
    echo Python environment already exists
)

REM Check if node_modules exists
if not exist "frontend\node_modules" (
    echo Creating frontend dependencies...
    cd frontend
    npm install
    cd ..
) else (
    echo Frontend dependencies already exist
)

echo.
echo ========================================
echo   Starting Services
echo ========================================
echo.

echo Starting Backend (FastAPI on port 8000)...
start cmd /k "cd backend && venv\Scripts\activate && uvicorn main:app --reload --host 0.0.0.0 --port 8000"

echo.
timeout /t 3 /nobreak

echo Starting Frontend (React on port 3000)...
start cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo   Services Starting...
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo.
echo Demo Credentials:
echo Username: admin
echo Password: admin
echo.
echo Press any key to continue...
pause
