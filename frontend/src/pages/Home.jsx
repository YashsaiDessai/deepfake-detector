import { useAuth } from '../App'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import AmbientBackground from '../components/AmbientBackground'
import Logo from '../components/Logo'
import FaceMesh from '../components/FaceMesh'
import { LogOut, Video, Mic, ShieldCheck } from 'lucide-react'

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
      color: '#a855f7', // Solid Purple
    },
    {
      icon: <Mic size={32} />,
      title: 'Audio Detection',
      description: 'Detect manipulated audio and voice deepfakes in real-time',
      route: '/audio-detection',
      color: '#f59e0b', // Solid Amber
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
        style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}
      >
        <div className="nav-left">
          <Logo size="sm" />
        </div>
        <div className="nav-right">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginRight: '10px' }}>
            <div className="user-avatar" title={user?.name} style={{ background: 'rgba(255,255,255,0.1)' }}>
              {initials}
            </div>
            <span style={{ fontSize: '0.88rem', fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{ textAlign: 'center', marginBottom: '40px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '12px' }}>
            <ShieldCheck size={32} style={{ color: '#fff' }} />
            <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>
              Verification Suite
            </h1>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.1rem' }}>
            Advanced Biometric & Synthetic Media Analysis
          </p>
        </motion.div>

        {/* 3D Model Display */}
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            style={{ marginBottom: '50px' }}
          >
            <FaceMesh />
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '30px',
              padding: '0 20px',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {features.map((feature, index) => (
              <motion.button
                key={index}
                onClick={() => navigate(feature.route)}
                whileHover={{ y: -5 }}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '20px',
                  padding: '40px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'background 0.3s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'}
              >
                <div style={{ color: feature.color, marginBottom: '20px' }}>
                  {feature.icon}
                </div>
                <h3 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 600, marginBottom: '12px' }}>
                  {feature.title}
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '24px' }}>
                  {feature.description}
                </p>
                <div style={{ 
                  fontSize: '0.9rem', 
                  fontWeight: 600, 
                  color: feature.color, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px' 
                }}>
                  Launch Module →
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