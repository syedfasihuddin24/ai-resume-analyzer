# 🚀 AI Resume Analyzer + Job Matcher

A full-stack AI-powered web application that analyzes resumes, calculates ATS scores, detects skill gaps, and matches job roles using NLP.

---

## 🔥 Features

- 📄 Upload Resume (PDF / DOCX)
- 🧠 AI Resume Parsing
- 📊 ATS Score Analysis
- 🎯 Job Role Matching %
- ⚠️ Missing Skills Detection
- 💡 AI Suggestions for Improvement
- 📥 Downloadable PDF Report
- 🎨 Futuristic Dashboard UI

---

## 🧠 Tech Stack

### Frontend
- React + Vite
- Tailwind CSS
- Framer Motion
- Recharts

### Backend
- FastAPI
- Python

### AI / NLP
- spaCy
- scikit-learn
- sentence-transformers

### Database
- SQLite

### Deployment
- Vercel (Frontend)
- Render (Backend)

---

## 📸 UI Preview

> Futuristic AI dashboard with glassmorphism and neon UI

---

## ⚙️ Installation

### 1. Clone repo
```bash
git clone https://github.com/syedfasihuddin24/ai-resume-analyzer.git
cd ai-resume-analyzer
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 3. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate (Windows)

pip install -r requirements.txt
python -m spacy download en_core_web_sm

uvicorn app.main:app --reload
```

---

## 🌐 Deployment

- Frontend → Vercel  
- Backend → Render  

---

## 📡 API Endpoints

### Analyze Resume
```
POST /api/resume/analyze
```

### Download Report
```
POST /api/resume/report
```

### Health Check
```
GET /api/health
```

---

## 💡 Future Improvements

- User authentication
- Resume history tracking
- Real-time job scraping
- AI chatbot for career guidance

---

## 🤝 Contributing

Pull requests are welcome.

---

## 📜 License

MIT License

---

## 👨‍💻 Author

**Syed Fasihuddin**

---

⭐ If you like this project, give it a star!