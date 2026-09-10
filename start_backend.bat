@echo off
echo Starting NEXORA FastAPI Backend on port 8000...
cd /d "%~dp0backend"
set PYTHONPATH=%~dp0backend
"C:\Users\nomul\AppData\Local\Programs\Python\Python311\python.exe" -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
pause
