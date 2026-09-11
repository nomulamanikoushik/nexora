import os
from typing import List
from pydantic_settings import BaseSettings

_BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
_DEFAULT_DB = os.path.join(_BASE_DIR, "nexora.db").replace("\\", "/")

_DEFAULT_CORS = [
    "https://nomulamanikoushik.github.io",
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    "http://localhost:8000",
    "http://127.0.0.1:8000"
]
_ENV_CORS = os.getenv("CORS_ORIGINS")
_PARSED_CORS = [o.strip() for o in _ENV_CORS.split(",") if o.strip()] if _ENV_CORS else _DEFAULT_CORS

class Settings(BaseSettings):
    PROJECT_NAME: str = "NEXORA: Intelligent multiagent for business planning startup"
    TAGLINE: str = "From Capital to Business."
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    SECRET_KEY: str = os.getenv("SECRET_KEY", "nexora_super_secret_jwt_key_development_change_in_production_2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///{_DEFAULT_DB}")
    
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    DEFAULT_LLM_PROVIDER: str = os.getenv("DEFAULT_LLM_PROVIDER", "auto")
    
    CORS_ORIGINS: List[str] = _PARSED_CORS

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
