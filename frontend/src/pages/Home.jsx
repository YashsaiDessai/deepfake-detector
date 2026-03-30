import { useAuth } from '../App'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import AmbientBackground from '../components/AmbientBackground'
import Logo from '../components/Logo'
import FaceScanner from '../components/FaceScanner'
import { LogOut, Video, Mic, Zap } from 'lucide-react'

function Home() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  const features = [
    {
      icon: <Video size={32} />,
      title: 'Video & Photo Detection',
      description: 'Analyze images and videos to detect deepfakes with AI-powered precision',
      route: '/photo-detection',
      color: 'var(--purple-400)',
    },
    {
      icon: <Mic size={32} />,
      title: 'Audio Detection',
      description: 'Detect manipulated audio and voice deepfakes in real-time',
      route: '/audio-detection',
      color: 'var(--gold-400)',
    },
  ]

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
        {/* Hero Section */}
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
              <Zap size={32} style={{ color: 'var(--purple-400)' }} />
            </motion.div>
            <h1 className="text-gradient">Deepfake Detection Suite</h1>
          </div>
          <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '30px' }}>
            <span style={{ fontSize: '1rem' }}>Choose a detection method to get started</span>
          </p>
        </motion.div>

        {/* 3D Model Placeholder & Feature Cards */}
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          {/* 3D Model Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              marginBottom: '60px',
            }}
          >
            <FaceScanner />
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px',
              marginBottom: '40px',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {features.map((feature, index) => (
              <motion.button
                key={index}
                onClick={() => navigate(feature.route)}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                <div
                  className="glass-card"
                  style={{
                    padding: '32px',
                    textAlign: 'center',
                    height: '100%',
                    transition: 'all 0.3s ease',
                    borderColor: `rgba(${feature.color === 'var(--purple-400)' ? '192, 132, 252' : '251, 191, 36'}, 0.2)`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `rgba(${feature.color === 'var(--purple-400)' ? '192, 132, 252' : '251, 191, 36'}, 0.5)`
                    e.currentTarget.style.boxShadow = `0 0 30px ${feature.color === 'var(--purple-400)' ? 'rgba(192, 132, 252, 0.2)' : 'rgba(251, 191, 36, 0.2)'}`
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = `rgba(${feature.color === 'var(--purple-400)' ? '192, 132, 252' : '251, 191, 36'}, 0.2)`
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <div style={{ color: feature.color, marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
                    {feature.icon}
                  </div>
                  <h3 className="font-display" style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '10px' }}>
                    {feature.title}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                    {feature.description}
                  </p>
                  <div style={{ marginTop: '20px' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        background: `linear-gradient(135deg, ${feature.color}20, ${feature.color}40)`,
                        color: feature.color,
                        fontSize: '0.85rem',
                        fontWeight: 500,
                      }}
                    >
                      Get Started →
                    </span>
                  </div>
                </div>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </main>
    </div>
  )
}

export default Home
