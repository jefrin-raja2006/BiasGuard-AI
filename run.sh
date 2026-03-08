#!/bin/bash

# Quick Start Script for SyntheticHealth Platform (Mac/Linux)

echo ""
echo "========================================"
echo "   SyntheticHealth Platform - Quick Start"
echo "========================================"
echo ""

# Check if backend venv exists
if [ ! -d "backend/venv" ]; then
    echo "Creating Python virtual environment..."
    cd backend
    python3 -m venv venv
    source venv/bin/activate
    echo "Installing Python dependencies..."
    pip install -r requirements.txt
    cd ..
else
    echo "Python environment already exists"
fi

# Check if node_modules exists
if [ ! -d "frontend/node_modules" ]; then
    echo "Creating frontend dependencies..."
    cd frontend
    npm install
    cd ..
else
    echo "Frontend dependencies already exist"
fi

echo ""
echo "========================================"
echo "   Starting Services"
echo "========================================"
echo ""

echo "Starting Backend (FastAPI on port 8000)..."
cd backend
source venv/bin/activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
cd ..

sleep 2

echo "Starting Frontend (React on port 3000)..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "========================================"
echo "   Services Starting..."
echo "========================================"
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:8000"
echo "API Docs: http://localhost:8000/docs"
echo ""
echo "Demo Credentials:"
echo "Username: admin"
echo "Password: admin"
echo ""
echo "To stop services:"
echo "kill $BACKEND_PID"
echo "kill $FRONTEND_PID"
echo ""

# Keep script running
wait
