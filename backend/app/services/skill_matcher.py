import re
from sentence_transformers import SentenceTransformer, util
from app.services.parser import SKILLS_DB

_model = None

def _get_model():
    global _model
    if _model is None:
        print("⏳ Loading sentence-transformer model...")
        _model = SentenceTransformer("all-MiniLM-L6-v2")
        print("✅ Sentence-transformer model loaded")
    return _model


# ── Job Role Definitions ─────────────────────────────────

JOB_ROLES = {
    "Business Analyst": {
        "keywords": ["sql", "power bi", "tableau", "excel", "stakeholder management",
                     "agile", "scrum", "jira", "data analysis", "requirements gathering",
                     "process improvement", "documentation", "python", "r"],
        "description": (
            "Business analyst with expertise in requirements gathering, stakeholder management, "
            "and data analysis. Proficient in SQL, Excel, Power BI, Tableau. "
            "Experience with Agile, Scrum, JIRA, process mapping, and business process improvement."
        ),
    },
    "Data Analyst": {
        "keywords": ["sql", "python", "excel", "tableau", "power bi", "pandas",
                     "numpy", "data analysis", "statistics", "r", "visualization"],
        "description": (
            "Data analyst skilled in SQL, Python, Excel, Tableau, Power BI. "
            "Experience with data cleaning, statistical analysis, pandas, numpy, "
            "data visualization, and reporting dashboards."
        ),
    },
    "Frontend Developer": {
        "keywords": ["react", "vue", "angular", "html", "css", "javascript",
                     "typescript", "tailwind", "webpack", "vite", "next.js"],
        "description": (
            "Frontend developer skilled in React, Vue, Angular. "
            "Proficient in HTML, CSS, JavaScript, TypeScript, Tailwind. "
            "Experience with responsive design and modern UI frameworks."
        ),
    },
    "Backend Developer": {
        "keywords": ["python", "node.js", "java", "django", "fastapi", "flask",
                     "express", "postgresql", "mysql", "rest api", "microservices"],
        "description": (
            "Backend developer with expertise in Python, Node.js, Java. "
            "Builds REST APIs, microservices, and manages databases. "
            "Experience with Django, FastAPI, Express, PostgreSQL, MySQL."
        ),
    },
    "Full Stack Developer": {
        "keywords": ["react", "node.js", "python", "javascript", "typescript",
                     "mongodb", "postgresql", "docker", "rest api", "git"],
        "description": (
            "Full stack developer proficient in both frontend and backend. "
            "React, Node.js, Python, JavaScript, TypeScript. "
            "Databases, REST APIs, Docker, and cloud deployment."
        ),
    },
    "Software Engineer": {
        "keywords": ["python", "java", "c++", "git", "algorithms", "data structures",
                     "system design", "rest api", "docker", "agile", "sql"],
        "description": (
            "Software engineer with strong fundamentals in algorithms and system design. "
            "Python, Java, C++, Git. Experience with REST APIs, Docker, Agile, SQL databases."
        ),
    },
    "Data Scientist": {
        "keywords": ["python", "machine learning", "deep learning", "pandas",
                     "numpy", "scikit-learn", "tensorflow", "pytorch",
                     "data analysis", "statistics", "sql"],
        "description": (
            "Data scientist with expertise in machine learning and statistical analysis. "
            "Python, pandas, numpy, scikit-learn, TensorFlow, PyTorch. "
            "Feature engineering, model deployment, and data analysis."
        ),
    },
    "Machine Learning Engineer": {
        "keywords": ["python", "machine learning", "deep learning", "tensorflow",
                     "pytorch", "docker", "aws", "scikit-learn", "nlp", "computer vision"],
        "description": (
            "Machine learning engineer building and deploying ML systems. "
            "Python, TensorFlow, PyTorch, scikit-learn. "
            "MLOps, model deployment, computer vision, NLP pipelines."
        ),
    },
    "DevOps Engineer": {
        "keywords": ["docker", "kubernetes", "aws", "gcp", "azure", "terraform",
                     "ansible", "jenkins", "ci/cd", "linux", "bash", "github actions"],
        "description": (
            "DevOps engineer experienced in cloud infrastructure and automation. "
            "Docker, Kubernetes, AWS, GCP, Terraform, CI/CD pipelines. "
            "Linux administration, bash scripting, and monitoring."
        ),
    },
    "Product Manager": {
        "keywords": ["product roadmap", "agile", "scrum", "stakeholder management",
                     "jira", "user stories", "data analysis", "a/b testing",
                     "market research", "sql", "figma"],
        "description": (
            "Product manager with experience in roadmap planning, stakeholder management. "
            "Agile, Scrum, JIRA, user stories, A/B testing, market research. "
            "Data-driven decision making and cross-functional team leadership."
        ),
    },
    "UX Designer": {
        "keywords": ["figma", "sketch", "user research", "wireframing", "prototyping",
                     "usability testing", "adobe xd", "design systems", "html", "css"],
        "description": (
            "UX designer skilled in user research, wireframing, prototyping. "
            "Figma, Sketch, Adobe XD, design systems, usability testing. "
            "User-centered design and accessibility best practices."
        ),
    },
    "Project Manager": {
        "keywords": ["project management", "agile", "scrum", "stakeholder management",
                     "risk management", "jira", "ms project", "budget management",
                     "pmp", "prince2", "documentation"],
        "description": (
            "Project manager with experience in Agile and Waterfall methodologies. "
            "Stakeholder management, risk management, budget planning. "
            "PMP, PRINCE2, JIRA, MS Project, cross-functional team leadership."
        ),
    },
    "Cloud Architect": {
        "keywords": ["aws", "gcp", "azure", "terraform", "kubernetes",
                     "microservices", "system design", "docker", "ci/cd", "linux"],
        "description": (
            "Cloud architect designing scalable distributed systems. "
            "AWS, GCP, Azure, Terraform, Kubernetes. "
            "Microservices architecture and cloud-native solutions."
        ),
    },
    "Financial Analyst": {
        "keywords": ["excel", "financial modeling", "sql", "tableau", "power bi",
                     "forecasting", "budgeting", "python", "r", "accounting"],
        "description": (
            "Financial analyst with expertise in financial modeling, forecasting, budgeting. "
            "Excel, SQL, Tableau, Power BI, Python. "
            "Variance analysis, reporting, and investment evaluation."
        ),
    },
    "Marketing Manager": {
        "keywords": ["seo", "google analytics", "social media", "content marketing",
                     "email marketing", "crm", "hubspot", "data analysis",
                     "a/b testing", "campaign management"],
        "description": (
            "Marketing manager with expertise in digital marketing and campaign management. "
            "SEO, Google Analytics, social media, content marketing, email marketing. "
            "CRM, HubSpot, A/B testing, performance reporting."
        ),
    },
    "Sales Executive": {
        "keywords": ["crm", "salesforce", "lead generation", "negotiation",
                     "account management", "b2b", "pipeline management",
                     "communication", "excel", "presentation"],
        "description": (
            "Sales executive with experience in B2B sales and account management. "
            "CRM, Salesforce, lead generation, pipeline management, negotiation. "
            "Strong communication, presentation, and relationship building skills."
        ),
    },
    "Mobile Developer": {
        "keywords": ["swift", "kotlin", "react", "flutter", "android",
                     "ios", "typescript", "javascript", "rest api", "git"],
        "description": (
            "Mobile developer building iOS and Android applications. "
            "Swift, Kotlin, React Native, Flutter. "
            "REST API integration and app store deployment."
        ),
    },
}


