import { motion } from 'framer-motion'
import { RefreshCw, Download, TrendingUp, Shield, Target, Zap, AlertTriangle, CheckCircle, Briefcase, Star, Award } from 'lucide-react'
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts'

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

const fade = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
}
const rise = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

function scoreColor(score) {
  if (score >= 75) return P.rose
  if (score >= 50) return P.lilac
  return P.tan
}

function scoreLabel(score) {
  if (score >= 75) return 'Excellent'
  if (score >= 50) return 'Good'
  if (score >= 30) return 'Fair'
  return 'Needs Work'
}

function verdictData(jobMatch, atsScore, skillCoverage) {
  const avg = (jobMatch + atsScore + skillCoverage) / 3
  if (avg >= 70) return {
    label: 'Strong Fit',
    desc:  'Your resume is well-aligned for this role. Apply with confidence.',
    color: P.rose,
    icon:  '✓',
  }
  if (avg >= 50) return {
    label: 'Partial Fit',
    desc:  'Your resume shows potential but needs targeted improvements before applying.',
    color: P.lilac,
    icon:  '◎',
  }
  return {
    label: 'Not Ready Yet',
    desc:  'Significant gaps detected. Strengthen your resume before applying to this role.',
    color: P.tan,
    icon:  '△',
  }
}

function ScoreRing({ score, color, size = 110 }) {
  const data = [
    { value: score,       fill: color },
    { value: 100 - score, fill: 'transparent' },
  ]
  return (
    <div style={{ width: size, height: size, position: 'relative', flexShrink: 0 }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart cx="50%" cy="50%" innerRadius="68%" outerRadius="100%"
          startAngle={90} endAngle={-270} data={data} barSize={6}>
          <RadialBar dataKey="value" cornerRadius={6}
            background={{ fill: 'rgba(191,182,176,0.06)' }} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontFamily: F.heading, fontSize: 26, fontWeight: 600, color, lineHeight: 1 }}>
          {score}
        </span>
        <span style={{ fontSize: 10.5, color: P.muted, marginTop: 2, fontFamily: F.mono }}>/100</span>
      </div>
    </div>
  )
}

function SkillPill({ skill, missing }) {
  return (
    <span style={{
      padding: '4px 12px', borderRadius: 100, fontSize: 11.5, fontWeight: 400,
      fontFamily: F.mono,
      background: missing ? 'rgba(155,130,112,0.08)' : 'rgba(250,220,220,0.07)',
      border:     missing ? '1px solid rgba(155,130,112,0.25)' : '1px solid rgba(250,220,220,0.2)',
      color:      missing ? P.tan : P.rose,
      display: 'inline-block',
    }}>
      {missing ? '+ ' : ''}{skill}
    </span>
  )
}

function SectionTitle({ icon: Icon, label, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 16 }}>
      <div style={{
        width: 28, height: 28, borderRadius: 7,
        background: `${color}10`, border: `1px solid ${color}25`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={13} color={color} />
      </div>
      <span style={{ fontFamily: F.heading, fontSize: 18, fontWeight: 600, color: P.text }}>
        {label}
      </span>
    </div>
  )
}

function ScoreBar({ label, score, max, color }) {
  const pct = Math.round((score / max) * 100)
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 12.5, color: P.muted, fontFamily: F.body, textTransform: 'capitalize' }}>{label}</span>
        <span style={{ fontSize: 12, fontFamily: F.mono, color }}>
          {score}<span style={{ color: '#3a3330' }}>/{max}</span>
        </span>
      </div>
      <div style={{ height: 4, background: 'rgba(191,182,176,0.08)', borderRadius: 100, overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }} animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
          style={{ height: '100%', borderRadius: 100, background: color }}
        />
      </div>
    </div>
  )
}

