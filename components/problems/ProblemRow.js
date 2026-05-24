'use client'

import { memo, useState } from 'react'
import { CheckCircle2, Circle, Star, ChevronDown } from 'lucide-react'
import ProblemTimer from './ProblemTimer'
import NoteEditor from './NoteEditor'

const DIFFICULTY_META = {
  EASY:   { label: 'Easy',   color: 'var(--green)',  bg: 'var(--green-dim)' },
  MEDIUM: { label: 'Medium', color: 'var(--yellow)', bg: 'var(--yellow-dim)' },
  HARD:   { label: 'Hard',   color: 'var(--red)',    bg: 'var(--red-dim)' },
}

function DifficultyBadge({ difficulty }) {
  const meta = DIFFICULTY_META[difficulty] ?? { label: difficulty, color: 'var(--text-muted)', bg: 'var(--bg-hover)' }
  return (
    <span style={{
      display: 'inline-block', fontSize: 12, fontWeight: 500,
      padding: '3px 10px', borderRadius: 4, letterSpacing: '0.02em',
      color: meta.color, background: meta.bg, flexShrink: 0, whiteSpace: 'nowrap',
    }}>
      {meta.label}
    </span>
  )
}

function TagList({ topics, showTags }) {
  const [revealed, setRevealed] = useState({})

  if (!topics || topics.length === 0) return null

  if (!showTags) {
    return (
      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 4 }}>
        {topics.slice(0, 5).map((t) => (
          <button
            key={t}
            onClick={(e) => {
              e.stopPropagation()
              setRevealed((prev) => ({ ...prev, [t]: !prev[t] }))
            }}
            style={{
              fontSize: 11, padding: '2px 8px', borderRadius: 3,
              background: revealed[t] ? 'rgba(88,166,255,0.08)' : 'rgba(255,255,255,0.03)',
              border: '1px solid ' + (revealed[t] ? 'rgba(88,166,255,0.25)' : 'var(--border)'),
              color: revealed[t] ? 'var(--blue)' : 'var(--text-dim)',
              cursor: 'pointer', transition: 'all 0.12s',
            }}
          >
            {revealed[t] ? t : '···'}
          </button>
        ))}
        {topics.length > 5 && (
          <span style={{ fontSize: 11, color: 'var(--text-dim)', alignSelf: 'center' }}>+{topics.length - 5}</span>
        )}
      </div>
    )
  }

  // showTags = true (global reveal)
  return (
    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 4 }}>
      {topics.slice(0, 6).map((t) => (
        <span key={t} style={{
          fontSize: 11, color: 'var(--blue)', background: 'rgba(88,166,255,0.08)',
          border: '1px solid rgba(88,166,255,0.2)', padding: '2px 8px', borderRadius: 3,
        }}>{t}</span>
      ))}
      {topics.length > 6 && <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>+{topics.length - 6}</span>}
    </div>
  )
}

function CompanyBadges({ companies }) {
  const [expanded, setExpanded] = useState(false)
  if (!companies || companies.length <= 1) return null

  const first = companies[0]
  const rest = companies.slice(1)

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
      <span style={{
        fontSize: 11, color: 'var(--text-dim)', background: 'var(--bg)',
        border: '1px solid var(--border)', padding: '1px 7px', borderRadius: 3, whiteSpace: 'nowrap',
      }}>
        {first}
      </span>
      {!expanded && rest.length > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); setExpanded(true) }}
          style={{
            fontSize: 11, color: 'var(--text-dim)', background: 'var(--bg)',
            border: '1px solid var(--border)', padding: '1px 7px', borderRadius: 3,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3, whiteSpace: 'nowrap',
          }}
        >
          +{rest.length} more <ChevronDown size={10} />
        </button>
      )}
      {expanded && rest.map((c) => (
        <span key={c} style={{
          fontSize: 11, color: 'var(--text-dim)', background: 'var(--bg)',
          border: '1px solid var(--border)', padding: '1px 7px', borderRadius: 3, whiteSpace: 'nowrap',
        }}>{c}</span>
      ))}
    </div>
  )
}

