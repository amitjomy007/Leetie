'use client'

import { useMemo } from 'react'

export default function StatsBar({ problems, problemStates }) {
  const stats = useMemo(() => {
    const total = problems.length
    const done = problems.filter((p) => problemStates[p.title]?.done).length
    const easy = problems.filter((p) => p.difficulty === 'EASY').length
    const medium = problems.filter((p) => p.difficulty === 'MEDIUM').length
    const hard = problems.filter((p) => p.difficulty === 'HARD').length
    return { total, done, easy, medium, hard }
  }, [problems, problemStates])

  const pct = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        padding: '10px 16px',
        background: 'var(--bg-card)',
        borderBottom: '1px solid var(--border)',
        fontSize: 11,
        flexWrap: 'wrap',
      }}
    >
      <span style={{ color: 'var(--text-muted)' }}>
        <span style={{ color: 'var(--text)', fontWeight: 500 }}>{stats.done}</span>
        <span style={{ color: 'var(--text-dim)' }}>/{stats.total}</span>
        &nbsp;completed&nbsp;
        <span style={{ color: 'var(--accent)' }}>({pct}%)</span>
      </span>

      <div style={{ flex: 1, height: 3, background: 'var(--border)', borderRadius: 2, minWidth: 80 }}>
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: 'var(--accent)',
            borderRadius: 2,
            transition: 'width 0.4s ease',
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: 14 }}>
        <span>
          <span style={{ color: 'var(--green)' }}>{stats.easy}</span>
          <span style={{ color: 'var(--text-dim)' }}> easy</span>
        </span>
        <span>
          <span style={{ color: 'var(--yellow)' }}>{stats.medium}</span>
          <span style={{ color: 'var(--text-dim)' }}> med</span>
        </span>
        <span>
          <span style={{ color: 'var(--red)' }}>{stats.hard}</span>
          <span style={{ color: 'var(--text-dim)' }}> hard</span>
        </span>
      </div>
    </div>
  )
}
