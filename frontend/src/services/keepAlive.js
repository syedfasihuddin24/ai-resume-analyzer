const BACKEND_URL = 'https://resumeai-backend-my56.onrender.com/api/health'

export function startKeepAlive() {
  const ping = async () => {
    try {
      await fetch(BACKEND_URL)
    } catch { }
  }
  // Ping every 5 minutes to prevent sleep
  ping()
  setInterval(ping, 5 * 60 * 1000)
}
