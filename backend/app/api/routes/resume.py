import json
import re
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
import io

from app.core.config import settings
from app.core.database import get_db, ResumeAnalysis
from app.services.parser import (
    extract_text, extract_name, extract_email,
    extract_phone, extract_experience_years,
    extract_education, extract_skills,
)
from app.services.ats_scorer import (
    calculate_ats_score, get_missing_skills, generate_suggestions,
)
from app.services.skill_matcher import match_job_role, get_role_recommendations
from app.services.report_gen import generate_pdf_report

router = APIRouter()

ALLOWED_TYPES = {
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}
MAX_BYTES = settings.MAX_FILE_SIZE_MB * 1024 * 1024


def _clean(text: str) -> str:
    """Remove non-latin1 and special characters that crash ReportLab."""
    if not text:
        return ""
    # Remove special symbols like §, ©, ®, etc.
    text = re.sub(r'[^\x00-\x7F]+', ' ', text)
    # Encode safely
    return text.encode("latin-1", errors="replace").decode("latin-1").strip()


def _clean_list(lst: list) -> list:
    return [_clean(str(i)) for i in lst if i]


@router.post("/analyze")
async def analyze_resume(
    file: UploadFile = File(...),
    job_description: str = Form(default=""),
    target_job: str = Form(default=""),
    db: Session = Depends(get_db),
):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported.")

    file_bytes = await file.read()

    if len(file_bytes) > MAX_BYTES:
        raise HTTPException(status_code=400, detail=f"File too large. Max size is {settings.MAX_FILE_SIZE_MB} MB.")

    if len(file_bytes) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    try:
        resume_text = extract_text(file_bytes, file.filename)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Failed to extract text: {str(e)}")

    if not resume_text or len(resume_text.strip()) < 50:
        raise HTTPException(status_code=422, detail="Could not extract enough text. Ensure the file is not scanned or image-based.")

    candidate_name   = extract_name(resume_text)
    email            = extract_email(resume_text)
    phone            = extract_phone(resume_text)
    experience_years = extract_experience_years(resume_text)
    education        = extract_education(resume_text)
    skills_found     = extract_skills(resume_text)

    ats_result    = calculate_ats_score(
        text=resume_text,
        skills_found=skills_found,
        experience_years=experience_years,
        education=education,
    )
    ats_score     = ats_result["score"]
    ats_breakdown = ats_result["breakdown"]
    ats_weights   = ats_result["weights"]

    match_result = match_job_role(
        resume_text=resume_text,
        skills_found=skills_found,
        job_description=job_description,
        target_job=target_job,
    )
    best_role            = match_result["best_role"]
    job_match            = match_result["match_score"]
    role_scores          = match_result["role_scores"]
    role_recommendations = get_role_recommendations(role_scores, target_job=target_job)

    missing_skills = get_missing_skills(
        skills_found=skills_found,
        job_description=job_description,
        target_job=target_job,
    )

    suggestions = generate_suggestions(
        text=resume_text,
        skills_found=skills_found,
        missing_skills=missing_skills,
        ats_score=ats_score,
        experience_years=experience_years,
        education=education,
        target_job=target_job,
    )

    record = ResumeAnalysis(
        filename=file.filename,
        candidate_name=candidate_name,
        ats_score=ats_score,
        job_match=job_match,
        experience_years=experience_years,
        education=education,
        skills_found=json.dumps(skills_found),
        missing_skills=json.dumps(missing_skills),
        suggestions=json.dumps(suggestions),
        job_title=target_job or best_role,
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    return {
        "id":                   record.id,
        "candidate_name":       candidate_name,
        "email":                email,
        "phone":                phone,
        "job_title":            target_job or best_role,
        "target_job":           target_job,
        "ats_score":            ats_score,
        "ats_breakdown":        ats_breakdown,
        "ats_weights":          ats_weights,
        "job_match":            round(job_match),
        "experience_years":     experience_years,
        "education":            education,
        "skills_found":         skills_found,
        "missing_skills":       missing_skills,
        "suggestions":          suggestions,
        "role_recommendations": role_recommendations,
    }


@router.post("/report")
async def download_report(data: dict):
    safe_data = {
        "candidate_name":   _clean(str(data.get("candidate_name", "Candidate"))),
        "job_title":        _clean(str(data.get("job_title", data.get("target_job", "General Role")))),
        "ats_score":        int(data.get("ats_score", 0)),
        "job_match":        int(data.get("job_match", 0)),
        "experience_years": int(data.get("experience_years", 0)),
        "education":        _clean(str(data.get("education", "Not specified"))),
        "skills_found":     _clean_list(data.get("skills_found", [])),
        "missing_skills":   _clean_list(data.get("missing_skills", [])),
        "suggestions":      _clean_list(data.get("suggestions", [])),
        "ats_breakdown":    dict(data.get("ats_breakdown", {})),
        "ats_weights":      dict(data.get("ats_weights", {})),
    }

    try:
        pdf_bytes = generate_pdf_report(safe_data)
    except Exception as e:
        print(f"PDF generation error: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Report generation failed: {str(e)}",
        )

    # Clean filename — remove special chars
    raw_name = safe_data['candidate_name'].replace(' ', '_')
    filename = f"ResumeAI_{raw_name}_Report.pdf"

    return StreamingResponse(
        io.BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
            "Access-Control-Expose-Headers": "Content-Disposition",
        },
    )


@router.get("/history")
async def get_history(limit: int = 10, db: Session = Depends(get_db)):
    records = db.query(ResumeAnalysis).order_by(
        ResumeAnalysis.created_at.desc()
    ).limit(limit).all()
    return [
        {
            "id":             r.id,
            "filename":       r.filename,
            "candidate_name": r.candidate_name,
            "ats_score":      r.ats_score,
            "job_match":      r.job_match,
            "job_title":      r.job_title,
            "created_at":     r.created_at.isoformat(),
        }
        for r in records
    ]