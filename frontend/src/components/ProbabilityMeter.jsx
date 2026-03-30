function ProbabilityMeter({ label, confidence }) {
  const percentage = Number(confidence)
  const isReal = label !== 'Fake'

  return (
    <div style={{ marginTop: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '8px' }}>
        <span style={{ color: 'var(--text-secondary)', fontWeight: 500, fontFamily: "'Poppins',sans-serif" }}>Confidence</span>
        <span style={{
          fontWeight: 700,
          color: isReal ? '#4ade80' : '#f87171',
          fontFamily: "'Courier Prime',monospace",
          fontSize: '1rem'
        }}>
          {confidence}%
        </span>
      </div>
      <div className="progress-track">
        <div className={`progress-fill ${isReal ? 'fill-green' : 'fill-red'}`} style={{ width: `${percentage}%` }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '6px' }}>
        <span>0%</span><span>50%</span><span>100%</span>
      </div>
    </div>
  )
}

export default ProbabilityMeter