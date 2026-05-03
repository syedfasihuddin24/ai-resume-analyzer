import { analyzeResume, warmUpBackend } from '../services/api'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Brain, ArrowLeft, Briefcase } from 'lucide-react'
import UploadZone from '../components/upload/UploadZone'
import AnalysisResults from '../components/dashboard/AnalysisResults'
import LoadingAnalysis from '../components/dashboard/LoadingAnalysis'
import { analyzeResume } from '../services/api'

const P = {
  rose:  '#fadcdc',
  lilac: '#e6d5e0',
  taupe: '#bfb6b0',
  tan:   '#9b8270',
  text:  '#f0e8e4',
  muted: '#8a7d78',
  bg:    '#0f0d0c',
  card:  '#1a1614',
  border:'rgba(191,182,176,0.1)',
}

const F = {
  heading: 'Cormorant Garamond, serif',
  body:    'Inter, sans-serif',
  mono:    'DM Mono, monospace',
}

const POPULAR_ROLES = [
  'Business Analyst', 'Data Analyst', 'Product Manager',
  'Software Engineer', 'Frontend Developer', 'Backend Developer',
  'Full Stack Developer', 'DevOps Engineer', 'Data Scientist',
  'Machine Learning Engineer', 'UX Designer', 'Project Manager',
  'Marketing Manager', 'Sales Executive', 'Financial Analyst',
]

