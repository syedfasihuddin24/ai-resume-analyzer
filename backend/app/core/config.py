from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    APP_NAME: str = "ResumeAI"
    VERSION: str = "1.0.0"
    DEBUG: bool = True

    # CORS — allow local dev + production frontend
    ALLOWED_ORIGINS: List[str] = [
    "http://localhost:5173",
    "http://localhost:4173",
    "http://127.0.0.1:5173",
    "https://ai-resume-analyzer-kohl-eight.vercel.app",
    "https://*.vercel.app",
    ]

    # File upload
    MAX_FILE_SIZE_MB: int = 10
    UPLOAD_DIR: str = "uploads"

    # Database
    DATABASE_URL: str = "sqlite:///./resumeai.db"

    # NLP
    SPACY_MODEL: str = "en_core_web_sm"

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

# Ensure upload directory exists
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
