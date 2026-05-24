'use client'

import { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw, ExternalLink, Timer } from 'lucide-react'

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

// Only one timer active at a time — module-level signal
let activeTimerTitle = null
const activeTimerListeners = new Set()

function setActiveTimer(title) {
  activeTimerTitle = title
  activeTimerListeners.forEach((fn) => fn(title))
}

export default function ProblemTimer({
  title,
  link,
  onStartTimer,
  onPauseTimer,
  onResetTimer,
  timerState,
}) {
  const { timerStartedAt, timerPausedAt, timerElapsed = 0 } = timerState ?? {}
  const [display, setDisplay] = useState(timerElapsed)
  const [showPrompt, setShowPrompt] = useState(false)
  const [activeTitle, setActiveTitleLocal] = useState(activeTimerTitle)
  const intervalRef = useRef(null)

  const isRunning = !!(timerStartedAt && !timerPausedAt)
  const hasStarted = !!(timerStartedAt || timerElapsed > 0)
  const isAnotherTimerRunning = activeTitle && activeTitle !== title

  useEffect(() => {
    activeTimerListeners.add(setActiveTitleLocal)
    return () => activeTimerListeners.delete(setActiveTitleLocal)
  }, [])

  useEffect(() => {
    if (isRunning) {
      setActiveTimer(title)
      const startEpoch = new Date(timerStartedAt).getTime()
      intervalRef.current = setInterval(() => {
        setDisplay(timerElapsed + Math.floor((Date.now() - startEpoch) / 1000))
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
      setDisplay(timerElapsed)
      if (activeTimerTitle === title && !isRunning) setActiveTimer(null)
    }
    return () => clearInterval(intervalRef.current)
  }, [isRunning, timerStartedAt, timerElapsed, title])

  function openLeetCode() {
    window.open(
      link || `https://leetcode.com/problems/${title.toLowerCase().replace(/\s+/g, '-')}`,
      '_blank'
    )
  }

  function handleSolveClick() {
    setShowPrompt(true)
  }

  function handleStartWithTimer() {
    setShowPrompt(false)
    // Pause any other running timer — we signal via the module-level active title
    // The other timer component will detect via the listener that it should pause
    if (activeTimerTitle && activeTimerTitle !== title) {
      // dispatch a custom event so the other component pauses itself
      window.dispatchEvent(new CustomEvent('leetie:pauseOtherTimer', { detail: { except: title } }))
    }
    onStartTimer(title, new Date().toISOString())
    openLeetCode()
  }

  function handleSolveWithoutTimer() {
    setShowPrompt(false)
    openLeetCode()
  }

  function handlePause() {
    const elapsed = timerElapsed + Math.floor((Date.now() - new Date(timerStartedAt).getTime()) / 1000)
    onPauseTimer(title, elapsed)
    setActiveTimer(null)
  }

  function handleReset() {
    onResetTimer(title)
    setDisplay(0)
    setActiveTimer(null)
  }

  // Listen for pause-other-timer events
  useEffect(() => {
    function handler(e) {
      if (e.detail.except !== title && isRunning) {
        const elapsed = timerElapsed + Math.floor((Date.now() - new Date(timerStartedAt).getTime()) / 1000)
        onPauseTimer(title, elapsed)
      }
    }
    window.addEventListener('leetie:pauseOtherTimer', handler)
    return () => window.removeEventListener('leetie:pauseOtherTimer', handler)
  }, [title, isRunning, timerElapsed, timerStartedAt, onPauseTimer])

  const btnBase = {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: 32, height: 32, border: '1px solid var(--border)', borderRadius: 6,
    cursor: 'pointer', transition: 'all 0.12s', flexShrink: 0,
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, position: 'relative' }}>
      {hasStarted && (
        <span style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: 13,
          color: isRunning ? 'var(--green)' : 'var(--text-muted)',
          minWidth: 48, textAlign: 'right', fontVariantNumeric: 'tabular-nums',
        }}>
          {formatTime(display)}
        </span>
      )}

      {!isRunning ? (
        <button
          onClick={handleSolveClick}
          title="Solve this problem"
          style={{
            ...btnBase, width: 'auto', padding: '0 12px', gap: 6,
            background: 'var(--accent-dim)', border: '1px solid rgba(240,136,62,0.3)',
            color: 'var(--accent)', fontSize: 12, fontWeight: 500,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(240,136,62,0.6)')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(240,136,62,0.3)')}
        >
          <Play size={13} />
          <span>Solve</span>
          <ExternalLink size={11} style={{ opacity: 0.7 }} />
        </button>
      ) : (
        <button
          onClick={handlePause}
          title="Pause timer"
          style={{ ...btnBase, background: 'var(--bg-hover)', color: 'var(--text-muted)' }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--border-bright)')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
        >
          <Pause size={14} />
        </button>
      )}

      {hasStarted && (
        <button
          onClick={handleReset}
          title="Reset timer"
          style={{ ...btnBase, background: 'none', color: 'var(--text-dim)' }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--border-bright)')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
        >
          <RotateCcw size={13} />
        </button>
      )}

      {/* Timer prompt modal */}
      {showPrompt && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 300 }}
            onClick={() => setShowPrompt(false)}
          />
          <div
            style={{
              position: 'absolute', right: 0, top: 'calc(100% + 8px)',
              background: 'var(--bg-card)', border: '1px solid var(--border-bright)',
              borderRadius: 10, zIndex: 400, width: 260,
              boxShadow: '0 16px 48px rgba(0,0,0,0.6)', padding: 16,
            }}
          >
            <p style={{ fontSize: 13, color: 'var(--text)', marginBottom: 4, fontWeight: 500 }}>
              Open in LeetCode
            </p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14, lineHeight: 1.5 }}>
              Do you want to start a timer?
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              <button
                onClick={handleStartWithTimer}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px',
                  background: 'var(--accent-dim)', border: '1px solid rgba(240,136,62,0.35)',
                  borderRadius: 7, color: 'var(--accent)', fontSize: 12, cursor: 'pointer', fontWeight: 500,
                }}
              >
                <Timer size={13} /> Start timer + open LeetCode
              </button>
              <button
                onClick={handleSolveWithoutTimer}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px',
                  background: 'none', border: '1px solid var(--border)',
                  borderRadius: 7, color: 'var(--text-muted)', fontSize: 12, cursor: 'pointer',
                }}
              >
                <ExternalLink size={13} /> Just open LeetCode
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