# ── Role Skills Map for missing skills ───────────────────

ROLE_SKILLS_MAP = {
    "business analyst":        ["sql", "excel", "tableau", "power bi", "agile", "jira", "scrum", "data analysis", "python", "stakeholder management"],
    "data analyst":            ["sql", "python", "excel", "tableau", "power bi", "pandas", "numpy", "statistics", "r"],
    "frontend developer":      ["react", "javascript", "typescript", "html", "css", "tailwind", "git", "next.js", "vite"],
    "backend developer":       ["python", "node.js", "postgresql", "rest api", "docker", "git", "fastapi", "django"],
    "full stack developer":    ["react", "node.js", "python", "postgresql", "docker", "git", "rest api", "typescript"],
    "software engineer":       ["python", "java", "git", "sql", "docker", "system design", "rest api", "agile"],
    "data scientist":          ["python", "machine learning", "pandas", "numpy", "scikit-learn", "sql", "statistics", "tensorflow"],
    "machine learning engineer":["python", "tensorflow", "pytorch", "scikit-learn", "docker", "aws", "mlops", "nlp"],
    "devops engineer":         ["docker", "kubernetes", "aws", "ci/cd", "terraform", "linux", "bash", "github actions"],
    "product manager":         ["agile", "jira", "scrum", "sql", "figma", "data analysis", "stakeholder management"],
    "ux designer":             ["figma", "user research", "wireframing", "prototyping", "adobe xd", "html", "css"],
    "project manager":         ["agile", "scrum", "jira", "risk management", "stakeholder management", "documentation"],
    "cloud architect":         ["aws", "azure", "gcp", "terraform", "kubernetes", "docker", "system design", "ci/cd"],
    "financial analyst":       ["excel", "sql", "tableau", "power bi", "python", "financial modeling", "forecasting"],
    "marketing manager":       ["seo", "google analytics", "social media", "hubspot", "content marketing", "crm", "a/b testing"],
    "sales executive":         ["crm", "salesforce", "lead generation", "negotiation", "account management", "b2b"],
    "mobile developer":        ["swift", "kotlin", "flutter", "react", "rest api", "git", "ios", "android"],
}


def _normalize_role(role: str) -> str:
    return role.lower().strip()


