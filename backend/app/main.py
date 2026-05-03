from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.api.routes import resume
from app.core.config import settings
from app.core.database import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    print(f"✅ ResumeAI backend running — {settings.APP_NAME} v{settings.VERSION}")
    yield


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    description="AI Resume Analyzer + Job Matcher API",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resume.router, prefix="/api/resume", tags=["Resume"])


@app.get("/api/health", tags=["Health"])
async def health():
    return {
        "status": "online",
        "app": settings.APP_NAME,
        "version": settings.VERSION,
    }
