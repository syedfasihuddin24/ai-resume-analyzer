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
- FastAPI + Uvicorn
- Python 3.11+

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

### Prerequisites
- **Node.js** v18+
- **Python 3.11+** (Python 3.13 also supported)
- **Anaconda / Miniconda** (recommended for managing Python)

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
Frontend runs at → **http://localhost:5173**

### 3. Backend Setup

#### ✅ Option A — Use the start script (recommended)
```bash
chmod +x backend/start.sh
./backend/start.sh
```
This will automatically:
- Create a fresh virtual environment
- Install all dependencies
- Download the spaCy language model
- Start the server on port 8000

#### 🔧 Option B — Manual setup
```bash
cd backend

# Use Python 3.11 explicitly (avoids compatibility issues)
/opt/anaconda3/bin/python3 -m venv venv   # macOS with Anaconda
# OR: python3.11 -m venv venv             # if python3.11 is in PATH

source venv/bin/activate          # macOS/Linux
# OR: venv\Scripts\activate       # Windows

pip install -r requirements.txt
python -m spacy download en_core_web_sm

uvicorn app.main:app --reload --port 8000
```
Backend runs at → **http://localhost:8000**

> ⚠️ **Important:** Both the frontend and backend must be running simultaneously in **separate terminals**.

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

## 🛠️ Troubleshooting

### `zsh: command not found: uvicorn`
Your virtual environment is not activated or is broken. Use `start.sh` (Option A above) to auto-fix this.

### `Failed to fetch` error in the browser
The backend server is not running. Start it using `start.sh` or the manual steps above.

### `blis` / `spacy` fails to build on Python 3.13
Use Python 3.11 via conda:
```bash
conda create -n resumeai python=3.11 -y
conda activate resumeai
pip install -r backend/requirements.txt
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