import re
import io
import pdfplumber
import docx
import spacy
from app.core.config import settings

try:
    nlp = spacy.load(settings.SPACY_MODEL)
except OSError:
    import subprocess
    subprocess.run(["python", "-m", "spacy", "download", settings.SPACY_MODEL])
    nlp = spacy.load(settings.SPACY_MODEL)


def extract_text_from_pdf(file_bytes: bytes) -> str:
    text = ""
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text.strip()


def extract_text_from_docx(file_bytes: bytes) -> str:
    doc = docx.Document(io.BytesIO(file_bytes))
    paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
    return "\n".join(paragraphs).strip()


def extract_text(file_bytes: bytes, filename: str) -> str:
    fname = filename.lower()
    if fname.endswith(".pdf"):
        return extract_text_from_pdf(file_bytes)
    elif fname.endswith(".docx"):
        return extract_text_from_docx(file_bytes)
    raise ValueError(f"Unsupported file type: {filename}")


def extract_name(text: str) -> str:
    # Try spaCy NER first
    doc = nlp(text[:500])
    for ent in doc.ents:
        if ent.label_ == "PERSON":
            name = ent.text.strip()
            words = name.split()
            if 2 <= len(words) <= 4 and all(w.isalpha() for w in words):
                return name

    # Fallback: first short line that looks like a name
    for line in text.splitlines():
        line = line.strip()
        # Remove special characters
        line = re.sub(r'[^\w\s]', '', line).strip()
        words = line.split()
        if (2 <= len(words) <= 4
                and all(w[0].isupper() for w in words if w)
                and all(w.isalpha() for w in words)):
            return line

    return "Candidate"


def extract_email(text: str) -> str:
    match = re.search(r"[\w\.-]+@[\w\.-]+\.\w+", text)
    return match.group(0) if match else ""


def extract_phone(text: str) -> str:
    match = re.search(
        r"(\+?\d{1,3}[\s\-]?)?(\(?\d{3}\)?[\s\-]?)(\d{3}[\s\-]?\d{4})", text
    )
    return match.group(0).strip() if match else ""


def extract_experience_years(text: str) -> int:
    patterns = [
        r"(\d+)\+?\s*years?\s*of\s*experience",
        r"experience\s*of\s*(\d+)\+?\s*years?",
        r"(\d+)\+?\s*years?\s*(?:of\s*)?(?:work|industry|professional)",
    ]
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            return int(match.group(1))

    year_ranges = re.findall(
        r"(20\d{2}|19\d{2})\s*[-–]\s*(20\d{2}|present|current)",
        text, re.IGNORECASE
    )
    total = 0
    import datetime
    current_year = datetime.datetime.now().year
    for start, end in year_ranges:
        try:
            s = int(start)
            e = current_year if end.lower() in ("present", "current") else int(end)
            total += max(0, e - s)
        except ValueError:
            continue
    return min(total, 40)


def extract_education(text: str) -> str:
    DEGREE_HIERARCHY = [
        "High School", "Associate's", "B.A", "BCA", "B.Sc",
        "B.E", "B.Tech", "MCA", "MBA", "M.Sc", "M.E",
        "M.Tech", "PhD"
    ]

    patterns = [
        (r"\bph\.?\s*d\.?\b|\bdoctor\s+of\s+philosophy\b",             "PhD"),
        (r"\bm\.?\s*tech\.?\b|\bmaster\s+of\s+technology\b",           "M.Tech"),
        (r"\bmaster\s+of\s+engineering\b|\bm\.e\s+degree\b",           "M.E"),
        (r"\bmba\b|\bmaster\s+of\s+business\s+administration\b",        "MBA"),
        (r"\bm\.?\s*sc\.?\b|\bmaster\s+of\s+science\b",                "M.Sc"),
        (r"\bmca\b|\bmaster\s+of\s+computer\s+application",            "MCA"),
        (r"\bb\.?\s*tech\.?\b|\bbachelor\s+of\s+technology\b",         "B.Tech"),
        (r"\bbachelor\s+of\s+engineering\b|\bb\.e\.?\s+degree\b",      "B.E"),
        (r"\bb\.?\s*sc\.?\b|\bbachelor\s+of\s+science\b",              "B.Sc"),
        (r"\bbca\b|\bbachelor\s+of\s+computer\s+application\b",        "BCA"),
        (r"\bb\.?\s*a\.?\b|\bbachelor\s+of\s+arts\b",                  "B.A"),
        (r"\bassociate'?s?\s+degree\b",                                 "Associate's"),
        (r"\bhigh\s+school\b|\b10\+2\b|\bhsc\b|\bssc\b|\bsecondary\b", "High School"),
    ]

    text_lower = text.lower()
    found_degrees = []

    for pattern, label in patterns:
        if re.search(pattern, text_lower):
            found_degrees.append(label)

    if not found_degrees:
        return "Not specified"

    best     = "Not specified"
    best_idx = -1
    for degree in found_degrees:
        idx = DEGREE_HIERARCHY.index(degree) if degree in DEGREE_HIERARCHY else -1
        if idx > best_idx:
            best_idx = idx
            best     = degree

    return best


SKILLS_DB = {
    # Programming
    "python", "javascript", "typescript", "java", "c++", "c#", "go",
    "rust", "ruby", "php", "swift", "kotlin", "scala", "r", "matlab",
    # Frontend
    "react", "vue", "angular", "next.js", "svelte", "html", "css",
    "tailwind", "webpack", "vite",
    # Backend
    "node.js", "fastapi", "django", "flask", "express", "spring",
    "graphql", "rest api",
    # Databases
    "sql", "mysql", "postgresql", "mongodb", "redis", "oracle",
    "elasticsearch", "dynamodb",
    # Cloud & DevOps
    "aws", "gcp", "azure", "docker", "kubernetes", "terraform",
    "jenkins", "github actions", "ci/cd", "linux", "bash",
    # Data & AI
    "machine learning", "deep learning", "nlp", "computer vision",
    "tensorflow", "pytorch", "scikit-learn", "pandas", "numpy",
    "data analysis", "tableau", "power bi", "spark",
    # Tools & Practices
    "git", "jira", "figma", "agile", "scrum",
    "microservices", "system design",
    # Business & Analytics
    "excel", "data visualization", "statistics", "forecasting",
    "stakeholder management", "requirements gathering",
    "process improvement", "business analysis",
    # Sales & Marketing
    "salesforce", "hubspot", "crm", "seo", "google analytics",
    "content marketing", "email marketing",
}

CONTEXT_REQUIRED = {
    "r", "go", "c", "scala", "ruby", "bash",
    "spring", "express", "rails",
}


def _has_skill_in_context(skill: str, text: str) -> bool:
    pattern = r"\b" + re.escape(skill) + r"\b"
    matches = list(re.finditer(pattern, text, re.IGNORECASE))

    if not matches:
        return False

    if skill in CONTEXT_REQUIRED:
        if len(matches) < 2:
            context_words = [
                "experience", "proficient", "skilled", "expertise",
                "developed", "built", "used", "worked", "knowledge",
                "framework", "language", "programming", "stack",
            ]
            for m in matches:
                start  = max(0, m.start() - 120)
                end    = min(len(text), m.end() + 120)
                window = text[start:end].lower()
                if any(w in window for w in context_words):
                    return True
            return False
        return True

    return True


def extract_skills(text: str) -> list:
    text_lower = text.lower()
    found      = []

    for skill in SKILLS_DB:
        if _has_skill_in_context(skill, text_lower):
            found.append(skill)

    return sorted(found)[:20]