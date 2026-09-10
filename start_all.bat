@echo off
echo ============================================================
echo Starting NEXORA: Intelligent multiagent for business planning startup
echo Tagline: "From Capital to Business."
echo ============================================================
start "NEXORA Backend (FastAPI)" cmd /c "%~dp0start_backend.bat"
timeout /t 2 /nobreak >nul
start "NEXORA Frontend (React Vite)" cmd /c "%~dp0start_frontend.bat"
echo Both services launched!
echo - Backend API: http://localhost:8000
echo - Swagger Docs: http://localhost:8000/docs
echo - Frontend Web App: http://localhost:3000
echo ============================================================
