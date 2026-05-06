# AI Resume Analyzer

An intelligent resume analysis tool that evaluates your resume against job descriptions, provides ATS scoring, identifies skill gaps, and generates detailed improvement suggestions.

## Features

- 📄 **Resume Analysis**: Upload PDF or DOCX resumes for instant analysis
- 🎯 **Job Matching**: Match your resume against target job descriptions
- 📊 **ATS Scoring**: Get ATS (Applicant Tracking System) compatibility score
- 🔍 **Skill Gap Analysis**: Identify missing skills for target roles
- 💡 **AI-Powered Suggestions**: Get personalized improvement recommendations
- 📈 **Role Recommendations**: Discover suitable job roles based on your profile
- 🎓 **Experience & Education Extraction**: Automatic parsing of credentials
- 📥 **PDF Report Generation**: Download comprehensive analysis reports

## Tech Stack

**Backend:**
- FastAPI
- SQLAlchemy (Database ORM)
- spaCy (NLP)
- scikit-learn (ML)
- sentence-transformers
- ReportLab (PDF generation)

**Frontend:**
- React 19
- Vite
- Tailwind CSS
- Framer Motion (Animations)
- Recharts (Data visualization)

## Prerequisites

- Python 3.8+
- Node.js 16+
- pip and npm

## Setup & Installation

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Download spaCy NLP model (required once):**
   ```bash
   python -m spacy download en_core_web_sm
   ```

5. **Run backend server:**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```
   ✅ Backend will be available at: `http://localhost:8000`
   - API Documentation: `http://localhost:8000/docs`

### Frontend Setup

1. **In a new terminal, navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```
   ✅ Frontend will be available at: `http://localhost:5173`

## Using the Application

1. Open `http://localhost:5173` in your browser
2. Enter the **target job role** you're applying for (required)
3. (Optional) Add a job description for detailed matching
4. Upload your resume (PDF or DOCX, max 10 MB)
5. Click **Analyze**
6. View results with:
   - ATS Score
   - Job Match Percentage
   - Skills Analysis
   - Improvement Suggestions
   - Role Recommendations
7. Download PDF Report with detailed analysis

## Project Structure

```
ai-resume-analyzer/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── routes/
│   │   │       └── resume.py (API endpoints)
│   │   ├── services/
│   │   │   ├── ats_scorer.py
│   │   │   ├── parser.py
│   │   │   ├── skill_matcher.py
│   │   │   └── report_gen.py
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   └── database.py
│   │   └── main.py
│   ├── requirements.txt
│   └── uploads/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── dashboard/
│   │   │   │   ├── AnalysisResults.jsx
│   │   │   │   └── LoadingAnalysis.jsx
│   │   │   └── upload/
│   │   │       └── UploadZone.jsx
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx
│   │   │   └── LandingPage.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## API Endpoints

### Resume Analysis
- **POST** `/api/resume/analyze`
  - Upload resume and optionally job description
  - Returns comprehensive analysis results

### Download Report
- **POST** `/api/resume/report`
  - Generate and download PDF report

### Analysis History
- **GET** `/api/resume/history`
  - Retrieve past analyses

### Health Check
- **GET** `/api/health`
  - Check backend status

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **"Unable to fetch" error** | Ensure backend is running on `http://localhost:8000` |
| **CORS errors** | Backend CORS is configured for localhost. Check console for details |
| **Module not found errors** | Run `pip install -r requirements.txt` again in backend |
| **spaCy model missing** | Run `python -m spacy download en_core_web_sm` |
| **Port conflicts** | Change ports: `--port 9000` for backend or update Vite config |
| **PDF generation fails** | Ensure ReportLab is installed: `pip install reportlab` |
| **Large file upload timeout** | Increase timeout in frontend or compress PDF |

## Environment Variables (Optional)

Create a `.env` file in the `backend` directory:
```
APP_NAME=ResumeAI
VERSION=1.0.0
DEBUG=False
MAX_FILE_SIZE_MB=10
DATABASE_URL=sqlite:///./resumeai.db
SPACY_MODEL=en_core_web_sm
```

## Building for Production

### Backend:
```bash
pip install gunicorn
gunicorn app.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker
```

### Frontend:
```bash
npm run build
```
Output will be in `frontend/dist/`

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues or questions, please open an issue in the repository.
