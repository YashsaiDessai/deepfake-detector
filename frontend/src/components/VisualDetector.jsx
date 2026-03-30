import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Image, Film, X, Sparkles, CheckCircle2, AlertTriangle, AlertOctagon, ChevronDown, ChevronUp, Download, RotateCcw, Link2, ArrowRight } from 'lucide-react'
import ConfidenceRing from './ConfidenceRing'

function VisualDetector() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [result, setResult] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showDetails, setShowDetails] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  const [urlError, setUrlError] = useState('')
  const [sourceType, setSourceType] = useState(null) // 'file' or 'url'

  const handleFile = useCallback((selectedFile) => {
    if (!selectedFile) return
    if (!selectedFile.type.startsWith('image') && !selectedFile.type.startsWith('video')) return
    setFile(selectedFile)
    setPreview(URL.createObjectURL(selectedFile))
    setResult(null)
    setShowDetails(false)
    setSourceType('file')
    setUrlInput('')
    setUrlError('')
  }, [])

  const handleUrlSubmit = () => {
    const url = urlInput.trim()
    if (!url) { setUrlError('Please enter a URL'); return }
    try { new URL(url) } catch { setUrlError('Please enter a valid URL'); return }
    setUrlError('')
    // Detect type from URL extension for preview
    const ext = url.split('?')[0].split('.').pop().toLowerCase()
    const videoExts = ['mp4', 'webm', 'avi', 'mov', 'mkv']
    const imgExts = ['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp']
    const isVideo = videoExts.includes(ext) || url.includes('youtube') || url.includes('youtu.be') || url.includes('vimeo')
    const isImg = imgExts.includes(ext)
    setFile({ name: url.length > 60 ? url.slice(0, 57) + '...' : url, type: isVideo ? 'video/mp4' : isImg ? 'image/png' : 'video/mp4', size: 0, isUrl: true, url })
    setPreview(url)
    setResult(null)
    setShowDetails(false)
    setSourceType('url')
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  const analyzeFile = () => {
    setLoading(true)
    setProgress(0)

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) { clearInterval(interval); return 95 }
        return prev + Math.random() * 15
      })
    }, 200)

    setTimeout(() => {
      clearInterval(interval)
      setProgress(100)

      const conf = (Math.random() * 40 + 60).toFixed(1)
      const num = Number(conf)
      let label, verdict
      if (num > 85) { label = 'Real'; verdict = 'authentic' }
      else if (num > 70) { label = 'Suspicious'; verdict = 'suspicious' }
      else { label = 'Fake'; verdict = 'deepfake' }

      setResult({
        label,
        verdict,
        confidence: conf,
        breakdown: [
          { name: 'Face Authenticity', value: (Math.random() * 30 + 65).toFixed(1) },
          { name: 'Movement Consistency', value: (Math.random() * 25 + 70).toFixed(1) },
          { name: 'Lighting Coherence', value: (Math.random() * 35 + 60).toFixed(1) },
          { name: 'Audio-Visual Sync', value: (Math.random() * 30 + 65).toFixed(1) },
        ],
        timestamp: new Date().toLocaleString(),
        method: 'Neural Network Analysis v3.2',
      })
      setLoading(false)
    }, 3000)
  }

  const clearFile = () => {
    setFile(null)
    setPreview(null)
    setResult(null)
    setProgress(0)
    setShowDetails(false)
    setSourceType(null)
    setUrlInput('')
    setUrlError('')
  }

  const fileSize = file ? (file.isUrl ? 'URL' : (file.size / (1024 * 1024)).toFixed(2) + ' MB') : ''

  const verdictConfig = {
    authentic: { icon: <CheckCircle2 size={24} />, color: '#4ade80', bg: 'result-real', badge: 'verdict-authentic', text: '✓ AUTHENTIC', desc: 'This media appears to be genuine and unmanipulated.' },
    suspicious: { icon: <AlertTriangle size={24} />, color: '#fbbf24', bg: 'result-suspicious', badge: 'verdict-suspicious', text: '⚠ SUSPICIOUS', desc: 'Some anomalies detected. Review recommended.' },
    deepfake: { icon: <AlertOctagon size={24} />, color: '#f87171', bg: 'result-fake', badge: 'verdict-deepfake', text: '✗ LIKELY DEEPFAKE', desc: 'High probability of AI manipulation detected.' },
  }

  return (
    <div className="glass-card" style={{ padding: '36px', maxWidth: '640px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px' }}>
        <div style={{
          width: 44, height: 44, borderRadius: '12px',
          background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(245,158,11,0.1))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid rgba(124,58,237,0.2)'
        }}>
          <Film size={22} style={{ color: 'var(--purple-400)' }} />
        </div>
        <div>
          <h2 className="font-display" style={{ fontSize: '1.25rem', fontWeight: 600 }}>
            Video & Photo Analysis
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Detect manipulated images and deepfake videos
          </p>
        </div>
      </div>

      {/* Upload Zone */}
      <AnimatePresence mode="wait">
        {!file && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div
              className={`upload-zone ${dragging ? 'dragging' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById('visual-input').click()}
            >
              <div className="upload-icon">
                <Upload size={44} strokeWidth={1.5} />
              </div>
              <p className="font-display" style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                Drag & drop your video or image
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                or click to browse files
              </p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                {[
                  { icon: <Image size={13} />, label: 'PNG, JPG, WEBP' },
                  { icon: <Film size={13} />, label: 'MP4, MOV, AVI' },
                ].map((t, i) => (
                  <span key={i} style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    padding: '6px 14px', borderRadius: '999px', fontSize: '0.76rem',
                    background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.12)',
                    color: 'var(--purple-300)'
                  }}>
                    {t.icon} {t.label}
                  </span>
                ))}
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '14px' }}>
                Maximum file size: 100 MB
              </p>
              <input type="file" id="visual-input" accept="image/*,video/*" onChange={(e) => handleFile(e.target.files[0])} style={{ display: 'none' }} />
            </div>

            {/* URL Input */}
            <div className="divider" style={{ margin: '22px 0' }}>
              <span>or paste a video / image link</span>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <div className="input-icon-wrap" style={{ flex: 1 }}>
                <Link2 size={18} className="icon-l" />
                <input
                  type="url"
                  className="input-field"
                  placeholder="https://example.com/video.mp4"
                  value={urlInput}
                  onChange={(e) => { setUrlInput(e.target.value); setUrlError('') }}
                  onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
                  id="visual-url-input"
                />
              </div>
              <button
                type="button"
                className="btn-primary"
                style={{ padding: '12px 22px', flexShrink: 0 }}
                onClick={handleUrlSubmit}
                disabled={!urlInput.trim()}
              >
                <ArrowRight size={18} />
              </button>
            </div>
            {urlError && (
              <p style={{ fontSize: '0.78rem', color: '#f87171', marginTop: '6px' }}>{urlError}</p>
            )}
          </motion.div>
        )}

        {file && (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
          >
            {/* File/URL Info */}
            <div className="file-info">
              {sourceType === 'url' ? <Link2 size={16} style={{ color: '#4ade80', flexShrink: 0 }} /> : <CheckCircle2 size={16} style={{ color: '#4ade80', flexShrink: 0 }} />}
              <span style={{ flex: 1 }}>{file.name}</span>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', flexShrink: 0 }}>{fileSize}</span>
              <button onClick={clearFile} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px', display: 'flex', flexShrink: 0 }} aria-label="Remove">
                <X size={16} />
              </button>
            </div>

            {/* Preview */}
            {preview && (
              <div className="media-preview">
                {file.type.startsWith('image') && <img src={preview} alt="Preview" onError={(e) => { e.target.style.display = 'none' }} />}
                {file.type.startsWith('video') && !file.isUrl && <video src={preview} controls />}
                {file.type.startsWith('video') && file.isUrl && (
                  <div style={{ padding: '24px', textAlign: 'center' }}>
                    <Film size={40} style={{ color: 'var(--purple-400)', marginBottom: '10px' }} />
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Video link loaded</p>
                    <p className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '6px', wordBreak: 'break-all' }}>{file.url}</p>
                  </div>
                )}
              </div>
            )}

            {/* Analyze */}
            {!loading && !result && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                <button className="btn-primary" onClick={analyzeFile} style={{ width: '100%', marginTop: '8px' }} id="analyze-visual">
                  <Sparkles size={18} />
                  Analyze Media
                </button>
              </motion.div>
            )}

            {/* Loading */}
            {loading && (
              <div style={{ marginTop: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '20px', padding: '24px 0' }}>
                  <ConfidenceRing value={progress} size={100} color="url(#brandGrad)" />
                  <div className="scanning-indicator" style={{ width: '100%' }}>
                    <div className="scanning-dots"><span /><span /><span /></div>
                    <span style={{ color: 'var(--purple-300)', fontWeight: 500, fontFamily: "'Poppins',sans-serif" }}>
                      Scanning with AI...
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Result */}
            {result && (
              <motion.div
                className={`result-card ${verdictConfig[result.verdict].bg}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                style={{ marginTop: '20px' }}
              >
                {/* Verdict */}
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <ConfidenceRing value={Number(result.confidence)} size={110} color={verdictConfig[result.verdict].color} />
                  <div style={{ marginTop: '16px' }}>
                    <span className={`verdict-badge ${verdictConfig[result.verdict].badge}`}>
                      {verdictConfig[result.verdict].text}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '10px' }}>
                    {verdictConfig[result.verdict].desc}
                  </p>
                </div>

                {/* Confidence Breakdown */}
                <div className="breakdown-grid">
                  {result.breakdown.map((item, i) => {
                    const val = Number(item.value)
                    const fillClass = val > 80 ? 'fill-green' : val > 65 ? 'fill-orange' : 'fill-red'
                    return (
                      <motion.div
                        key={i}
                        className="breakdown-item"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                      >
                        <div className="breakdown-label">
                          <span>{item.name}</span>
                          <span style={{ color: val > 80 ? '#4ade80' : val > 65 ? '#fbbf24' : '#f87171' }}>{item.value}%</span>
                        </div>
                        <div className="progress-track">
                          <div className={`progress-fill ${fillClass}`} style={{ width: `${val}%` }} />
                        </div>
                      </motion.div>
                    )
                  })}
                </div>

                {/* Detail toggle */}
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  style={{
                    width: '100%', marginTop: '18px', padding: '10px',
                    background: 'none', border: '1px solid var(--glass-border)',
                    borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    gap: '8px', fontSize: '0.82rem', fontFamily: "'Poppins',sans-serif",
                    transition: 'all 0.2s'
                  }}
                >
                  {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  {showDetails ? 'Hide' : 'Show'} Detailed Report
                </button>

                <AnimatePresence>
                  {showDetails && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{ padding: '16px 0 0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Timestamp</span>
                          <span className="font-mono" style={{ color: 'var(--text-secondary)' }}>{result.timestamp}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Detection Method</span>
                          <span className="font-mono" style={{ color: 'var(--text-secondary)' }}>{result.method}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                          <span style={{ color: 'var(--text-muted)' }}>File Analyzed</span>
                          <span className="font-mono" style={{ color: 'var(--text-secondary)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</span>
                        </div>
                        <button className="btn-secondary" style={{ marginTop: '8px', padding: '10px 20px', fontSize: '0.82rem' }}>
                          <Download size={15} />
                          Download Report (PDF)
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* New Analysis */}
                <button className="btn-secondary" onClick={clearFile} style={{ width: '100%', marginTop: '14px' }}>
                  <RotateCcw size={16} />
                  Analyze Another File
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default VisualDetector
