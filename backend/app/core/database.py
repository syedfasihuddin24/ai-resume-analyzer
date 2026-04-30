from sqlalchemy import create_engine, Column, Integer, String, Float, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
from app.core.config import settings

engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False},
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# ── Models ──────────────────────────────────────────────
class ResumeAnalysis(Base):
    __tablename__ = "resume_analyses"

    id               = Column(Integer, primary_key=True, index=True)
    filename         = Column(String(255), nullable=False)
    candidate_name   = Column(String(255), default="Unknown")
    ats_score        = Column(Float, default=0.0)
    job_match        = Column(Float, default=0.0)
    experience_years = Column(Integer, default=0)
    education        = Column(String(255), default="")
    skills_found     = Column(Text, default="")   # JSON string
    missing_skills   = Column(Text, default="")   # JSON string
    suggestions      = Column(Text, default="")   # JSON string
    job_title        = Column(String(255), default="General Role")
    created_at       = Column(DateTime, default=datetime.utcnow)


def init_db():
    Base.metadata.create_all(bind=engine)
    print("✅ Database initialized")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()