import { useState } from 'react'
import { useAuth } from '../App'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import AmbientBackground from '../components/AmbientBackground'
import Logo from '../components/Logo'
import VisualDetector from '../components/VisualDetector'
import VoiceDetector from '../components/VoiceDetector'
import { LogOut, Video, Mic, Shield, Sparkles } from 'lucide-react'

function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('visual')

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
              <Shield size={32} style={{ color: 'var(--purple-400)' }} />
            </motion.div>
            <h1 className="text-gradient">Deepfake Detection Suite</h1>
          </div>
          <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Sparkles size={16} style={{ color: 'var(--gold-400)' }} />
            Upload media to analyze with our AI-powered detection engine
            <Sparkles size={16} style={{ color: 'var(--gold-400)' }} />
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          className="tabs-wrap"
          style={{ maxWidth: '520px', margin: '0 auto 36px' }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <button
            className={`tab-btn ${activeTab === 'visual' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('visual')}
            id="tab-visual"
          >
            <Video size={18} />
            Video & Photos
          </button>
          <button
            className={`tab-btn ${activeTab === 'voice' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('voice')}
            id="tab-voice"
          >
            <Mic size={18} />
            Voice Detection
          </button>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
          >
            {activeTab === 'visual' ? <VisualDetector /> : <VoiceDetector />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}

export default Dashboard
