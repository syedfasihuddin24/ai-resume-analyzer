import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, X, Zap } from 'lucide-react'

const P = {
  rose:  '#fadcdc',
  lilac: '#e6d5e0',
  tan:   '#9b8270',
  text:  '#f0e8e4',
  muted: '#8a7d78',
  card:  '#1a1614',
  border:'rgba(191,182,176,0.1)',
}

const F = {
  heading: 'Cormorant Garamond, serif',
  body:    'Inter, sans-serif',
  mono:    'DM Mono, monospace',
}

export default function UploadZone({ onUpload }) {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)

  const onDrop = useCallback((accepted) => {
    if (accepted.length > 0) setFile(accepted[0])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  })

  const handleAnalyze = async () => {
    if (!file) return
    setUploading(true)
    await onUpload(file)
    setUploading(false)
  }

  const formatSize = (bytes) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div style={{
      background: P.card, border: `1px solid ${P.border}`,
      borderRadius: 16, padding: '24px 22px',
      display: 'flex', flexDirection: 'column', gap: 16,
    }}>
      <div>
        <h3 style={{ fontFamily: F.heading, fontSize: 20, fontWeight: 600, color: P.text, marginBottom: 4 }}>
          Upload Resume
        </h3>
        <p style={{ fontSize: 12.5, color: P.muted, fontFamily: F.body, fontWeight: 300 }}>
          Supports PDF and DOCX — max 10 MB
        </p>
      </div>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        style={{
          borderRadius: 12, padding: '36px 24px', textAlign: 'center',
          cursor: 'pointer', transition: 'all 0.25s ease',
          border: `1.5px dashed ${
            isDragActive ? P.rose : file ? 'rgba(250,220,220,0.3)' : P.border
          }`,
          background: isDragActive
            ? 'rgba(250,220,220,0.05)'
            : file
            ? 'rgba(250,220,220,0.03)'
            : 'rgba(250,220,220,0.01)',
        }}
      >
        <input {...getInputProps()} />

        <AnimatePresence mode="wait">
          {!file ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}
            >
              <motion.div
                animate={isDragActive ? { scale: 1.12 } : { scale: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
                style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: 'rgba(250,220,220,0.07)',
                  border: '1px solid rgba(250,220,220,0.16)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Upload size={22} color={P.rose} />
              </motion.div>

              <div>
                <p style={{ fontSize: 14, fontWeight: 500, color: P.text, fontFamily: F.body, marginBottom: 4 }}>
                  {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume'}
                </p>
                <p style={{ fontSize: 12.5, color: P.muted, fontFamily: F.body, fontWeight: 300 }}>
                  or{' '}
                  <span style={{ color: P.rose, textDecoration: 'underline', textUnderlineOffset: 3 }}>
                    click to browse
                  </span>
                </p>
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                {['PDF', 'DOCX', '≤ 10 MB'].map(t => (
                  <span key={t} style={{
                    padding: '3px 10px', borderRadius: 6, fontSize: 11,
                    fontFamily: F.mono, color: P.muted,
                    background: 'rgba(191,182,176,0.06)',
                    border: `1px solid ${P.border}`,
                  }}>{t}</span>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="file"
              initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              style={{ display: 'flex', alignItems: 'center', gap: 14 }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 11, flexShrink: 0,
                background: 'rgba(250,220,220,0.08)',
                border: '1px solid rgba(250,220,220,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <FileText size={20} color={P.rose} />
              </div>

              <div style={{ textAlign: 'left', flex: 1, minWidth: 0 }}>
                <p style={{
                  fontSize: 13.5, fontWeight: 500, color: P.text,
                  fontFamily: F.body, marginBottom: 3,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {file.name}
                </p>
                <p style={{ fontSize: 11.5, color: P.muted, fontFamily: F.mono }}>
                  {formatSize(file.size)} · {file.name.endsWith('.pdf') ? 'PDF' : 'DOCX'}
                </p>
              </div>

              <button
                onClick={e => { e.stopPropagation(); setFile(null) }}
                style={{
                  width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                  background: 'rgba(250,220,220,0.06)',
                  border: `1px solid ${P.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: P.muted, transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(250,220,220,0.12)'; e.currentTarget.style.color = P.rose }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(250,220,220,0.06)'; e.currentTarget.style.color = P.muted }}
              >
                <X size={14} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Analyze button */}
      <motion.button
        onClick={handleAnalyze}
        disabled={!file || uploading}
        whileHover={file && !uploading ? { scale: 1.02 } : {}}
        whileTap={file && !uploading ? { scale: 0.98 } : {}}
        style={{
          width: '100%', padding: '13px', borderRadius: 10,
          fontFamily: F.body, fontWeight: 600, fontSize: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          cursor: file && !uploading ? 'pointer' : 'not-allowed',
          border: 'none', transition: 'all 0.25s',
          background: file && !uploading
            ? 'linear-gradient(135deg, #fadcdc, #e6d5e0)'
            : 'rgba(191,182,176,0.07)',
          color: file && !uploading ? '#1a1614' : '#3a3330',
        }}
      >
        {uploading ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              style={{
                width: 16, height: 16, borderRadius: '50%',
                border: '2px solid rgba(26,22,20,0.2)',
                borderTopColor: '#1a1614',
              }}
            />
            Analyzing…
          </>
        ) : (
          <>
            <Zap size={15} />
            Analyze Resume
          </>
        )}
      </motion.button>
    </div>
  )
}