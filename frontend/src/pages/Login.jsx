import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../App'
import AmbientBackground from '../components/AmbientBackground'
import Logo from '../components/Logo'
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, LogIn } from 'lucide-react'

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address')
      return
    }

    setLoading(true)
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('realio_users') || '[]')
      const found = users.find(u => u.email === email && u.password === password)

      if (found) {
        login({ name: found.name, email: found.email })
        navigate('/dashboard')
      } else if (users.length === 0) {
        login({ name: email.split('@')[0], email })
        navigate('/dashboard')
      } else {
        setError('Invalid email or password. Please try again.')
      }
      setLoading(false)
    }, 1400)
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.96 },
    visible: {
      opacity: 1, y: 0, scale: 1,
      transition: { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: (i) => ({
      opacity: 1, y: 0,
      transition: { delay: i * 0.08, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }
    })
  }

  return (
    <div className="auth-page">
      <AmbientBackground />

      <motion.div
        className="auth-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="auth-card">
          <div className="auth-header">
            <motion.div
              style={{ display: 'flex', justifyContent: 'center' }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
            >
              <Logo size="lg" />
            </motion.div>
            <h1>Welcome back</h1>
            <p>Sign in to continue detecting deepfakes</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {error && (
              <motion.div
                className="error-msg"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AlertCircle size={16} />
                {error}
              </motion.div>
            )}

            <motion.div className="input-group" variants={itemVariants} custom={0} initial="hidden" animate="visible">
              <label htmlFor="login-email">Email Address</label>
              <div className="input-icon-wrap">
                <Mail size={18} className="icon-l" />
                <input
                  id="login-email"
                  type="email"
                  className="input-field"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </motion.div>

            <motion.div className="input-group" variants={itemVariants} custom={1} initial="hidden" animate="visible">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label htmlFor="login-password">Password</label>
                <span
                  className="link"
                  style={{ fontSize: '0.8rem', color: 'var(--gold-400)', cursor: 'pointer' }}
                  onClick={() => {}}
                  tabIndex={0}
                >
                  Forgot password?
                </span>
              </div>
              <div className="input-icon-wrap">
                <Lock size={18} className="icon-l" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className="input-field"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="icon-r"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} custom={2} initial="hidden" animate="visible">
              <label className="checkbox-wrap">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                <div className="custom-check">
                  {remember && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <span className="check-label">Remember me for 30 days</span>
              </label>
            </motion.div>

            <motion.div variants={itemVariants} custom={3} initial="hidden" animate="visible">
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
                id="login-submit"
                style={{ width: '100%' }}
              >
                {loading ? (
                  <>
                    <div className="spinner" style={{ width: 22, height: 22, borderWidth: 2.5 }} />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn size={18} />
                    Sign In
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </motion.div>

            <motion.div variants={itemVariants} custom={4} initial="hidden" animate="visible">
              <div className="divider">
                <span>or continue with</span>
              </div>
            </motion.div>

            <motion.div className="social-btns" variants={itemVariants} custom={5} initial="hidden" animate="visible">
              <button type="button" className="social-btn" onClick={() => {}}>
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
              <button type="button" className="social-btn" onClick={() => {}}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </button>
            </motion.div>
          </form>

          <div className="auth-footer">
            Don't have an account?{' '}
            <Link to="/signup">Create one</Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Login
