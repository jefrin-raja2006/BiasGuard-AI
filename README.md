# Synthetic Healthcare Data Generation Platform

Production-ready synthetic healthcare data generation with AI fairness monitoring.

## 🎯 Features

### 1. **Dashboard** 📊
- Real-time analytics and metrics visualization
- Fairness score tracking (94%+)
- Drift detection alerts
- Synthesis job monitoring
- Performance trends

### 2. **Synthetic Data Generator** 🧬
- Generate balanced synthetic datasets using GANs/VAEs
- Configurable demographic distributions
- Multiple model support (CTGAN, TVAE, CopulaGAN)
- Batch export functionality
- Job queue management

### 3. **Dataset Schema Upload** 📤
- Upload schema metadata (JSON/CSV only)
- **Privacy-first**: No raw patient data stored
- Automated schema validation
- Sensitive field identification
- HIPAA-ready architecture

## 🏗️ Architecture

```
Frontend (React.js)          Backend (FastAPI)          ML/Database
┌─────────────────┐          ┌──────────────┐          ┌─────────────┐
│   Dashboard     │ ◄────────│   REST API   │ ◄────────│ PostgreSQL  │
│   Synthesis     │          │              │          │             │
│   Upload        │ ───────► │  Auth        │ ────────►│ TensorFlow/ │
│   Real-time     │          │  Schema Mgmt │          │ PyTorch     │
└─────────────────┘          │  Synthesis   │          │ GANs/VAEs   │
                              │  Monitoring  │          └─────────────┘
                              └──────────────┘
```

## 🛠️ Tech Stack

- **Frontend**: React.js (Real-time dashboard)
- **Backend**: FastAPI (Secure APIs)
- **Database**: PostgreSQL (Secure storage)
- **ML**: TensorFlow/PyTorch (Model training)
- **Synthetic**: GANs/VAEs (Data generation)
- **Fairness**: Fairlearn/SHAP (Bias analysis)
- **Deployment**: Docker & Docker Compose

## 📋 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Schema Management
- `POST /api/schema/upload` - Upload schema (JSON/CSV)
- `GET /api/schema/list` - List available schemas
- `GET /api/schema/{id}` - Get schema details

### Synthetic Data Generation
- `POST /api/synthesis/generate` - Start synthesis job
- `GET /api/synthesis/job/{id}` - Get job status
- `GET /api/synthesis/job/{id}/download` - Download results
- `GET /api/synthesis/models` - List available models

### Monitoring
- `GET /api/monitoring/fairness` - Get fairness metrics
- `GET /api/monitoring/drift` - Get drift detection results
- `GET /api/monitoring/alerts` - Get system alerts

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 15+
- Docker & Docker Compose (optional)

### Development Setup

1. **Clone and navigate**
```bash
cd HackathonProject
```

2. **Backend Setup**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. **Frontend Setup**
```bash
cd ../frontend
npm install
```

4. **Environment Configuration**
```bash
cp .env.example .env
# Update .env with your database credentials
```

5. **Database Setup**
```bash
# Create PostgreSQL database
createdb synthetic_health_db
```

6. **Run Services**

Backend:
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Frontend:
```bash
cd frontend
npm run dev
```

Access the application at `http://localhost:3000`

### Docker Setup

```bash
docker-compose up -d
```

Access at `http://localhost:3000`

## 📁 Project Structure

```
HackathonProject/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── models.py            # SQLAlchemy models
│   ├── schemas.py           # Pydantic schemas
│   ├── routes/
│   │   ├── auth.py          # Authentication
│   │   ├── schema.py        # Schema management
│   │   ├── synthesis.py     # Synthetic data generation
│   │   └── monitoring.py    # Fairness & drift monitoring
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main app
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── SynthesisGenerator.jsx
│   │   │   ├── DatasetUpload.jsx
│   │   │   └── Login.jsx
│   │   ├── services/
│   │   │   └── api.js       # Axios API client
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── Dockerfile
├── docker-compose.yml
├── .env.example
└── README.md
```

## 🔐 Security Features

- ✅ JWT authentication
- ✅ Role-based access control
- ✅ SQL injection protection
- ✅ CORS enabled
- ✅ Password hashing (bcrypt)
- ✅ Environment variable management
- ✅ No raw patient data storage
- ✅ Audit logging

## 📊 Data Pipeline

```
Schema Upload
    ↓
Validation & Metadata Extraction
    ↓
Synthetic Data Generation (GANs/VAEs)
    ↓
Fairness Analysis (Fairlearn/SHAP)
    ↓
Drift Detection
    ↓
Secure Export
```

## 🧪 Testing

Backend:
```bash
pytest backend/
```

Frontend:
```bash
npm run lint
```

## 🎓 Demo Credentials

- **Username**: admin
- **Password**: admin

## 📝 API Documentation

Swagger UI: `http://localhost:8000/docs`
ReDoc: `http://localhost:8000/redoc`

## 🤝 Contributing

1. Create a feature branch
2. Commit changes
3. Push to branch
4. Create Pull Request

## 📄 License

Apache 2.0

## 📞 Support

For issues or questions, create an issue in the repository.
