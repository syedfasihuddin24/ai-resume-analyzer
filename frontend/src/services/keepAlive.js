const BACKEND_URL = 'https://resumeai-backend-my56.onrender.com/api/health'

export function startKeepAlive() {
  const ping = async () => {
    try {
      await fetch(BACKEND_URL)
      console.log('✅ Backend alive')
    } catch {
      // silent
    }
  }
  ping()
  setInterval(ping, 8 * 60 * 1000)
}
