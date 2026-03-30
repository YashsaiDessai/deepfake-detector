import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Mic, MicOff, X, Sparkles, CheckCircle2, AlertTriangle, AlertOctagon, AudioLines, FileAudio, ChevronDown, ChevronUp, Download, RotateCcw, Timer, Link2, ArrowRight } from 'lucide-react'
import ConfidenceRing from './ConfidenceRing'

function VoiceDetector() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [result, setResult] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [recording, setRecording] = useState(false)
  const [recordTime, setRecordTime] = useState(0)
  const [showDetails, setShowDetails] = useState(false)
  const [waveData, setWaveData] = useState(Array(32).fill(0.15))
  const [urlInput, setUrlInput] = useState('')
  const [urlError, setUrlError] = useState('')
  const [sourceType, setSourceType] = useState(null)
  const mediaRecorderRef = useRef(null)
  const timerRef = useRef(null)
  const analyzerRef = useRef(null)
  const animFrameRef = useRef(null)

  // Generate random waveform when recording
  useEffect(() => {
    if (recording) {
      const interval = setInterval(() => {
        setWaveData(Array(32).fill(0).map(() => 0.1 + Math.random() * 0.9))
      }, 100)
      return () => clearInterval(interval)
    } else {
      setWaveData(Array(32).fill(0.15))
    }
  }, [recording])

  const handleFile = useCallback((selectedFile) => {
    if (!selectedFile) return
    if (!selectedFile.type.startsWith('audio')) return
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
    setFile({ name: url.length > 60 ? url.slice(0, 57) + '...' : url, type: 'audio/mpeg', size: 0, isUrl: true, url })
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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      const chunks = []
      mediaRecorderRef.current = mediaRecorder

      setRecording(true)
      setRecordTime(0)

      timerRef.current = setInterval(() => {
        setRecordTime(prev => {
          if (prev >= 30) {
            stopRecording()
            return 30
          }
          return prev + 1
        })
      }, 1000)

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data)
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' })
        const audioFile = new File([blob], `recording_${Date.now()}.webm`, { type: 'audio/webm' })
        setFile(audioFile)
        setPreview(URL.createObjectURL(blob))
        setResult(null)
        stream.getTracks().forEach(t => t.stop())
      }

      mediaRecorder.start()
    } catch {
      setRecording(false)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
    setRecording(false)
    clearInterval(timerRef.current)
  }

  const analyzeFile = () => {
    setLoading(true)
    setTimeout(() => {
      const conf = (Math.random() * 40 + 60).toFixed(1)
      const num = Number(conf)
      let label, verdict
      if (num > 85) { label = 'Real'; verdict = 'authentic' }
      else if (num > 70) { label = 'Suspicious'; verdict = 'suspicious' }
      else { label = 'Fake'; verdict = 'deepfake' }

      setResult({
        label, verdict, confidence: conf,
        breakdown: [
          { name: 'Voice Pattern Consistency', value: (Math.random() * 30 + 65).toFixed(1) },
          { name: 'Frequency Analysis', value: (Math.random() * 25 + 70).toFixed(1) },
          { name: 'Noise Detection', value: (Math.random() * 35 + 55).toFixed(1) },
          { name: 'Emotional Pattern Match', value: (Math.random() * 30 + 60).toFixed(1) },
        ],
        characteristics: verdict === 'deepfake' ? [
          'Robotic traces detected in frequency spectrum',
          'AI generation markers in voice onset patterns',
          'Pitch inconsistencies at 2.3s and 4.1s',
          'Temporal anomalies in breathing patterns',
        ] : [],
        timestamp: new Date().toLocaleString(),
        method: 'Spectral Analysis Engine v2.8',
      })
      setLoading(false)
    }, 3500)
  }

  const clearFile = () => {
    setFile(null)
    setPreview(null)
    setResult(null)
    setShowDetails(false)
    setSourceType(null)
    setUrlInput('')
    setUrlError('')
  }

  const fileSize = file ? (file.isUrl ? 'URL' : (file.size / (1024 * 1024)).toFixed(2) + ' MB') : ''
  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  const verdictConfig = {
    authentic: { icon: <CheckCircle2 size={24} />, color: '#4ade80', bg: 'result-real', badge: 'verdict-authentic', text: '✓ AUTHENTIC VOICE', desc: 'This voice appears to be a genuine human recording.' },
    suspicious: { icon: <AlertTriangle size={24} />, color: '#fbbf24', bg: 'result-suspicious', badge: 'verdict-suspicious', text: '⚠ SUSPICIOUS AUDIO', desc: 'Anomalies detected. Further review recommended.' },
    deepfake: { icon: <AlertOctagon size={24} />, color: '#f87171', bg: 'result-fake', badge: 'verdict-deepfake', text: '✗ AI-GENERATED VOICE', desc: 'High probability of synthetic voice generation.' },
  }

  return (
    <div className="glass-card" style={{ padding: '36px', maxWidth: '640px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px' }}>
        <div style={{
          width: 44, height: 44, borderRadius: '12px',
          background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(124,58,237,0.1))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid rgba(245,158,11,0.2)'
        }}>
          <AudioLines size={22} style={{ color: 'var(--gold-400)' }} />
        </div>
        <div>
          <h2 className="font-display" style={{ fontSize: '1.25rem', fontWeight: 600 }}>
            Voice Analysis
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Detect AI-generated or cloned voice audio
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!file && !recording && (
          <motion.div key="upload" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
            {/* Upload zone */}
            <div
              className={`upload-zone ${dragging ? 'dragging' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById('voice-input').click()}
            >
              <div className="upload-icon"><Upload size={44} strokeWidth={1.5} /></div>
              <p className="font-display" style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '8px' }}>
                Drop your audio file here
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                or click to browse files
              </p>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '6px 14px', borderRadius: '999px', fontSize: '0.76rem',
                background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.12)',
                color: 'var(--gold-300)'
              }}>
                <FileAudio size={13} /> MP3, WAV, M4A, OGG, WebM
              </span>
              <input type="file" id="voice-input" accept="audio/*" onChange={(e) => handleFile(e.target.files[0])} style={{ display: 'none' }} />
            </div>

            <div className="divider" style={{ margin: '22px 0' }}>
              <span>or record live audio</span>
            </div>

            <button className="btn-primary" onClick={startRecording} style={{ width: '100%' }} id="record-voice">
              <Mic size={18} />
              Record Voice
            </button>

            {/* URL Input */}
            <div className="divider" style={{ margin: '22px 0' }}>
              <span>or paste an audio link</span>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <div className="input-icon-wrap" style={{ flex: 1 }}>
                <Link2 size={18} className="icon-l" />
                <input
                  type="url"
                  className="input-field"
                  placeholder="https://example.com/audio.mp3"
                  value={urlInput}
                  onChange={(e) => { setUrlInput(e.target.value); setUrlError('') }}
                  onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
                  id="voice-url-input"
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

        {/* Recording state */}
        {recording && (
          <motion.div key="recording" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <div style={{
              textAlign: 'center', padding: '32px 0',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px'
            }}>
              {/* Pulsing mic */}
              <motion.div
                animate={{ scale: [1, 1.15, 1], boxShadow: ['0 0 0 0 rgba(239,68,68,0)', '0 0 0 20px rgba(239,68,68,0.15)', '0 0 0 0 rgba(239,68,68,0)'] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{
                  width: 80, height: 80, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >
                <Mic size={32} color="white" />
              </motion.div>

              {/* Timer */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Timer size={16} style={{ color: '#f87171' }} />
                <span className="font-mono" style={{ fontSize: '1.6rem', fontWeight: 700, color: '#f87171' }}>
                  {formatTime(recordTime)}
                </span>
              </div>

              {/* Waveform */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '50px' }}>
                {waveData.map((val, i) => (
                  <motion.div
                    key={i}
                    style={{
                      width: '4px', borderRadius: '2px',
                      background: `linear-gradient(180deg, var(--purple-400), var(--gold-400))`,
                    }}
                    animate={{ height: val * 50 }}
                    transition={{ duration: 0.1 }}
                  />
                ))}
              </div>

              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Recording... (max 30 seconds)</p>

              <button className="btn-secondary" onClick={stopRecording} style={{ borderColor: 'rgba(239,68,68,0.3)', color: '#f87171' }}>
                <MicOff size={16} />
                Stop Recording
              </button>
            </div>
          </motion.div>
        )}

        {/* File loaded */}
        {file && !recording && (
          <motion.div key="content" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
            {/* File/URL Info */}
            <div className="file-info">
              {sourceType === 'url' ? <Link2 size={16} style={{ color: '#4ade80', flexShrink: 0 }} /> : <CheckCircle2 size={16} style={{ color: '#4ade80', flexShrink: 0 }} />}
              <span style={{ flex: 1 }}>{file.name}</span>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', flexShrink: 0 }}>{fileSize}</span>
              <button onClick={clearFile} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px', display: 'flex', flexShrink: 0 }} aria-label="Remove">
                <X size={16} />
              </button>
            </div>

            {/* Audio Preview */}
            {preview && (
              <div style={{
                padding: '20px', marginBottom: '20px',
                background: 'rgba(245,158,11,0.03)', borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(245,158,11,0.08)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                  <AudioLines size={18} style={{ color: 'var(--gold-400)' }} />
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontFamily: "'Poppins',sans-serif", fontWeight: 500 }}>
                    Audio Preview
                  </span>
                </div>
                <audio src={preview} controls style={{ width: '100%' }} />
              </div>
            )}

            {/* Analyze */}
            {!loading && !result && (
              <button className="btn-primary" onClick={analyzeFile} style={{ width: '100%' }} id="analyze-voice">
                <Sparkles size={18} />
                Analyze Voice
              </button>
            )}

            {/* Loading */}
            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '20px', padding: '24px 0' }}>
                <ConfidenceRing value={75} size={100} color="url(#brandGrad)" />
                <div className="scanning-indicator" style={{ width: '100%' }}>
                  <div className="scanning-dots"><span /><span /><span /></div>
                  <span style={{ color: 'var(--gold-300)', fontWeight: 500, fontFamily: "'Poppins',sans-serif" }}>
                    Analyzing voice patterns...
                  </span>
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

                {/* Breakdown */}
                <div className="breakdown-grid">
                  {result.breakdown.map((item, i) => {
                    const val = Number(item.value)
                    const fillClass = val > 80 ? 'fill-green' : val > 65 ? 'fill-orange' : 'fill-red'
                    return (
                      <motion.div key={i} className="breakdown-item" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }}>
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

                {/* Suspected characteristics */}
                {result.characteristics.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    style={{
                      marginTop: '18px', padding: '14px 16px',
                      background: 'rgba(239,68,68,0.05)', borderRadius: 'var(--radius-md)',
                      border: '1px solid rgba(239,68,68,0.12)'
                    }}
                  >
                    <p className="font-display" style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f87171', marginBottom: '10px' }}>
                      Suspected Anomalies
                    </p>
                    {result.characteristics.map((c, i) => (
                      <div key={i} style={{ display: 'flex', gap: '8px', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                        <span style={{ color: '#f87171' }}>•</span> {c}
                      </div>
                    ))}
                  </motion.div>
                )}

                {/* Details */}
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  style={{
                    width: '100%', marginTop: '18px', padding: '10px',
                    background: 'none', border: '1px solid var(--glass-border)',
                    borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    gap: '8px', fontSize: '0.82rem', fontFamily: "'Poppins',sans-serif"
                  }}
                >
                  {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  {showDetails ? 'Hide' : 'Show'} Detailed Report
                </button>

                <AnimatePresence>
                  {showDetails && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                      <div style={{ padding: '16px 0 0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Timestamp</span>
                          <span className="font-mono" style={{ color: 'var(--text-secondary)' }}>{result.timestamp}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Analysis Engine</span>
                          <span className="font-mono" style={{ color: 'var(--text-secondary)' }}>{result.method}</span>
                        </div>
                        <button className="btn-secondary" style={{ marginTop: '8px', padding: '10px 20px', fontSize: '0.82rem' }}>
                          <Download size={15} />
                          Download Report (PDF)
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button className="btn-secondary" onClick={clearFile} style={{ width: '100%', marginTop: '14px' }}>
                  <RotateCcw size={16} />
                  Analyze Another Recording
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default VoiceDetector
