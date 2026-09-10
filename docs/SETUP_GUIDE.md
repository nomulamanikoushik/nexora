# NEXORA: Intelligent multiagent for business planning startup

**Project**: NEXORA ? Intelligent Multi-Agent for Business Startup Planning  
**Tagline**: ?From Capital to Business.?

---

## 1. Quick Local Start (Zero Setup Mode)

NEXORA comes configured with SQLite out of the box and an intelligent benchmark simulation engine that runs immediately without needing external API keys.

### A. Start Backend Server
```bash
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
API runs at `http://localhost:8000`  
Swagger Documentation: `http://localhost:8000/docs`

### B. Start Frontend Development Server
```bash
cd frontend
npm run dev
```
Web App runs at `http://localhost:3000`

---

## 2. Docker Compose Deployment (Full Production Mode)

Run with PostgreSQL and production-built React container:
```bash
docker-compose up --build
```
This launches:
- **`nexora-backend`**: FastAPI container on port 8000
- **`nexora-frontend`**: Production Nginx container serving Vite build on port 3000
- **`nexora-db`**: PostgreSQL 16 container with persistent volume

---

## 3. Running Backend Automated Tests
```bash
cd backend
pytest tests -v
```
All 7 unit and end-to-end tests verify the health endpoints, sector benchmarks, 13 agents, critic loop, and What-If simulation.
