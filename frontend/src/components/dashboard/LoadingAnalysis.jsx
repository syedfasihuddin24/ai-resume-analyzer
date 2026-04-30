import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const P = {
  rose:  '#fadcdc',
  lilac: '#e6d5e0',
  tan:   '#9b8270',
  text:  '#f0e8e4',
  muted: '#8a7d78',
}

const F = {
  heading: 'Cormorant Garamond, serif',
  body:    'Inter, sans-serif',
  mono:    'DM Mono, monospace',
}

const steps = [
  { id: 1, label: 'Parsing resume content',        color: P.rose,  duration: 1800 },
  { id: 2, label: 'Extracting skills & keywords',  color: P.lilac, duration: 1600 },
  { id: 3, label: 'Running ATS scoring engine',    color: P.tan,   duration: 2000 },
  { id: 4, label: 'Detecting skill gaps',          color: P.rose,  duration: 1500 },
  { id: 5, label: 'Matching target job role',      color: P.lilac, duration: 1700 },
  { id: 6, label: 'Generating AI suggestions',     color: P.tan,   duration: 1400 },
]

export default function LoadingAnalysis({ targetJob = '' }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState([])
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let stepIndex = 0
    let elapsed   = 0
    const total   = steps.reduce((a, s) => a + s.duration, 0)

    const runStep = () => {
      if (stepIndex >= steps.length) return
      setCurrentStep(stepIndex)
      const timer = setTimeout(() => {
        elapsed += steps[stepIndex].duration
        setCompletedSteps(prev => [...prev, stepIndex])
        setProgress(Math.round((elapsed / total) * 100))
        stepIndex++
        runStep()
      }, steps[stepIndex].duration)
      return () => clearTimeout(timer)
    }
    runStep()
  }, [])

  return (
    <div style={{
      minHeight: '70vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: '40px 24px',
    }}>

      {/* Spinning ring */}
      <div style={{ position: 'relative', marginBottom: 40, width: 96, height: 96 }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            border: '1.5px solid transparent',
            borderTopColor: P.rose,
            borderRightColor: P.lilac,
          }}
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute', inset: 8, borderRadius: '50%',
            border: '1px solid transparent',
            borderTopColor: P.tan,
            borderLeftColor: P.rose,
            opacity: 0.6,
          }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: F.heading, fontSize: 28, color: P.rose,
        }}>
          AI
        </div>
      </div>

      {/* Title */}
      <h2 style={{
        fontFamily: F.heading, fontSize: 32, fontWeight: 600,
        color: P.text, marginBottom: 8, textAlign: 'center',
      }}>
        Analyzing Your Resume
      </h2>
      {targetJob && (
        <p style={{ fontSize: 13.5, color: P.muted, fontFamily: F.body, fontWeight: 300, marginBottom: 4 }}>
          Evaluating fit for{' '}
          <span style={{ color: P.rose, fontWeight: 500 }}>{targetJob}</span>
        </p>
      )}
      <p style={{ fontSize: 13, color: P.muted, fontFamily: F.body, fontWeight: 300, marginBottom: 32 }}>
        This takes just a few seconds
      </p>

      {/* Progress bar */}
      <div style={{ width: '100%', maxWidth: 440, marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 11.5, color: P.muted, fontFamily: F.body }}>Progress</span>
          <span style={{ fontSize: 11.5, color: P.rose, fontFamily: F.mono }}>{progress}%</span>
        </div>
        <div style={{
          height: 4, borderRadius: 100,
          background: 'rgba(250,220,220,0.08)', overflow: 'hidden',
        }}>
          <motion.div
            initial={{ width: 0 }} animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{
              height: '100%', borderRadius: 100,
              background: 'linear-gradient(90deg, #fadcdc, #e6d5e0, #9b8270)',
            }}
          />
        </div>
      </div>

      {/* Steps */}
      <div style={{ width: '100%', maxWidth: 440, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {steps.map((step, index) => {
          const isDone   = completedSteps.includes(index)
          const isActive = currentStep === index && !isDone

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: isDone || isActive ? 1 : 0.3, x: 0 }}
              transition={{ delay: index * 0.06 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 14px', borderRadius: 10,
                background: isActive ? 'rgba(250,220,220,0.05)' : 'transparent',
                border: `1px solid ${isActive ? 'rgba(250,220,220,0.15)' : 'transparent'}`,
                transition: 'all 0.3s',
              }}
            >
              {/* Status dot */}
              <div style={{
                width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontFamily: F.mono,
                background: isDone
                  ? 'rgba(250,220,220,0.12)'
                  : isActive
                  ? `${step.color}15`
                  : 'rgba(255,255,255,0.04)',
                border: `1px solid ${isDone ? 'rgba(250,220,220,0.25)' : isActive ? `${step.color}40` : 'rgba(255,255,255,0.06)'}`,
                color: isDone ? P.rose : isActive ? step.color : '#3a3330',
              }}>
                {isDone ? '✓' : step.id}
              </div>

              {/* Label */}
              <span style={{
                flex: 1, fontSize: 13, fontFamily: F.body,
                fontWeight: isActive ? 500 : 400,
                color: isDone ? P.taupe : isActive ? step.color : '#3a3330',
              }}>
                {step.label}
              </span>

              {/* Spinner */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      style={{
                        width: 14, height: 14, borderRadius: '50%',
                        border: `1.5px solid ${step.color}30`,
                        borderTopColor: step.color,
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}