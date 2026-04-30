import re
from app.services.parser import SKILLS_DB

WEIGHTS = {
    "skills":     35,
    "experience": 20,
    "education":  15,
    "formatting": 20,
    "keywords":   10,
}

EXPERIENCE_THRESHOLDS = [
    (10, 1.0), (5, 0.85), (3, 0.70), (1, 0.50), (0, 0.25),
]

EDUCATION_SCORES = {
    "PhD": 1.0, "M.Tech": 0.95, "M.E": 0.95, "MBA": 0.90,
    "M.Sc": 0.90, "MCA": 0.85, "B.Tech": 0.80, "B.E": 0.80,
    "B.Sc": 0.75, "BCA": 0.70, "B.A": 0.65,
    "Associate's": 0.55, "High School": 0.35, "Not specified": 0.20,
}

ACTION_VERBS = {
    "achieved", "built", "created", "delivered", "designed",
    "developed", "enhanced", "implemented", "improved", "increased",
    "launched", "led", "managed", "optimized", "reduced",
    "streamlined", "architected", "automated", "deployed", "scaled",
    "collaborated", "mentored", "shipped", "integrated", "migrated",
    "analysed", "analyzed", "coordinated", "facilitated", "negotiated",
    "presented", "researched", "resolved", "spearheaded", "transformed",
}

IMPACT_WORDS = {
    "revenue", "performance", "efficiency", "growth", "cost",
    "users", "customers", "team", "product", "system",
    "infrastructure", "pipeline", "platform", "solution", "process",
    "stakeholder", "budget", "savings", "profit", "delivery",
}

RESUME_SECTIONS = [
    r"\bsummary\b|\bobjective\b|\bprofile\b",
    r"\bexperience\b|\bwork history\b|\bemployment\b",
    r"\beducation\b|\bacademic\b|\bqualification",
    r"\bskills\b|\btechnical skills\b|\bcompetencies\b",
    r"\bprojects?\b",
    r"\bcertif",
]

# ── Role-specific skills ─────────────────────────────────
ROLE_SKILLS_MAP = {
    "business analyst":         ["sql", "excel", "tableau", "power bi", "agile", "jira",
                                  "scrum", "data analysis", "python", "stakeholder management",
                                  "requirements gathering", "documentation", "process improvement"],
    "data analyst":             ["sql", "python", "excel", "tableau", "power bi", "pandas",
                                  "numpy", "statistics", "r", "data analysis"],
    "frontend developer":       ["react", "javascript", "typescript", "html", "css",
                                  "tailwind", "git", "next.js", "vite", "webpack"],
    "backend developer":        ["python", "node.js", "postgresql", "rest api", "docker",
                                  "git", "fastapi", "django", "mysql", "microservices"],
    "full stack developer":     ["react", "node.js", "python", "postgresql", "docker",
                                  "git", "rest api", "typescript", "mongodb"],
    "software engineer":        ["python", "java", "git", "sql", "docker",
                                  "system design", "rest api", "agile", "data structures"],
    "data scientist":           ["python", "machine learning", "pandas", "numpy",
                                  "scikit-learn", "sql", "statistics", "tensorflow", "pytorch"],
    "machine learning engineer":["python", "tensorflow", "pytorch", "scikit-learn",
                                  "docker", "aws", "nlp", "computer vision"],
    "devops engineer":          ["docker", "kubernetes", "aws", "ci/cd", "terraform",
                                  "linux", "bash", "github actions", "ansible"],
    "product manager":          ["agile", "jira", "scrum", "sql", "figma",
                                  "data analysis", "stakeholder management", "a/b testing"],
    "ux designer":              ["figma", "user research", "wireframing", "prototyping",
                                  "adobe xd", "html", "css", "usability testing"],
    "project manager":          ["agile", "scrum", "jira", "risk management",
                                  "stakeholder management", "documentation", "ms project"],
    "cloud architect":          ["aws", "azure", "gcp", "terraform", "kubernetes",
                                  "docker", "system design", "ci/cd"],
    "financial analyst":        ["excel", "sql", "tableau", "power bi", "python",
                                  "financial modeling", "forecasting", "budgeting"],
    "marketing manager":        ["seo", "google analytics", "social media", "hubspot",
                                  "content marketing", "crm", "a/b testing", "email marketing"],
    "sales executive":          ["crm", "salesforce", "lead generation", "negotiation",
                                  "account management", "b2b", "pipeline management"],
    "mobile developer":         ["swift", "kotlin", "flutter", "react", "rest api",
                                  "git", "ios", "android"],
}


