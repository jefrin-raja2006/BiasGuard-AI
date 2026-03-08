# Synthetic Healthcare Data Generation Platform
# Quick Reference Guide

## 📊 Three Core Features

### 1. Dashboard 📈
- **Real-time Analytics**: Track synthetic data generation metrics
- **Fairness Monitoring**: AI model fairness score (94%+)
- **Drift Detection**: Identify data/concept drift in real-time
- **Alerts**: Automated fairness violation notifications
- **Location**: http://localhost:3000/

### 2. Synthetic Data Generator 🧬
- **Multiple Models**: CTGAN, TVAE, CopulaGAN
- **Configurable**: Demographic distributions
- **Batch Processing**: Generate up to 100K records
- **Secure Export**: Download synthetic datasets
- **Location**: http://localhost:3000/synthesis

### 3. Dataset Upload 📤
- **Schema Only**: No raw patient data stored
- **Privacy-First**: HIPAA-ready architecture
- **Format Support**: JSON & CSV files
- **Validation**: Automatic schema validation
- **Location**: http://localhost:3000/upload

## 🚀 Quick Start (Windows)

```bash
# Run the batch script
run.bat

# Or manual start:

# Terminal 1 - Backend
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

## 🐧 Quick Start (Mac/Linux)

```bash
# Run the shell script
chmod +x run.sh
./run.sh

# Or manual start:

# Terminal 1 - Backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

## 🐳 Docker Start

```bash
docker-compose up -d
# Access: http://localhost:3000
docker-compose down
```

## 📝 Demo Login

- **Username**: admin
- **Password**: admin

## 🔗 Important URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:3000 | Main application |
| Backend API | http://localhost:8000 | API server |
| Swagger Docs | http://localhost:8000/docs | Interactive API docs |
| ReDoc | http://localhost:8000/redoc | API documentation |
| Health Check | http://localhost:8000/health | Server status |

## 📂 Project Structure

```
HackathonProject/
├── backend/              # FastAPI + Python ML
│   ├── main.py          # FastAPI application
│   ├── models.py        # SQLAlchemy database models
│   ├── schemas.py       # Pydantic validation schemas
│   ├── routes/          # API endpoints
│   ├── requirements.txt  # Python dependencies
│   └── Dockerfile       # Container config
├── frontend/            # React.js dashboard
│   ├── src/
│   │   ├── App.jsx
│   │   ├── pages/       # Dashboard, Synthesis, Upload
│   │   └── services/    # API client
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml   # Full stack container setup
├── .env.example         # Environment template
├── README.md            # Project overview
├── SETUP.md             # Installation guide
├── ARCHITECTURE.md      # Technical design
└── run.bat / run.sh    # Quick start scripts
```

## 🔐 Security Features

✅ JWT Authentication
✅ Role-based Access Control
✅ Password Hashing (bcrypt)
✅ SQL Injection Protection
✅ CORS Security
✅ No Raw Data Storage
✅ Audit Logging
✅ Environment Variables

## 🛠️ Tech Stack

**Frontend**
- React.js 18
- Ant Design (UI Components)
- Recharts (Visualizations)
- Zustand (State Management)
- Axios (HTTP Client)

**Backend**
- FastAPI (Web Framework)
- PostgreSQL (Database)
- SQLAlchemy (ORM)
- Pydantic (Validation)

**AI/ML**
- TensorFlow/PyTorch (Training)
- GANs/VAEs (Synthetic Data)
- Fairlearn (Bias Metrics)
- SHAP (Explainability)

## 📊 API Endpoints

### Authentication
```
POST /api/auth/login
POST /api/auth/register
```

### Schema Management
```
POST /api/schema/upload
GET /api/schema/list
GET /api/schema/{id}
```

### Synthesis
```
POST /api/synthesis/generate
GET /api/synthesis/job/{id}
GET /api/synthesis/job/{id}/download
GET /api/synthesis/models
```

### Monitoring
```
GET /api/monitoring/fairness
GET /api/monitoring/drift
GET /api/monitoring/alerts
```

## 🔧 Common Commands

```bash
# Backend
cd backend
venv\Scripts\activate          # Windows activation
source venv/bin/activate       # Mac/Linux activation
pip install -r requirements.txt
python database.py             # Initialize DB
uvicorn main:app --reload      # Dev server

# Frontend
cd frontend
npm install                    # Install dependencies
npm run dev                    # Development server
npm run build                  # Production build
npm run lint                   # Linting

# Docker
docker-compose up -d           # Start all services
docker-compose down            # Stop all services
docker-compose logs -f backend # View backend logs
docker-compose logs -f frontend# View frontend logs
```

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 8000 is in use
netstat -ano | findstr :8000
# Kill process: taskkill /PID <PID> /F
```

### Frontend won't start
```bash
# Check if port 3000 is in use
netstat -ano | findstr :3000
# Kill process: taskkill /PID <PID> /F
```

### Database connection error
```bash
# Verify PostgreSQL is running
# Check DATABASE_URL in .env
# Reset database: DROP DATABASE synthetic_health_db;
```

### Dependencies not installing
```bash
# Clear cache and reinstall
pip cache purge
npm cache clean --force
```

## 📚 Documentation

- **README.md** - Project overview and features
- **SETUP.md** - Detailed installation instructions
- **ARCHITECTURE.md** - Technical design and system architecture
- **API Docs** - http://localhost:8000/docs (Swagger)

## 🎯 Next Steps

1. ✅ Start the application (run.bat or run.sh)
2. ✅ Login with demo credentials
3. ✅ Upload a dataset schema
4. ✅ Generate synthetic data
5. ✅ Monitor fairness metrics
6. ✅ Review API documentation

## 📞 Support

For issues or questions:
1. Check the documentation files
2. Review API documentation at /docs
3. Check GitHub issues (if applicable)
4. Contact development team

---

**Version**: 1.0.0
**Last Updated**: Feb 2026
**Platform**: Cross-platform (Windows, Mac, Linux)
