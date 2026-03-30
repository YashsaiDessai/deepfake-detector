import { useAuth } from '../App'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import AmbientBackground from '../components/AmbientBackground'
import Logo from '../components/Logo'
import VoiceDetector from '../components/VoiceDetector'
import { LogOut, ArrowLeft, Mic } from 'lucide-react'

function AudioDetection() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  return (
    <div className="dashboard">
      <AmbientBackground />

      {/* Navigation */}
      <motion.nav
        className="dash-nav"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="nav-left">
          <button
            onClick={() => navigate('/home')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.9rem',
              padding: '4px 12px',
              borderRadius: '8px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(124, 58, 237, 0.1)'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'none'
            }}
          >
            <ArrowLeft size={18} />
            Back
          </button>
          <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)', margin: '0 12px' }} />
          <Logo size="sm" />
        </div>
        <div className="nav-right">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginRight: '6px' }}>
            <div className="user-avatar" title={user?.name}>
              {initials}
            </div>
            <span style={{ fontSize: '0.88rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
              {user?.name}
            </span>
          </div>
          <button className="logout-btn" onClick={handleLogout} id="logout-btn">
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="dash-content">
        {/* Hero */}
        <motion.div
          className="dash-hero"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '10px' }}>
            <motion.div
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
            >
              <Mic size={32} style={{ color: 'var(--gold-400)' }} />
            </motion.div>
            <h1 className="text-gradient">Audio Detection</h1>
          </div>
          <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <span>Detect voice deepfakes and audio manipulation with advanced AI analysis</span>
          </p>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <VoiceDetector />
        </motion.div>
      </main>
    </div>
  )
}

export default AudioDetection