def _find_closest_role(target_job: str) -> str | None:
    """Find the closest matching role key from target_job string."""
    target_lower = _normalize_role(target_job)
    for role_key in ROLE_SKILLS_MAP:
        if role_key in target_lower or target_lower in role_key:
            return role_key
    for role_key in ROLE_SKILLS_MAP:
        words = role_key.split()
        if any(w in target_lower for w in words if len(w) > 3):
            return role_key
    return None


def compute_semantic_similarity(text1: str, text2: str) -> float:
    embeddings = _model.encode([text1, text2], convert_to_tensor=True)
    score = util.cos_sim(embeddings[0], embeddings[1])
    return float(score.item())


def match_job_role(
    resume_text: str,
    skills_found: list,
    job_description: str = "",
    target_job: str = "",
) -> dict:
    """
    Match resume to job roles.
    If target_job provided → compute match score specifically for that role.
    """
    skills_text = " ".join(skills_found)
    combined    = f"{resume_text[:1500]} {skills_text}"
    found_set   = set(s.lower() for s in skills_found)

    role_scores = {}

    for role, data in JOB_ROLES.items():
        role_keywords  = set(data["keywords"])
        overlap        = len(found_set & role_keywords)
        keyword_score  = min(1.0, overlap / max(len(role_keywords) * 0.6, 1))
        semantic_score = compute_semantic_similarity(combined, data["description"])
        final_score    = (semantic_score * 0.6) + (keyword_score * 0.4)
        role_scores[role] = round(final_score * 100, 1)

    # ── Target job specific match ─────────────────────────
    target_match = None
    best_role    = max(role_scores, key=role_scores.get)

    if target_job.strip():
        # Check if target_job maps to a known role
        closest_key = _find_closest_role(target_job)

        if closest_key:
            role_keywords  = set(ROLE_SKILLS_MAP[closest_key])
            overlap        = len(found_set & role_keywords)
            keyword_score  = min(1.0, overlap / max(len(role_keywords) * 0.5, 1))

            # Semantic match against target role description
            known_role_name = next(
                (r for r in JOB_ROLES if _normalize_role(r) == closest_key), None
            )
            if known_role_name:
                semantic_score = compute_semantic_similarity(
                    combined, JOB_ROLES[known_role_name]["description"]
                )
            else:
                semantic_score = compute_semantic_similarity(combined, target_job)

            target_match = round(min(100, (semantic_score * 0.6 + keyword_score * 0.4) * 100), 1)

        else:
            # Unknown role — semantic match against target job title + JD
            ref_text     = f"{target_job} {job_description[:500]}" if job_description else target_job
            semantic_score = compute_semantic_similarity(combined, ref_text)
            role_keywords  = set()
            if job_description:
                jd_lower  = job_description.lower()
                role_keywords = {
                    skill for skill in SKILLS_DB
                    if re.search(r"\b" + re.escape(skill) + r"\b", jd_lower)
                }
            overlap      = len(found_set & role_keywords) if role_keywords else 0
            kw_score     = min(1.0, overlap / max(len(role_keywords) * 0.5, 1)) if role_keywords else 0
            target_match = round(min(100, (semantic_score * 0.7 + kw_score * 0.3) * 100), 1)

        best_role = target_job

    # ── JD match override ─────────────────────────────────
    jd_match = None
    if job_description.strip():
        jd_semantic = compute_semantic_similarity(combined, job_description[:2000])
        jd_lower    = job_description.lower()
        jd_skills   = {
            skill for skill in SKILLS_DB
            if re.search(r"\b" + re.escape(skill) + r"\b", jd_lower)
        }
        jd_overlap  = len(found_set & jd_skills) / max(len(jd_skills), 1)
        jd_match    = round(min(100, (jd_semantic * 0.65 + jd_overlap * 0.35) * 100), 1)

    final_score = jd_match if jd_match else (target_match if target_match else role_scores[best_role])

    return {
        "best_role":   best_role,
        "match_score": final_score,
        "role_scores": role_scores,
        "jd_match":    jd_match,
    }


def get_role_recommendations(role_scores: dict, target_job: str = "", top_n: int = 3) -> list:
    """Return top N role matches. If target_job given, ensure it appears first."""
    sorted_roles = sorted(role_scores.items(), key=lambda x: x[1], reverse=True)
    results = [{"role": role, "score": score} for role, score in sorted_roles[:top_n]]

    if target_job.strip():
        closest = _find_closest_role(target_job)
        target_in_results = any(
            _normalize_role(r["role"]) == _normalize_role(target_job) or
            (closest and _normalize_role(r["role"]) == closest)
            for r in results
        )
        if not target_in_results:
            score = role_scores.get(
                next((r for r in role_scores if _normalize_role(r) == closest), ""),
                0
            )
            results.insert(0, {"role": target_job, "score": score})
            results = results[:top_n]

    return results
