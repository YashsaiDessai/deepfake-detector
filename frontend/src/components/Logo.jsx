function Logo({ size = 'md' }) {
  const sizes = {
    sm: { fs: '1.35rem', icon: 30 },
    md: { fs: '1.6rem', icon: 38 },
    lg: { fs: '2.2rem', icon: 48 },
  }
  const s = sizes[size] || sizes.md

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div
        style={{
          width: s.icon,
          height: s.icon,
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #7c3aed 0%, #d97706 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 25px rgba(124, 58, 237, 0.3), 0 0 15px rgba(245, 158, 11, 0.15)',
          position: 'relative',
        }}
      >
        <svg
          width={s.icon * 0.55}
          height={s.icon * 0.55}
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v4" />
          <path d="M12 18v4" />
          <path d="M4.93 4.93l2.83 2.83" />
          <path d="M16.24 16.24l2.83 2.83" />
          <path d="M2 12h4" />
          <path d="M18 12h4" />
        </svg>
      </div>
      <span className="logo-text" style={{ fontSize: s.fs }}>
        REALIO
      </span>
    </div>
  )
}

export default Logo
