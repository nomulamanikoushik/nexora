# NEXORA: Intelligent multiagent for business planning startup

---

## 1. Production Docker Deployment

NEXORA includes multi-stage Dockerfiles and a unified `docker-compose.yml` for zero-configuration container deployment.

### Architecture in Docker
- **`nexora_frontend`**: Production-optimized Nginx container serving the compiled React bundle on port `3000`. Proxies `/api` traffic internally to the backend.
- **`nexora_backend`**: FastAPI application container running on port `8000`.
- **`nexora_postgres`**: PostgreSQL 16 database on port `5432` with persistent data volume `postgres_data`.

### Deployment Steps
```bash
# 1. Clone or navigate to the project directory
cd nexora

# 2. Copy and configure environment variables
cp .env.example .env

# 3. Launch the containerized stack
docker-compose up --build -d

# 4. Verify running containers
docker-compose ps
```

Access:
- Web App: `http://<server-ip>:3000`
- API & Docs: `http://<server-ip>:8000/docs`

---

## 2. Bare-Metal Linux (Ubuntu / Debian) Deployment

### Prerequisites
```bash
sudo apt update
sudo apt install -y python3.11 python3.11-venv nodejs npm nginx postgresql
```

### Backend Service (Systemd)
Create `/etc/systemd/system/nexora-backend.service`:
```ini
[Unit]
Description=NEXORA FastAPI Backend Service
After=network.target

[Service]
User=www-data
WorkingDirectory=/var/www/nexora/backend
Environment="PYTHONPATH=/var/www/nexora/backend"
ExecStart=/var/www/nexora/backend/venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8000 --workers 4
Restart=always

[Install]
WantedBy=multi-user.target
```

### Frontend Web Service (Nginx)
```nginx
server {
    listen 80;
    server_name nexora.yourdomain.com;

    root /var/www/nexora/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header Connection '';
        proxy_http_version 1.1;
        chunked_transfer_encoding off;
        proxy_buffering off;
        proxy_cache off;
    }
}
```
*Note: Disabling proxy buffering on `/api` is critical for real-time Server-Sent Events (SSE) streaming.*
