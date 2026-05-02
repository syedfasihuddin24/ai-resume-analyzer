const BACKEND_URL = 'https://resumeai-backend-my56.onrender.com/api/health'

export function startKeepAlive() {
  // Ping backend every 10 mins to prevent cold start
  const ping = async () => {
    try {
      await fetch(BACKEND_URL)
    } catch {
      // silent fail
    }
  }
  ping() // ping immediately on load
  setInterval(ping, 10 * 60 * 1000)
}
