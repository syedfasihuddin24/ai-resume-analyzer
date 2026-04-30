import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Brain, Zap, Target, TrendingUp, Shield, Download, ArrowRight } from 'lucide-react'

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

const features = [
  { icon: Brain,      title: 'AI-Powered Parsing',  desc: 'spaCy NLP precisely extracts skills, experience and education from any resume format.',  color: P.rose  },
  { icon: Shield,     title: 'ATS Score Analysis',  desc: 'Score your resume against real ATS filters recruiters use at top companies.',            color: P.lilac },
  { icon: Target,     title: 'Job Role Matching',   desc: 'Semantic similarity engine aligns your profile to any job description.',                  color: P.tan   },
  { icon: Zap,        title: 'Skill Gap Detection', desc: 'See exactly which skills are missing for your target role — ranked by importance.',       color: P.rose  },
  { icon: TrendingUp, title: 'Smart Suggestions',   desc: 'Concrete, actionable improvements written by AI to boost your resume score.',            color: P.lilac },
  { icon: Download,   title: 'PDF Report Export',   desc: 'Download a polished, recruiter-grade analysis report as a formatted PDF.',               color: P.tan   },
]

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: P.bg }}>

      {/* NAVBAR */}
      <motion.nav
        initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
        style={{
          background: 'rgba(15,13,12,0.92)',
          backdropFilter: 'blur(24px)',
          borderBottom: `1px solid ${P.border}`,
          padding: '15px 52px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'sticky', top: 0, zIndex: 50,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, #fadcdc, #e6d5e0)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Brain size={16} color="#0f0d0c" />
          </div>
          <span style={{ fontFamily: F.heading, fontSize: 22, fontWeight: 700, color: P.text, letterSpacing: '0.02em' }}>
            Resume<span style={{ color: P.rose }}>AI</span>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          {[
            { label: 'Features',     id: 'features-section'    },
            { label: 'How it works', id: 'howitworks-section'  },
          ].map(({ label, id }) => (
            <span key={label}
              onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}
              style={{ color: P.muted, fontSize: 13, cursor: 'pointer', fontWeight: 400, fontFamily: F.body, transition: 'color 0.2s', letterSpacing: '0.02em' }}
              onMouseEnter={e => e.target.style.color = P.taupe}
              onMouseLeave={e => e.target.style.color = P.muted}>
              {label}
            </span>
          ))}
        </div>

        {/* Empty spacer to keep logo centered */}
        <div style={{ width: 120 }} />
      </motion.nav>

      {/* HERO */}
      <section style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 24px 56px', textAlign: 'center' }}>

        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(250,220,220,0.06)',
            border: '1px solid rgba(250,220,220,0.16)',
            borderRadius: 100, padding: '5px 16px', marginBottom: 32,
          }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: P.rose, display: 'inline-block' }} />
          <span style={{ fontFamily: F.mono, fontSize: 11, color: P.taupe, letterSpacing: '0.07em', fontWeight: 400 }}>
            Powered by spaCy · sentence-transformers · scikit-learn
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.13, duration: 0.6 }}
          style={{
            fontFamily: F.heading, fontSize: 78, fontWeight: 600,
            lineHeight: 1.05, marginBottom: 24, maxWidth: 720,
            color: P.text, letterSpacing: '-0.01em',
          }}>
          Your Resume,{' '}
          <span style={{
            background: `linear-gradient(135deg, ${P.rose}, ${P.lilac})`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            fontStyle: 'italic',
          }}>
            Analyzed
          </span>
          <br />
          <span style={{ color: P.taupe }}>by AI.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ fontSize: 15.5, color: P.muted, maxWidth: 460, lineHeight: 1.85, marginBottom: 38, fontWeight: 300, fontFamily: F.body }}>
          Upload your resume and receive an instant ATS score, skill gap analysis,
          job role matching, and AI-powered improvement suggestions.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          style={{ display: 'flex', gap: 12, marginBottom: 64 }}>
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/dashboard')}
            style={{
              background: 'linear-gradient(135deg, #fadcdc, #e6d5e0)',
              border: 'none', borderRadius: 10, padding: '13px 32px',
              color: '#1a1614', fontFamily: F.body, fontWeight: 600,
              fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
              letterSpacing: '0.01em',
            }}>
            Analyze My Resume <ArrowRight size={15} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02, borderColor: 'rgba(250,220,220,0.28)' }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: 'transparent',
              border: '1px solid rgba(191,182,176,0.18)',
              borderRadius: 10, padding: '13px 26px',
              color: P.muted, fontFamily: F.body,
              fontWeight: 400, fontSize: 14, cursor: 'pointer',
              transition: 'border-color 0.2s',
            }}>
            View Sample Report
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          style={{ display: 'flex', gap: 56, alignItems: 'center' }}>
          {[
            { value: '98%', label: 'ATS Accuracy',   color: P.rose  },
            { value: '50+', label: 'Skills Tracked', color: P.lilac },
            { value: '<3s', label: 'Analysis Time',  color: P.tan   },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: F.heading, fontSize: 38, fontWeight: 600,
                color: s.color, lineHeight: 1,
              }}>{s.value}</div>
              <div style={{ color: P.muted, fontSize: 11.5, marginTop: 6, fontWeight: 400, fontFamily: F.body, letterSpacing: '0.05em' }}>{s.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* DIVIDER */}
      <div style={{ maxWidth: 1100, margin: '0 auto', width: '100%', padding: '0 40px' }}>
        <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${P.border}, transparent)` }} />
      </div>

      {/* FEATURES */}
      <section id="features-section" style={{ padding: '64px 40px', maxWidth: 1100, margin: '0 auto', width: '100%' }}>
        <motion.div
          initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontFamily: F.heading, fontSize: 42, fontWeight: 600, color: P.text, marginBottom: 10, letterSpacing: '-0.01em' }}>
            Everything you need to{' '}
            <span style={{
              background: `linear-gradient(135deg, ${P.rose}, ${P.lilac})`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              fontStyle: 'italic',
            }}>
              land the job
            </span>
          </h2>
          <p style={{ color: P.muted, fontSize: 14, fontFamily: F.body, fontWeight: 300 }}>Six powerful AI modules working in sync.</p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {features.map(({ icon: Icon, title, desc, color }, i) => (
            <motion.div key={title}
              initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              style={{
                background: P.card,
                border: `1px solid ${P.border}`,
                borderRadius: 16, padding: '24px 22px',
                transition: 'border-color 0.3s',
                cursor: 'default',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(250,220,220,0.22)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = P.border}
            >
              <div style={{
                width: 42, height: 42, borderRadius: 10,
                background: `${color}14`,
                border: `1px solid ${color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
              }}>
                <Icon size={19} color={color} />
              </div>
              <h3 style={{ fontFamily: F.heading, fontSize: 18, fontWeight: 600, color: P.text, marginBottom: 8, letterSpacing: '0.01em' }}>
                {title}
              </h3>
              <p style={{ fontSize: 13, color: P.muted, lineHeight: 1.75, margin: 0, fontFamily: F.body, fontWeight: 300 }}>{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* DIVIDER */}
      <div style={{ maxWidth: 1100, margin: '0 auto', width: '100%', padding: '0 40px' }}>
        <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${P.border}, transparent)` }} />
      </div>

      {/* HOW IT WORKS */}
      <section id="howitworks-section" style={{ padding: '64px 40px', maxWidth: 1100, margin: '0 auto', width: '100%' }}>
        <motion.div
          initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 44 }}>
          <h2 style={{ fontFamily: F.heading, fontSize: 42, fontWeight: 600, color: P.text, marginBottom: 10, letterSpacing: '-0.01em' }}>
            How it{' '}
            <span style={{
              background: `linear-gradient(135deg, ${P.tan}, ${P.rose})`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              fontStyle: 'italic',
            }}>
              works
            </span>
          </h2>
          <p style={{ color: P.muted, fontSize: 14, fontFamily: F.body, fontWeight: 300 }}>Four simple steps to a better resume.</p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {[
            { step: '01', title: 'Upload',  desc: 'Drop your PDF or DOCX',     color: P.rose  },
            { step: '02', title: 'Parse',   desc: 'AI reads every detail',      color: P.lilac },
            { step: '03', title: 'Analyze', desc: 'ATS score + role matching',  color: P.tan   },
            { step: '04', title: 'Export',  desc: 'Download your PDF report',   color: P.rose  },
          ].map(({ step, title, desc, color }, i) => (
            <motion.div key={step}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              style={{
                background: P.card, border: `1px solid ${P.border}`,
                borderRadius: 14, padding: '22px 18px', textAlign: 'center', position: 'relative', overflow: 'hidden',
              }}>
              <div style={{
                position: 'absolute', top: -6, right: 4,
                fontFamily: F.heading, fontSize: 72, fontWeight: 700,
                color: `${color}06`, lineHeight: 1, pointerEvents: 'none',
              }}>{step}</div>
              <div style={{ fontFamily: F.mono, fontSize: 10.5, color, fontWeight: 500, marginBottom: 10, letterSpacing: '0.12em' }}>{step}</div>
              <h3 style={{ fontFamily: F.heading, fontSize: 20, fontWeight: 600, color: P.text, marginBottom: 6 }}>{title}</h3>
              <p style={{ fontSize: 12.5, color: P.muted, lineHeight: 1.65, margin: 0, fontFamily: F.body, fontWeight: 300 }}>{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '0 40px 72px', maxWidth: 1100, margin: '0 auto', width: '100%' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          style={{
            background: 'linear-gradient(135deg, rgba(250,220,220,0.06), rgba(230,213,224,0.04))',
            border: '1px solid rgba(250,220,220,0.14)',
            borderRadius: 20, padding: '52px 40px', textAlign: 'center',
          }}>
          <h2 style={{ fontFamily: F.heading, fontSize: 44, fontWeight: 600, color: P.text, marginBottom: 12, letterSpacing: '-0.01em' }}>
            Ready to land your{' '}
            <span style={{
              background: `linear-gradient(135deg, ${P.rose}, ${P.lilac})`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              fontStyle: 'italic',
            }}>
              dream role?
            </span>
          </h2>
          <p style={{ fontSize: 14.5, color: P.muted, marginBottom: 32, lineHeight: 1.8, fontFamily: F.body, fontWeight: 300 }}>
            Free AI resume analysis. No sign-up required. Results in under 3 seconds.
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/dashboard')}
            style={{
              background: 'linear-gradient(135deg, #fadcdc, #e6d5e0)',
              border: 'none', borderRadius: 10, padding: '14px 44px',
              color: '#1a1614', fontFamily: F.body,
              fontWeight: 600, fontSize: 14.5, cursor: 'pointer',
              letterSpacing: '0.01em',
            }}>
            Analyze My Resume — It's Free →
          </motion.button>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer style={{
        textAlign: 'center', padding: '20px 24px',
        borderTop: `1px solid ${P.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 8,
      }}>
        <span style={{ color: '#3a3330', fontSize: 11, fontFamily: F.mono, letterSpacing: '0.04em' }}>
          ResumeAI · FastAPI · React · spaCy · sentence-transformers
        </span>
        <span style={{
          fontSize: 11.5, fontFamily: F.heading, color: P.muted,
          fontStyle: 'italic', letterSpacing: '0.02em',
        }}>
          Built by{' '}
          <span style={{ color: P.rose, fontWeight: 600 }}>Syed Fasihuddin</span>
        </span>
      </footer>
    </div>
  )
}