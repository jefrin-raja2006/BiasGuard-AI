# Setup & Installation Guide

## Prerequisites

- **Python 3.11+**
- **Node.js 18+ (LTS)**
- **PostgreSQL 15+**
- **Git**
- **Docker & Docker Compose** (optional, for containerized deployment)

## Environment Setup

### Step 1: Clone Repository

```bash
cd C:\Users\Mohamed irfan\Downloads\HackathonProject
```

### Step 2: Create .env File

```bash
cp .env.example .env
```

Edit `.env` and update:
```env
DATABASE_URL=postgresql://synthetic_user:secure_password@localhost:5432/synthetic_health_db
SECRET_KEY=your-secret-key-here
```

## Backend Setup

### Step 1: Install Python Dependencies

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
```

### Step 2: Setup PostgreSQL

```bash
# Windows (PowerShell)
# Download and install PostgreSQL from https://www.postgresql.org/download/windows/

# Or using Chocolatey:
choco install postgresql

# Create database
createdb -U postgres synthetic_health_db
```

### Step 3: Initialize Database

```bash
python database.py
```

### Step 4: Run Backend Server

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Access API docs: `http://localhost:8000/docs`

## Frontend Setup

### Step 1: Install Dependencies

```bash
cd frontend
npm install
```

### Step 2: Create Environment File

```bash
# Copy Vite default config (already included)
```

### Step 3: Run Development Server

```bash
npm run dev
```

Access application: `http://localhost:3000`

## Docker Setup (Alternative)

### Build and Run Containers

```bash
# From project root
docker-compose up -d
```

### Verify Services

```bash
docker ps
```

Should show:
- postgres (port 5432)
- backend (port 8000)
- frontend (port 3000)

### Stop Services

```bash
docker-compose down
```

## Accessing the Application

1. **Frontend**: http://localhost:3000
2. **Backend API**: http://localhost:8000
3. **API Docs (Swagger)**: http://localhost:8000/docs
4. **API Docs (ReDoc)**: http://localhost:8000/redoc
5. **Database**: localhost:5432

## Demo Credentials

- **Username**: admin
- **Password**: admin

## Troubleshooting

### PostgreSQL Connection Error

```bash
# Test connection
psql -U synthetic_user -d synthetic_health_db -h localhost
```

### Port Already in Use

```bash
# Find process using port 8000 (Backend)
netstat -ano | findstr :8000

# Find process using port 3000 (Frontend)
netstat -ano | findstr :3000

# Kill process (Windows)
taskkill /PID <PID> /F
```

### Database Error

```bash
# Reset database
psql -U postgres
DROP DATABASE synthetic_health_db;
CREATE DATABASE synthetic_health_db;
\q
python database.py
```

### Dependencies Issue

```bash
# Clear cache and reinstall
pip cache purge
pip install -r requirements.txt --force-reinstall
```

## Running Tests

### Backend

```bash
cd backend
pytest -v
```

### Frontend

```bash
cd frontend
npm run lint
```

## Building for Production

### Backend

```bash
cd backend
# Dockerfile already configured
docker build -t synthetic-health-backend .
```

### Frontend

```bash
cd frontend
npm run build
# dist/ folder contains production build
```

## Next Steps

1. ✅ Review API documentation at `/docs`
2. ✅ Test schema upload feature
3. ✅ Generate synthetic data
4. ✅ Monitor fairness metrics
5. ✅ Deploy to cloud (AWS, GCP, Azure)

## Support

For issues or questions, refer to README.md or check API documentation.