export default function AnalysisResults({ results, onReset }) {
  const {
    ats_score            = 0,
    job_match            = 0,
    skills_found         = [],
    missing_skills       = [],
    suggestions          = [],
    experience_years     = 0,
    education            = '',
    candidate_name       = 'Candidate',
    job_title            = 'General Role',
    target_job           = '',
    ats_breakdown        = {},
    ats_weights          = {},
    role_recommendations = [],
    email                = '',
    phone                = '',
  } = results

  const displayJob     = target_job || job_title
  const atsColor       = scoreColor(ats_score)
  const matchColor     = scoreColor(Math.round(job_match))
  const skillCoverage  = skills_found.length + missing_skills.length > 0
    ? Math.round((skills_found.length / (skills_found.length + missing_skills.length)) * 100)
    : 0
  const verdict        = verdictData(Math.round(job_match), ats_score, skillCoverage)

  const handleDownload = async () => {
    try {
      const res = await fetch('https://resumeai-backend-my56.onrender.com/api/resume/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(results),
      })
      const blob = await res.blob()
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = `ResumeAI_${candidate_name.replace(/ /g, '_')}_Report.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      alert('Report download failed. Please try again.')
    }
  }

  return (
    <div style={{ fontFamily: F.body }}>

      {/* TOP BAR */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontFamily: F.heading, fontSize: 36, fontWeight: 600, color: P.text, marginBottom: 4, letterSpacing: '-0.01em' }}>
            Analysis{' '}
            <span style={{
              background: `linear-gradient(135deg, ${P.rose}, ${P.lilac})`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              fontStyle: 'italic',
            }}>Complete</span>
          </h1>
          <p style={{ fontSize: 13, color: P.muted, fontFamily: F.body, fontWeight: 300 }}>
            {candidate_name}
            {email && <> · <span style={{ color: '#3a3330' }}>{email}</span></>}
            {phone && <> · <span style={{ color: '#3a3330' }}>{phone}</span></>}
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onReset} style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '9px 18px', borderRadius: 9, fontSize: 13, fontWeight: 500,
            border: `1px solid ${P.border}`, background: 'transparent',
            color: P.muted, cursor: 'pointer', fontFamily: F.body, transition: 'all 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(250,220,220,0.22)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = P.border}
          >
            <RefreshCw size={13} /> New Analysis
          </button>
          <button onClick={handleDownload} style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '9px 20px', borderRadius: 9, fontSize: 13, fontWeight: 600,
            background: 'linear-gradient(135deg, #fadcdc, #e6d5e0)',
            border: 'none', color: '#1a1614', cursor: 'pointer', fontFamily: F.body,
          }}>
            <Download size={13} /> Download PDF Report
          </button>
        </div>
      </div>

      <motion.div variants={fade} initial="hidden" animate="show"
        style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* VERDICT BANNER */}
        <motion.div variants={rise} style={{
          padding: '20px 24px', borderRadius: 14,
          background: `${verdict.color}08`,
          border: `1px solid ${verdict.color}25`,
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12, flexShrink: 0,
            background: `${verdict.color}12`, border: `1px solid ${verdict.color}28`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, color: verdict.color,
          }}>
            {verdict.icon}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <span style={{ fontFamily: F.heading, fontSize: 20, fontWeight: 600, color: verdict.color }}>
                {verdict.label}
              </span>
              <span style={{
                fontSize: 11, fontFamily: F.mono, padding: '2px 10px', borderRadius: 100,
                background: `${verdict.color}12`, border: `1px solid ${verdict.color}25`,
                color: verdict.color,
              }}>
                for {displayJob}
              </span>
            </div>
            <p style={{ fontSize: 13.5, color: P.muted, fontFamily: F.body, fontWeight: 300, margin: 0 }}>
              {verdict.desc}
            </p>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontFamily: F.heading, fontSize: 28, fontWeight: 600, color: verdict.color, lineHeight: 1 }}>
              {Math.round((Math.round(job_match) + ats_score) / 2)}%
            </div>
            <div style={{ fontSize: 11, color: P.muted, fontFamily: F.body, marginTop: 3 }}>overall score</div>
          </div>
        </motion.div>

        {/* ROW 1 — SCORE CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>

          <motion.div variants={rise} style={{ background: P.card, border: `1px solid ${P.border}`, borderRadius: 14, padding: '20px 18px' }}>
            <span style={{ fontFamily: F.mono, fontSize: 10, fontWeight: 500, letterSpacing: '0.1em', color: P.muted, display: 'block', marginBottom: 14, textTransform: 'uppercase' }}>ATS Score</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <ScoreRing score={ats_score} color={atsColor} size={100} />
              <div>
                <div style={{ fontSize: 11, fontWeight: 500, padding: '3px 10px', borderRadius: 100, background: `${atsColor}10`, border: `1px solid ${atsColor}25`, color: atsColor, display: 'inline-block', marginBottom: 6 }}>
                  {scoreLabel(ats_score)}
                </div>
                <p style={{ fontSize: 12, color: P.muted, lineHeight: 1.55, margin: 0, fontWeight: 300 }}>
                  {ats_score >= 75 ? 'Strong ATS performance' : ats_score >= 50 ? 'Improvable with fixes' : 'Needs significant work'}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={rise} style={{ background: P.card, border: `1px solid ${P.border}`, borderRadius: 14, padding: '20px 18px' }}>
            <span style={{ fontFamily: F.mono, fontSize: 10, fontWeight: 500, letterSpacing: '0.1em', color: P.muted, display: 'block', marginBottom: 14, textTransform: 'uppercase' }}>Job Match</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <ScoreRing score={Math.round(job_match)} color={matchColor} size={100} />
              <div>
                <div style={{ fontSize: 11, fontWeight: 500, padding: '3px 10px', borderRadius: 100, background: `${matchColor}10`, border: `1px solid ${matchColor}25`, color: matchColor, display: 'inline-block', marginBottom: 6 }}>
                  {Math.round(job_match)}% Aligned
                </div>
                <p style={{ fontSize: 12, color: P.muted, lineHeight: 1.55, margin: 0, fontWeight: 300 }}>
                  {job_match >= 75 ? 'Excellent alignment' : job_match >= 50 ? 'Decent match' : 'Low alignment'}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={rise} style={{ background: P.card, border: `1px solid ${P.border}`, borderRadius: 14, padding: '20px 18px' }}>
            <span style={{ fontFamily: F.mono, fontSize: 10, fontWeight: 500, letterSpacing: '0.1em', color: P.muted, display: 'block', marginBottom: 14, textTransform: 'uppercase' }}>Experience</span>
            <div style={{ marginBottom: 12 }}>
              <span style={{ fontFamily: F.heading, fontSize: 46, fontWeight: 600, color: P.rose, lineHeight: 1 }}>{experience_years}</span>
              <span style={{ fontSize: 13, color: P.muted, marginLeft: 6, fontWeight: 300 }}>yrs</span>
            </div>
            {education && (
              <div style={{ fontSize: 12, padding: '5px 10px', borderRadius: 7, background: 'rgba(250,220,220,0.06)', border: `1px solid ${P.border}`, color: P.taupe, fontFamily: F.body, fontWeight: 300 }}>
                🎓 {education}
              </div>
            )}
          </motion.div>

          <motion.div variants={rise} style={{ background: P.card, border: `1px solid ${P.border}`, borderRadius: 14, padding: '20px 18px' }}>
            <span style={{ fontFamily: F.mono, fontSize: 10, fontWeight: 500, letterSpacing: '0.1em', color: P.muted, display: 'block', marginBottom: 14, textTransform: 'uppercase' }}>Skills Overview</span>
            {[
              { label: 'Detected',  value: skills_found.length,   color: P.rose  },
              { label: 'Missing',   value: missing_skills.length, color: P.tan   },
              { label: 'Coverage',  value: `${skillCoverage}%`,   color: P.lilac },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 12, color: P.muted, fontFamily: F.body, fontWeight: 300 }}>{item.label}</span>
                <span style={{ fontFamily: F.heading, fontSize: 20, fontWeight: 600, color: item.color }}>{item.value}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ROW 2 — JOB ROLE RECOMMENDATIONS */}
        <motion.div variants={rise} style={{ background: P.card, border: `1px solid ${P.border}`, borderRadius: 14, padding: '20px 22px' }}>
          <SectionTitle icon={Briefcase} label="Best Matching Job Roles" color={P.rose} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
            {(role_recommendations.length > 0
              ? role_recommendations
              : [{ role: displayJob, score: job_match }]
            ).map(({ role, score }, i) => {
              const pct   = Math.round(score)
              const color = scoreColor(pct)
              const isTop = i === 0
              return (
                <div key={role} style={{
                  padding: '16px 18px', borderRadius: 12,
                  background: isTop ? 'rgba(250,220,220,0.06)' : 'rgba(255,255,255,0.02)',
                  border: isTop ? '1px solid rgba(250,220,220,0.2)' : `1px solid ${P.border}`,
                  position: 'relative', overflow: 'hidden',
                }}>
                  {isTop && (
                    <div style={{
                      position: 'absolute', top: 10, right: 10,
                      fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 100,
                      background: 'rgba(250,220,220,0.1)', color: P.rose,
                      border: '1px solid rgba(250,220,220,0.2)',
                      display: 'flex', alignItems: 'center', gap: 4, fontFamily: F.body,
                    }}>
                      <Star size={8} /> Best Match
                    </div>
                  )}
                  <div style={{ fontFamily: F.heading, fontSize: 17, fontWeight: 600, color: P.text, marginBottom: 12, paddingRight: isTop ? 80 : 0 }}>
                    {role}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ flex: 1, height: 4, background: 'rgba(191,182,176,0.08)', borderRadius: 100, overflow: 'hidden' }}>
                      <motion.div
                        initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.9, ease: 'easeOut', delay: 0.3 + i * 0.1 }}
                        style={{ height: '100%', borderRadius: 100, background: color }}
                      />
                    </div>
                    <span style={{ fontFamily: F.mono, fontSize: 13, fontWeight: 500, color, flexShrink: 0 }}>{pct}%</span>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* ROW 3 — ATS BREAKDOWN */}
        {Object.keys(ats_breakdown).length > 0 && (
          <motion.div variants={rise} style={{ background: P.card, border: `1px solid ${P.border}`, borderRadius: 14, padding: '20px 22px' }}>
            <SectionTitle icon={Shield} label="ATS Score Breakdown" color={P.lilac} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '4px 40px' }}>
              {Object.entries(ats_breakdown).map(([key, val]) => {
                const max   = ats_weights[key] || 20
                const pct   = Math.round((val / max) * 100)
                return <ScoreBar key={key} label={key} score={val} max={max} color={scoreColor(pct)} />
              })}
            </div>
          </motion.div>
        )}

        {/* ROW 4 — SKILLS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <motion.div variants={rise} style={{ background: P.card, border: `1px solid ${P.border}`, borderRadius: 14, padding: '20px 22px' }}>
            <SectionTitle icon={CheckCircle} label={`Skills Detected (${skills_found.length})`} color={P.rose} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {skills_found.length > 0
                ? skills_found.map(s => <SkillPill key={s} skill={s} missing={false} />)
                : <p style={{ fontSize: 12.5, color: '#3a3330', margin: 0, fontFamily: F.body }}>No skills detected.</p>}
            </div>
          </motion.div>

          <motion.div variants={rise} style={{ background: P.card, border: `1px solid ${P.border}`, borderRadius: 14, padding: '20px 22px' }}>
            <SectionTitle icon={AlertTriangle} label={`Missing Skills (${missing_skills.length})`} color={P.tan} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {missing_skills.length > 0
                ? missing_skills.map(s => <SkillPill key={s} skill={s} missing={true} />)
                : <p style={{ fontSize: 12.5, color: '#3a3330', margin: 0, fontFamily: F.body }}>No critical gaps detected 🎉</p>}
            </div>
          </motion.div>
        </div>

        {/* ROW 5 — SUGGESTIONS */}
        <motion.div variants={rise} style={{ background: P.card, border: `1px solid ${P.border}`, borderRadius: 14, padding: '20px 22px' }}>
          <SectionTitle icon={Zap} label="AI-Powered Improvement Suggestions" color={P.lilac} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }}>
            {suggestions.length > 0
              ? suggestions.map((s, i) => (
                  <div key={i} style={{
                    display: 'flex', gap: 12, padding: '13px 15px', borderRadius: 10,
                    background: 'rgba(250,220,220,0.03)', border: `1px solid ${P.border}`,
                  }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: 6, flexShrink: 0, marginTop: 1,
                      background: 'rgba(250,220,220,0.08)', color: P.rose,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: F.mono, fontSize: 11, fontWeight: 500,
                    }}>
                      {i + 1}
                    </div>
                    <p style={{ fontSize: 13, color: P.muted, lineHeight: 1.65, margin: 0, fontFamily: F.body, fontWeight: 300 }}>{s}</p>
                  </div>
                ))
              : <p style={{ fontSize: 12.5, color: '#3a3330', fontFamily: F.body }}>No suggestions available.</p>}
          </div>
        </motion.div>

      </motion.div>
    </div>
  )
}
