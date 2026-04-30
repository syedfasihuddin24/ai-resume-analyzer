const BASE_URL = import.meta.env.VITE_API_URL || '/api'

export async function analyzeResume(file, jobDescription = '', targetJob = '') {
  const formData = new FormData()
  formData.append('file', file)
  if (jobDescription.trim()) formData.append('job_description', jobDescription.trim())
  if (targetJob.trim())      formData.append('target_job', targetJob.trim())

  const response = await fetch(`${BASE_URL}/resume/analyze`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    let message = 'Analysis failed. Please try again.'
    try {
      const err = await response.json()
      message = err.detail || err.message || message
    } catch { }
    throw new Error(message)
  }
  return response.json()
}

export async function downloadReport(results) {
  const response = await fetch(`${BASE_URL}/resume/report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(results),
  })
  if (!response.ok) throw new Error('Report generation failed.')
  return response.blob()
}

export async function healthCheck() {
  const response = await fetch(`${BASE_URL}/health`)
  return response.json()
}