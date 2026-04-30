import { Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import LandingPage from './pages/LandingPage'
import DashboardPage from './pages/DashboardPage'

export default function App() {
  return (
    <div className="min-h-screen bg-[#0F172A] bg-grid bg-noise">
      {/* Ambient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="absolute rounded-full opacity-20 blur-[120px]"
          style={{
            width: '600px',
            height: '600px',
            top: '-200px',
            left: '-200px',
            background: 'radial-gradient(circle, #8B5CF6 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute rounded-full opacity-15 blur-[120px]"
          style={{
            width: '500px',
            height: '500px',
            bottom: '-150px',
            right: '-150px',
            background: 'radial-gradient(circle, #22D3EE 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute rounded-full opacity-10 blur-[100px]"
          style={{
            width: '400px',
            height: '400px',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, #F472B6 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Page routes */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
        </AnimatePresence>
      </div>
    </div>
  )
}