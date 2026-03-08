# Architecture & Technical Design

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      Client Layer                                │
│  React.js Dashboard | Real-time Charts | User Interface         │
└──────────────────────┬──────────────────────────────────────────┘
                       │ HTTP/REST
┌──────────────────────▼──────────────────────────────────────────┐
│                      API Layer (FastAPI)                          │
│  Authentication | Schema Management | Synthesis | Monitoring    │
└──────────────────────┬──────────────────────────────────────────┘
                       │
    ┌──────────────────┼──────────────────┐
    │                  │                  │
    ▼                  ▼                  ▼
┌────────────┐   ┌──────────────┐   ┌──────────────┐
│ PostgreSQL │   │ ML Layer     │   │ Cache Layer  │
│ Database   │   │ TF/PyTorch   │   │ Redis        │
│ (Schemas)  │   │ GANs/VAEs    │   │ (Optional)   │
└────────────┘   └──────────────┘   └──────────────┘
```

## Data Flow

### 1. Schema Upload Flow
```
User Upload
    ↓
Frontend: DatasetUpload.jsx
    ↓
API: /api/schema/upload (POST)
    ↓
Validation (JSON/CSV)
    ↓
Store in DB (No raw data)
    ↓
Return schema metadata
```

### 2. Synthetic Data Generation Flow
```
User Request
    ↓
Frontend: SynthesisGenerator.jsx
    ↓
API: /api/synthesis/generate (POST)
    ↓
Background Task (Async)
    ↓
Load Schema from DB
    ↓
Initialize Model (CTGAN/TVAE)
    ↓
Generate synthetic records
    ↓
Apply fairness constraints
    ↓
Store metadata in DB
    ↓
Return job status & download link
```

### 3. Fairness Monitoring Flow
```
Generated Data
    ↓
Fairness Analyzer
    ├─ SHAP (Feature importance)
    ├─ Fairlearn (Bias metrics)
    └─ Drift Detection
    ↓
Compute metrics
    ↓
Store in monitoring_results
    ↓
Trigger alerts if threshold exceeded
    ↓
Display in Dashboard
```

## Component Architecture

### Frontend Components
```
App.jsx (Main)
├── Login.jsx
│   └── Authentication form
├── MainLayout.jsx
│   ├── Sidebar (Navigation)
│   ├── Header (User info)
│   └── Content (Routes)
│       ├── Dashboard.jsx
│       │   ├── StatsCards
│       │   ├── Charts
│       │   ├── AlertsTable
│       │   └── SynthesisJobsTable
│       ├── SynthesisGenerator.jsx
│       │   ├── GenerationForm
│       │   ├── StatusTracker
│       │   ├── JobsTable
│       │   └── ModelsShowcase
│       └── DatasetUpload.jsx
│           ├── UploadForm
│           ├── SchemaList
│           └── ProtectionFeatures
└── services/
    └── api.js (Axios client)
```

### Backend Structure
```
main.py (FastAPI app)
├── routes/
│   ├── auth.py
│   │   ├── POST /login
│   │   └── POST /register
│   ├── schema.py
│   │   ├── POST /upload
│   │   ├── GET /list
│   │   └── GET /{id}
│   ├── synthesis.py
│   │   ├── POST /generate
│   │   ├── GET /job/{id}
│   │   ├── GET /job/{id}/download
│   │   └── GET /models
│   └── monitoring.py
│       ├── GET /fairness
│       ├── GET /drift
│       └── GET /alerts
├── models.py (SQLAlchemy)
├── schemas.py (Pydantic)
├── config.py (Settings)
├── utils.py (Utilities)
└── database.py (Init)
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR UNIQUE,
    email VARCHAR UNIQUE,
    hashed_password VARCHAR,
    role VARCHAR DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Schemas Table
```sql
CREATE TABLE schemas (
    id SERIAL PRIMARY KEY,
    user_id INTEGER FOREIGN KEY,
    name VARCHAR,
    schema_definition JSONB,
    attributes JSONB,
    sensitive_fields JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### SynthesisJobs Table
```sql
CREATE TABLE synthesis_jobs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER FOREIGN KEY,
    schema_id INTEGER FOREIGN KEY,
    job_name VARCHAR,
    status VARCHAR DEFAULT 'pending',
    num_records INTEGER,
    demographic_config JSONB,
    output_path VARCHAR,
    created_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    error_message VARCHAR
);
```

### MonitoringResults Table
```sql
CREATE TABLE monitoring_results (
    id SERIAL PRIMARY KEY,
    synthesis_job_id INTEGER FOREIGN KEY,
    fairness_metrics JSONB,
    drift_metrics JSONB,
    model_predictions JSONB,
    alerts JSONB,
    timestamp TIMESTAMP DEFAULT NOW()
);
```

## API Endpoints Summary

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| POST | /api/auth/login | User login | No |
| POST | /api/auth/register | User registration | No |
| POST | /api/schema/upload | Upload schema | Yes |
| GET | /api/schema/list | List schemas | Yes |
| GET | /api/schema/{id} | Get schema details | Yes |
| POST | /api/synthesis/generate | Start generation | Yes |
| GET | /api/synthesis/job/{id} | Get job status | Yes |
| GET | /api/synthesis/models | List models | Yes |
| GET | /api/monitoring/fairness | Get fairness metrics | Yes |
| GET | /api/monitoring/drift | Get drift detection | Yes |

## Security Architecture

### Authentication
- JWT tokens with 24-hour expiry
- Password hashing with bcrypt
- Role-based access control (RBAC)

### Data Protection
- No raw patient data storage
- Schema metadata only
- PostgreSQL encryption
- Audit logging

### API Security
- CORS enabled for whitelisted origins
- Request validation with Pydantic
- SQL injection protection via ORM
- Rate limiting (recommended for production)

## Performance Optimization

### Caching Strategy
- Cache schema metadata (1 hour)
- Cache fairness metrics (15 minutes)
- Cache available models (24 hours)

### Database Optimization
- Indexed user_id, schema_id fields
- JSONB for flexible schema storage
- Connection pooling

### Frontend Optimization
- Lazy loading routes
- Code splitting
- Image optimization
- Virtual scrolling for tables

## Scalability Considerations

### Horizontal Scaling
- Stateless FastAPI instances
- Load balancer (Nginx/HAProxy)
- Session storage in PostgreSQL

### Vertical Scaling
- Increase CPU/RAM
- Optimize batch processing
- Use background workers (Celery)

### Database Scaling
- Read replicas for monitoring queries
- Partitioning synthesis_jobs by date
- Archive old monitoring results

## Monitoring & Observability

### Metrics to Track
- API response times
- Database query times
- Fairness score trends
- Drift detection alerts
- Model accuracy degradation

### Logging
- Structured logging (JSON)
- Centralized log aggregation
- Error tracking (Sentry)

### Deployment Checklist
- [ ] Environment variables set
- [ ] Database migrations run
- [ ] SSL certificates configured
- [ ] CORS settings verified
- [ ] Rate limiting enabled
- [ ] Monitoring dashboards setup
- [ ] Backup strategy verified
- [ ] Security audit completed
