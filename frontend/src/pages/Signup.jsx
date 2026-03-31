import { useState, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../App'
import AmbientBackground from '../components/AmbientBackground'
import Logo from '../components/Logo'
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, User, Check, X, Shield } from 'lucide-react'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }
})

function Signup() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const requirements = useMemo(() => [
    { label: 'At least 12 characters', met: password.length >= 12 },
    { label: 'Uppercase letter (A-Z)', met: /[A-Z]/.test(password) },
    { label: 'Lowercase letter (a-z)', met: /[a-z]/.test(password) },
    { label: 'Number (0-9)', met: /\d/.test(password) },
    { label: 'Special character (!@#$%^&*)', met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) },
  ], [password])

  const strengthScore = requirements.filter(r => r.met).length

  const strengthConfig = useMemo(() => {
    if (strengthScore <= 1) return { label: 'Weak', color: '#ef4444' }
    if (strengthScore <= 2) return { label: 'Fair', color: '#f59e0b' }
    if (strengthScore <= 3) return { label: 'Good', color: '#fbbf24' }
    if (strengthScore <= 4) return { label: 'Strong', color: '#22c55e' }
    return { label: 'Excellent', color: '#10b981' }
  }, [strengthScore])

  const allMet = requirements.every(r => r.met)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields')
      return
    }
    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address')
      return
    }
    if (!allMet) {
      setError('Please meet all password requirements')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (!agreeTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy')
      return
    }

    setLoading(true)
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('realio_users') || '[]')
      if (users.find(u => u.email === email)) {
        setError('An account with this email already exists')
        setLoading(false)
        return
      }
      users.push({ name: name.trim(), email, password })
      localStorage.setItem('realio_users', JSON.stringify(users))
      login({ name: name.trim(), email })
      navigate('/dashboard')
      setLoading(false)
    }, 1600)
  }

  return (
    <div className="auth-page">
      <AmbientBackground />

      <motion.div
        className="auth-container"
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
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
            <h1>Create account</h1>
            <p>Start detecting deepfakes in seconds</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {error && (
              <motion.div className="error-msg" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <AlertCircle size={16} />
                {error}
              </motion.div>
            )}

            {/* Name */}
            <motion.div className="input-group" {...fadeUp(0.05)}>
              <label htmlFor="signup-name">Full Name</label>
              <div className="input-icon-wrap">
                <User size={18} className="icon-l" />
                <input id="signup-name" type="text" className="input-field" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
              </div>
            </motion.div>

            {/* Email */}
            <motion.div className="input-group" {...fadeUp(0.1)}>
              <label htmlFor="signup-email">Email Address</label>
              <div className="input-icon-wrap">
                <Mail size={18} className="icon-l" />
                <input id="signup-email" type="email" className="input-field" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
              </div>
              {email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && (
                <span style={{ fontSize: '0.78rem', color: '#f87171', marginTop: '2px' }}>Please enter a valid email</span>
              )}
            </motion.div>

            {/* Password */}
            <motion.div className="input-group" {...fadeUp(0.15)}>
              <label htmlFor="signup-password">Password</label>
              <div className="input-icon-wrap">
                <Lock size={18} className="icon-l" />
                <input id="signup-password" type={showPassword ? 'text' : 'password'} className="input-field" placeholder="Create a strong password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
                <button type="button" className="icon-r" onClick={() => setShowPassword(!showPassword)} tabIndex={-1} aria-label={showPassword ? 'Hide' : 'Show'}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Strength meter */}
              {password.length > 0 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.3 }} style={{ marginTop: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Shield size={13} /> Password strength
                    </span>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: strengthConfig.color, fontFamily: "'Poppins',sans-serif" }}>
                      {strengthConfig.label}
                    </span>
                  </div>

                  <div className="pw-strength">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div
                        key={i}
                        className={`strength-bar ${i <= strengthScore ? 'active' : ''}`}
                        style={i <= strengthScore ? { background: strengthConfig.color, '--bar-color': strengthConfig.color } : {}}
                      />
                    ))}
                  </div>

                  <div className="pw-reqs">
                    {requirements.map((req, idx) => (
                      <motion.div
                        key={idx}
                        className={`req-item ${req.met ? 'met' : ''}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <div className="req-dot">
                          {req.met ? <Check size={10} /> : <X size={10} />}
                        </div>
                        {req.label}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Confirm Password */}
            <motion.div className="input-group" {...fadeUp(0.2)}>
              <label htmlFor="signup-confirm">Confirm Password</label>
              <div className="input-icon-wrap">
                <Lock size={18} className="icon-l" />
                <input
                  id="signup-confirm"
                  type={showConfirm ? 'text' : 'password'}
                  className="input-field"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  style={
                    confirmPassword.length > 0
                      ? confirmPassword === password
                        ? { borderColor: 'rgba(34,197,94,0.5)', boxShadow: '0 0 12px rgba(34,197,94,0.1)' }
                        : { borderColor: 'rgba(239,68,68,0.5)', boxShadow: '0 0 12px rgba(239,68,68,0.1)' }
                      : {}
                  }
                />
                <button type="button" className="icon-r" onClick={() => setShowConfirm(!showConfirm)} tabIndex={-1}>
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {confirmPassword.length > 0 && (
                <span style={{ fontSize: '0.78rem', color: confirmPassword === password ? '#22c55e' : '#f87171', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {confirmPassword === password ? <><Check size={12} /> Passwords match</> : <><X size={12} /> Passwords do not match</>}
                </span>
              )}
            </motion.div>

            {/* Terms */}
            <motion.div {...fadeUp(0.25)}>
              <label className="checkbox-wrap">
                <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} />
                <div className="custom-check">
                  {agreeTerms && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <span className="check-label">
                  I agree to the <a href="#" onClick={e => e.preventDefault()}>Terms of Service</a> and <a href="#" onClick={e => e.preventDefault()}>Privacy Policy</a>
                </span>
              </label>
            </motion.div>

            <motion.div {...fadeUp(0.3)}>
              <button type="submit" className="btn-primary" disabled={loading} id="signup-submit" style={{ width: '100%' }}>
                {loading ? (
                  <>
                    <div className="spinner" style={{ width: 22, height: 22, borderWidth: 2.5 }} />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </motion.div>

            <motion.div {...fadeUp(0.35)}>
              <div className="divider"><span>or sign up with</span></div>
            </motion.div>

            <motion.div className="social-btns" {...fadeUp(0.4)}>
              <button type="button" className="social-btn">
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
              <button type="button" className="social-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </button>
            </motion.div>
          </form>

          <div className="auth-footer">
            Already have an account?{' '}
            <Link to="/login">Sign in</Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Signup