def _normalize_role(role: str) -> str:
    return role.lower().strip()


def _get_role_skills(target_job: str) -> list:
    """Return expected skills for a given target job role."""
    target_lower = _normalize_role(target_job)
    for key, skills in ROLE_SKILLS_MAP.items():
        if key in target_lower or target_lower in key:
            return skills
    for key, skills in ROLE_SKILLS_MAP.items():
        words = key.split()
        if any(w in target_lower for w in words if len(w) > 3):
            return skills
    return []


def score_skills(skills_found: list) -> float:
    count = len(skills_found)
    if count >= 20: return 1.0
    if count >= 15: return 0.90
    if count >= 10: return 0.75
    if count >= 6:  return 0.60
    if count >= 3:  return 0.40
    return 0.15


def score_experience(years: int) -> float:
    for threshold, score in EXPERIENCE_THRESHOLDS:
        if years >= threshold:
            return score
    return 0.25


def score_education(education: str) -> float:
    return EDUCATION_SCORES.get(education, 0.20)


def score_formatting(text: str) -> float:
    text_lower = text.lower()
    found      = sum(1 for p in RESUME_SECTIONS if re.search(p, text_lower))
    ratio      = found / len(RESUME_SECTIONS)
    has_bullets = bool(re.search(r"[•\-\*]\s+\w", text))
    word_count  = len(text.split())
    good_length = 200 <= word_count <= 1200
    has_contact = bool(re.search(r"@|\+?\d{10}", text))
    bonus = (0.05 if has_bullets else 0) + \
            (0.05 if good_length else 0) + \
            (0.05 if has_contact else 0)
    return min(1.0, ratio * 0.85 + bonus)


def score_keywords(text: str) -> float:
    text_lower = text.lower()
    words      = set(re.findall(r"\b\w+\b", text_lower))
    action_hits = len(ACTION_VERBS & words)
    impact_hits = len(IMPACT_WORDS & words)
    return (min(1.0, action_hits / 6) * 0.6) + (min(1.0, impact_hits / 5) * 0.4)


def calculate_ats_score(
    text: str,
    skills_found: list,
    experience_years: int,
    education: str,
) -> dict:
    breakdown = {
        "skills":     round(score_skills(skills_found)         * WEIGHTS["skills"]),
        "experience": round(score_experience(experience_years) * WEIGHTS["experience"]),
        "education":  round(score_education(education)         * WEIGHTS["education"]),
        "formatting": round(score_formatting(text)             * WEIGHTS["formatting"]),
        "keywords":   round(score_keywords(text)               * WEIGHTS["keywords"]),
    }
    return {
        "score":     min(100, sum(breakdown.values())),
        "breakdown": breakdown,
        "weights":   WEIGHTS,
    }


def get_missing_skills(
    skills_found: list,
    job_description: str = "",
    target_job: str = "",
    top_n: int = 6,
) -> list:
    """
    Returns only the most important missing skills for the target role.
    Max 6 — quality over quantity. Only show skills that truly matter.
    """
    found_set = set(s.lower() for s in skills_found)
    missing   = []

    # Priority 1 — target job core skills
    if target_job.strip():
        role_skills = _get_role_skills(target_job)
        if role_skills:
            # Only return top-tier missing skills
            # Skills that appear first in the role map are highest priority
            for skill in role_skills:
                if skill not in found_set:
                    missing.append(skill)
                if len(missing) >= top_n:
                    break

    # Priority 2 — job description keywords
    if not missing and job_description.strip():
        jd_lower  = job_description.lower()
        jd_skills = []
        for skill in SKILLS_DB:
            pattern = r"\b" + re.escape(skill) + r"\b"
            if re.search(pattern, jd_lower) and skill not in found_set:
                jd_skills.append(skill)
        missing = sorted(jd_skills)[:top_n]

    # Priority 3 — minimal fallback — only if nothing else
    if not missing:
        # Don't overwhelm — just 3-4 genuinely useful ones
        fallback = [
            s for s in ["git", "sql", "agile", "docker"]
            if s not in found_set
        ]
        missing = fallback[:4]

    return missing[:top_n]


