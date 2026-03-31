import { useEffect, useState } from 'react'

function ConfidenceRing({ value = 0, size = 100, color = '#7c3aed', strokeWidth = 8 }) {
  const [animatedValue, setAnimatedValue] = useState(0)
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (animatedValue / 100) * circumference

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedValue(value), 100)
    return () => clearTimeout(timer)
  }, [value])

  return (
    <div className="analysis-ring" style={{ width: size, height: size }}>
      {/* SVG gradient definition */}
      <svg width={0} height={0} style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
      </svg>

      <svg width={size} height={size}>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        {/* Fill */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: 'stroke-dashoffset 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
            filter: `drop-shadow(0 0 8px ${typeof color === 'string' && color.startsWith('#') ? color + '60' : 'rgba(124,58,237,0.4)'})`
          }}
        />
      </svg>

      <div className="ring-value" style={{ fontFamily: "'Poppins',sans-serif" }}>
        <span style={{ fontSize: size * 0.18, fontWeight: 700 }}>{Math.round(animatedValue)}</span>
        <span style={{ fontSize: size * 0.1, fontWeight: 500, opacity: 0.7 }}>%</span>
      </div>
    </div>
  )
}

export default ConfidenceRing
