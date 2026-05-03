const BASE_URL = 'https://resumeai-backend-my56.onrender.com/api'

// Pre-warm the backend as soon as possible
export async function warmUpBackend() {
  try {
    await fetch(`${BASE_URL}/health`)
    console.log('✅ Backend warmed up')
  } catch {
    // silent
  }
}

export async function analyzeResume(file, jobDescription = '', targetJob = '') {
  const formData = new FormData()
  formData.append('file', file)
  if (jobDescription.trim()) formData.append('job_description', jobDescription.trim())
  if (targetJob.trim())      formData.append('target_job', targetJob.trim())

  const controller = new AbortController()
  const timeout    = setTimeout(() => controller.abort(), 180000) // 3 min timeout

  try {
    const response = await fetch(`${BASE_URL}/resume/analyze`, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    })
    clearTimeout(timeout)

    if (!response.ok) {
      let message = 'Analysis failed. Please try again.'
      try {
        const err = await response.json()
        message = err.detail || err.message || message
      } catch { }
      throw new Error(message)
    }
    return response.json()
  } catch (err) {
    clearTimeout(timeout)
    if (err.name === 'AbortError') {
      throw new Error('The server is still waking up. Please wait 30 seconds and try again.')
    }
    throw err
  }
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