function ProblemRow({ problem, state, showTags, onMarkDone, onToggleStar, onSaveNote, onStartTimer, onPauseTimer, onResetTimer }) {
  const { done, doneAt, starred, note, timerStartedAt, timerPausedAt, timerElapsed } = state

  function openLeetCode(e) {
    e.stopPropagation()
    const url = problem.link || `https://leetcode.com/problems/${problem.title.toLowerCase().replace(/\s+/g, '-')}`
    window.open(url, '_blank')
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '40px 1fr 100px 80px 72px 230px',
        alignItems: 'center', gap: 16, padding: '14px 20px',
        borderBottom: '1px solid var(--border)',
        background: done ? 'rgba(63,185,80,0.025)' : 'transparent',
        transition: 'background 0.12s', opacity: done ? 0.6 : 1,
      }}
      onMouseEnter={(e) => { if (!done) e.currentTarget.style.background = 'var(--bg-hover)' }}
      onMouseLeave={(e) => { e.currentTarget.style.background = done ? 'rgba(63,185,80,0.025)' : 'transparent' }}
    >
      <button
        onClick={() => onMarkDone(problem.title)}
        title={done ? `Done — ${doneAt ? new Date(doneAt).toLocaleDateString() : ''}` : 'Mark as done'}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: done ? 'var(--green)' : 'var(--text-dim)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 0, transition: 'color 0.12s',
        }}
      >
        {done ? <CheckCircle2 size={20} /> : <Circle size={20} />}
      </button>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span
            onClick={openLeetCode}
            title="Open in LeetCode (no timer)"
            style={{
              fontSize: 14, fontWeight: 400, letterSpacing: '-0.01em',
              color: done ? 'var(--text-muted)' : 'var(--text)',
              textDecoration: done ? 'line-through' : 'none',
              textDecorationColor: 'var(--text-dim)',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => { if (!done) e.currentTarget.style.color = 'var(--blue)' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = done ? 'var(--text-muted)' : 'var(--text)' }}
          >
            {problem.title}
          </span>
          <CompanyBadges companies={problem.companies} />
        </div>
        <TagList topics={problem.topics} showTags={showTags} />
      </div>

      <DifficultyBadge difficulty={problem.difficulty} />

      <div style={{ textAlign: 'right' }}>
        <span style={{ fontSize: 14, color: 'var(--text)', fontVariantNumeric: 'tabular-nums' }}>
          {problem.frequency.toFixed(1)}
        </span>
      </div>

      <div style={{ textAlign: 'right' }}>
        <span style={{ fontSize: 14, color: 'var(--text)', fontVariantNumeric: 'tabular-nums' }}>
          {(problem.acceptance * 100).toFixed(1)}
        </span>
        <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>%</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <button
          onClick={() => onToggleStar(problem.title)}
          title="Star this problem"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 32, height: 32,
            background: starred ? 'var(--blue-dim)' : 'transparent',
            border: '1px solid ' + (starred ? 'rgba(88,166,255,0.35)' : 'var(--border)'),
            borderRadius: 6, color: starred ? 'var(--blue)' : 'var(--text-dim)',
            cursor: 'pointer', transition: 'all 0.12s', flexShrink: 0,
          }}
        >
          <Star size={15} fill={starred ? 'currentColor' : 'none'} />
        </button>

        <NoteEditor title={problem.title} note={note ?? ''} onSave={onSaveNote} />

        <ProblemTimer
          title={problem.title}
          link={problem.link}
          timerState={{ timerStartedAt, timerPausedAt, timerElapsed }}
          onStartTimer={onStartTimer}
          onPauseTimer={onPauseTimer}
          onResetTimer={onResetTimer}
        />
      </div>
    </div>
  )
}

export default memo(ProblemRow)