def generate_suggestions(
    text: str,
    skills_found: list,
    missing_skills: list,
    ats_score: int,
    experience_years: int,
    education: str,
    target_job: str = "",
) -> list:
    """Generate actionable improvement suggestions tailored to target_job."""
    suggestions = []
    text_lower  = text.lower()
    word_count  = len(text.split())

    # Role-specific opening suggestion
    if target_job.strip():
        role_skills = _get_role_skills(target_job)
        found_set   = set(s.lower() for s in skills_found)
        matched     = [s for s in role_skills if s in found_set]
        coverage    = round(len(matched) / max(len(role_skills), 1) * 100)

        if coverage < 40:
            suggestions.append(
                f"Your resume covers only {coverage}% of key skills expected for a {target_job} role. "
                f"Focus on adding: {', '.join(missing_skills[:4])}."
            )
        elif coverage < 70:
            suggestions.append(
                f"Good foundation for {target_job} ({coverage}% skill coverage). "
                f"Strengthen your profile by adding: {', '.join(missing_skills[:3])}."
            )
        else:
            suggestions.append(
                f"Strong skill alignment with {target_job} ({coverage}% coverage). "
                f"Polish your resume with quantified achievements to stand out."
            )

    # Resume length
    if word_count < 300:
        suggestions.append(
            "Your resume is too brief. Expand your experience, projects, and skills to at least 400–600 words."
        )
    elif word_count > 1200:
        suggestions.append(
            "Your resume is too long. Trim it to 1–2 pages focusing on your most impactful work."
        )

    # Skills count
    if len(skills_found) < 8:
        suggestions.append(
            "Add more relevant technical skills. ATS systems scan for keyword density — aim for 10–15 skills."
        )

    # Missing skills callout — only if genuinely missing important ones
    if missing_skills:
        top_missing = ", ".join(missing_skills[:3])
        suggestions.append(
            f"Consider adding these key skills for {target_job or 'your target role'} "
            f"if you have experience with them: {top_missing}."
        )

    # Action verbs
    words       = set(re.findall(r"\b\w+\b", text_lower))
    action_hits = len(ACTION_VERBS & words)
    if action_hits < 4:
        suggestions.append(
            "Use strong action verbs like 'Developed', 'Optimized', 'Led', 'Delivered' to describe your work. "
            "This significantly improves ATS ranking."
        )

    # Quantified metrics
    if not re.search(r"\d+%|\$\d+|\d+x|\d+\s*(users|customers|engineers|team|clients)", text_lower):
        suggestions.append(
            "Quantify your achievements — e.g. 'Improved efficiency by 30%' or 'Managed a team of 6'. "
            "Numbers make your resume stand out."
        )

    # Summary section
    if not re.search(r"\bsummary\b|\bobjective\b|\bprofile\b", text_lower):
        suggestions.append(
            "Add a professional summary at the top — 3–4 lines highlighting your role, years of experience, and top strengths."
        )

    # Projects section
    if not re.search(r"\bproject", text_lower):
        suggestions.append(
            "Include a Projects section showcasing relevant work — especially important for early-career candidates."
        )

    # LinkedIn / GitHub
    if not re.search(r"linkedin\.com|github\.com", text_lower):
        suggestions.append(
            "Add your LinkedIn and GitHub profile URLs — recruiters almost always verify these."
        )

    # Certifications
    if not re.search(r"\bcertif", text_lower):
        suggestions.append(
            "Add relevant certifications if you have any — they boost ATS score and recruiter confidence significantly."
        )

    # Low ATS
    if ats_score < 50:
        suggestions.append(
            "Your ATS score is low. Use standard section headings, avoid tables and columns, "
            "and ensure your resume is in plain readable text format."
        )

    return suggestions[:8]