export default function DashboardPage() {
  const navigate = useNavigate()
  const [stage, setStage] = useState('upload')
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)
  const [jobDescription, setJobDescription] = useState('')
  const [targetJob, setTargetJob] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [backendReady, setBackendReady] = useState(false)
  const [warming, setWarming] = useState(true)

  useEffect(() => {
    const warm = async () => {
      setWarming(true)
      await warmUpBackend()
      setBackendReady(true)
      setWarming(false)
    }
    warm()
  }, [])

  const handleUpload = async (file) => {
    if (!targetJob.trim()) {
      setError('Please enter the job role you are targeting before analyzing.')
      return
    }
    setError(null)
    setStage('loading')
    try {
      const data = await analyzeResume(file, jobDescription, targetJob)
      setResults(data)
      setStage('results')
    } catch (err) {
      setError(err.message || 'Analysis failed. Please try again.')
      setStage('upload')
    }
  }

  const handleReset = () => {
    setResults(null)
    setError(null)
    setJobDescription('')
    setTargetJob('')
    setStage('upload')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: P.bg, fontFamily: F.body }}>

      {/* NAVBAR */}
      <motion.nav
        initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'rgba(15,13,12,0.92)', backdropFilter: 'blur(24px)',
          borderBottom: `1px solid ${P.border}`,
          padding: '14px 40px', display: 'flex',
          alignItems: 'center', justifyContent: 'space-between',
          position: 'sticky', top: 0, zIndex: 50,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={() => navigate('/')} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'none', border: 'none', cursor: 'pointer',
            color: P.muted, fontSize: 13, fontWeight: 400, fontFamily: F.body,
            transition: 'color 0.2s', padding: 0,
          }}
            onMouseEnter={e => e.currentTarget.style.color = P.taupe}
            onMouseLeave={e => e.currentTarget.style.color = P.muted}
          >
            <ArrowLeft size={14} /> Back
          </button>
          <div style={{ width: 1, height: 18, background: P.border }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 7,
              background: 'linear-gradient(135deg, #fadcdc, #e6d5e0)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Brain size={15} color="#1a1614" />
            </div>
            <span style={{ fontFamily: F.heading, fontSize: 20, fontWeight: 700, color: P.text }}>
              Resume<span style={{ color: P.rose }}>AI</span>
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{
            fontSize: 12, fontFamily: F.heading, color: P.muted,
            fontStyle: 'italic', letterSpacing: '0.02em',
          }}>
            Built by <span style={{ color: P.rose, fontWeight: 600 }}>Syed Fasihuddin</span>
          </span>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '5px 14px', borderRadius: 100,
            background: 'rgba(250,220,220,0.06)',
            border: '1px solid rgba(250,220,220,0.14)',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: P.rose, display: 'inline-block' }} />
            <span style={{ fontSize: 11.5, color: P.taupe, fontWeight: 400, fontFamily: F.body }}>AI Engine Online</span>
          </div>
        </div>
      </motion.nav>

      {/* MAIN */}
      <main style={{ flex: 1, padding: '48px 40px', maxWidth: 1100, margin: '0 auto', width: '100%' }}>
        <AnimatePresence mode="wait">

          {stage === 'upload' && (
            <motion.div key="upload"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.35 }}>

              {/* Page header */}
              <div style={{ textAlign: 'center', marginBottom: 48 }}>
                <h1 style={{
                  fontFamily: F.heading, fontSize: 52, fontWeight: 600,
                  color: P.text, marginBottom: 12, letterSpacing: '-0.01em', lineHeight: 1.1,
                }}>
                  Analyze Your{' '}
                  <span style={{
                    background: `linear-gradient(135deg, ${P.rose}, ${P.lilac})`,
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                    fontStyle: 'italic',
                  }}>
                    Resume
                  </span>
                </h1>
                <p style={{ color: P.muted, fontSize: 15, lineHeight: 1.75, fontWeight: 300, maxWidth: 480, margin: '0 auto' }}>
                  Tell us the role you're targeting, upload your resume,
                  and get an instant AI-powered compatibility report.
                </p>
              </div>

              {/* Error */}
              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{
                    marginBottom: 24, padding: '13px 20px', borderRadius: 10,
                    background: 'rgba(250,220,220,0.07)',
                    border: '1px solid rgba(250,220,220,0.22)',
                    color: P.rose, fontSize: 13.5, textAlign: 'center', fontFamily: F.body,
                  }}>
                  ⚠ {error}
                </motion.div>
              )}

              {/* STEP 1 — Target Job Role */}
              <motion.div
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                style={{
                  background: P.card, border: `1px solid ${P.border}`,
                  borderRadius: 16, padding: '28px 28px', marginBottom: 16,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: 'rgba(250,220,220,0.08)', border: '1px solid rgba(250,220,220,0.18)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Briefcase size={15} color={P.rose} />
                  </div>
                  <div>
                    <h3 style={{ fontFamily: F.heading, fontSize: 20, fontWeight: 600, color: P.text, lineHeight: 1 }}>
                      Target Job Role
                    </h3>
                    <p style={{ fontSize: 12, color: P.muted, fontFamily: F.body, fontWeight: 300, marginTop: 3 }}>
                      Required — this tells the AI what role to evaluate your resume against
                    </p>
                  </div>
                </div>

                {/* Input with autocomplete */}
                <div style={{ position: 'relative', maxWidth: 520 }}>
                  <input
                    type="text"
                    value={targetJob}
                    onChange={e => { setTargetJob(e.target.value); setShowSuggestions(true) }}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder="e.g. Business Analyst, Software Engineer, Data Scientist…"
                    style={{
                      width: '100%', padding: '13px 16px', borderRadius: 10,
                      background: 'rgba(250,220,220,0.03)',
                      border: `1px solid ${targetJob ? 'rgba(250,220,220,0.3)' : P.border}`,
                      color: P.text, fontFamily: F.body, fontSize: 14, fontWeight: 400,
                      outline: 'none', transition: 'border-color 0.2s',
                    }}
                    onFocusCapture={e => e.target.style.borderColor = 'rgba(250,220,220,0.3)'}
                  />

                  {/* Suggestions dropdown */}
                  {showSuggestions && filteredRoles.length > 0 && (
                    <div style={{
                      position: 'absolute', top: '110%', left: 0, right: 0,
                      background: '#1f1c1b', border: `1px solid ${P.border}`,
                      borderRadius: 10, overflow: 'hidden', zIndex: 100,
                      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                    }}>
                      {filteredRoles.map(role => (
                        <div key={role}
                          onMouseDown={() => { setTargetJob(role); setShowSuggestions(false) }}
                          style={{
                            padding: '11px 16px', fontSize: 13.5, color: P.taupe,
                            fontFamily: F.body, cursor: 'pointer',
                            borderBottom: `1px solid ${P.border}`,
                            transition: 'background 0.15s',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(250,220,220,0.06)'; e.currentTarget.style.color = P.text }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = P.taupe }}
                        >
                          {role}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Popular role chips */}
                <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  <span style={{ fontSize: 11.5, color: P.muted, fontFamily: F.body, alignSelf: 'center', marginRight: 4 }}>Popular:</span>
                  {['Business Analyst', 'Software Engineer', 'Data Scientist', 'Product Manager', 'DevOps Engineer', 'UX Designer'].map(role => (
                    <button key={role}
                      onClick={() => setTargetJob(role)}
                      style={{
                        padding: '5px 12px', borderRadius: 100, fontSize: 12,
                        background: targetJob === role ? 'rgba(250,220,220,0.12)' : 'rgba(250,220,220,0.04)',
                        border: targetJob === role ? '1px solid rgba(250,220,220,0.3)' : `1px solid ${P.border}`,
                        color: targetJob === role ? P.rose : P.muted,
                        fontFamily: F.body, cursor: 'pointer', transition: 'all 0.2s',
                      }}>
                      {role}
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* STEP 2 — Upload + Job Description */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

                {/* Upload zone */}
                <motion.div
                  initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                  <UploadZone onUpload={handleUpload} />
                </motion.div>

                {/* Job description */}
                <motion.div
                  initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                  style={{
                    background: P.card, border: `1px solid ${P.border}`,
                    borderRadius: 16, padding: '24px 22px',
                    display: 'flex', flexDirection: 'column', gap: 14,
                  }}>
                  <div>
                    <h3 style={{ fontFamily: F.heading, fontSize: 20, fontWeight: 600, color: P.text, marginBottom: 4 }}>
                      Job Description
                      <span style={{ fontFamily: F.body, fontSize: 11.5, fontWeight: 300, color: P.muted, marginLeft: 8 }}>
                        optional
                      </span>
                    </h3>
                    <p style={{ fontSize: 12.5, color: P.muted, lineHeight: 1.65, fontFamily: F.body, fontWeight: 300 }}>
                      Paste the job description for more precise skill gap detection and match scoring.
                    </p>
                  </div>

                  <textarea
                    value={jobDescription}
                    onChange={e => setJobDescription(e.target.value)}
                    placeholder={"Paste the full job description here…\n\ne.g. We are looking for a Business Analyst with 3+ years of experience in stakeholder management, SQL, Power BI, and Agile methodologies..."}
                    rows={10}
                    style={{
                      width: '100%', resize: 'none', borderRadius: 10,
                      padding: '13px 15px', fontSize: 13,
                      background: 'rgba(250,220,220,0.02)',
                      border: `1px solid ${P.border}`,
                      color: P.text, fontFamily: F.body, fontWeight: 300,
                      lineHeight: 1.7, outline: 'none', transition: 'border-color 0.2s',
                      flex: 1,
                    }}
                    onFocus={e => e.target.style.borderColor = 'rgba(250,220,220,0.25)'}
                    onBlur={e => e.target.style.borderColor = P.border}
                  />

                  <div style={{ fontSize: 11, color: '#3a3330', textAlign: 'right', fontFamily: F.mono }}>
                    {jobDescription.length} chars
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {stage === 'loading' && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <LoadingAnalysis targetJob={targetJob} />
            </motion.div>
          )}

          {stage === 'results' && results && (
            <motion.div key="results"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
              <AnalysisResults results={results} onReset={handleReset} />
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  )
}
