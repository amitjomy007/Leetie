'use client'

import { useState, useRef, useEffect } from 'react'
import { DATE_RANGES } from '@/lib/csv'
import { SORT_OPTIONS } from '@/lib/filters'
import { ChevronDown, ArrowUpDown, Star, EyeOff, Eye } from 'lucide-react'

const DIFFICULTIES = [
  { key: 'ALL',    label: 'All Difficulties', color: 'var(--text)' },
  { key: 'EASY',   label: 'Easy',             color: 'var(--green)' },
  { key: 'MEDIUM', label: 'Medium',           color: 'var(--yellow)' },
  { key: 'HARD',   label: 'Hard',             color: 'var(--red)' },
]

function Dropdown({ value, options, onSelect, renderLabel, renderOption, minWidth = 140 }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handler(e) { if (!ref.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const selected = options.find((o) => o.key === value)

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px',
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 7, color: 'var(--text)', fontSize: 13, cursor: 'pointer',
          whiteSpace: 'nowrap', minWidth, justifyContent: 'space-between', transition: 'border-color 0.15s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--border-bright)')}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
      >
        <span>{renderLabel ? renderLabel(selected) : selected?.label}</span>
        <ChevronDown size={13} style={{ color: 'var(--text-dim)', flexShrink: 0 }} />
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 5px)', left: 0,
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 8, zIndex: 100, minWidth, boxShadow: '0 8px 24px rgba(0,0,0,0.5)', overflow: 'hidden',
        }}>
          {options.map((opt) => (
            <button
              key={opt.key}
              onMouseDown={(e) => { e.preventDefault(); onSelect(opt.key); setOpen(false) }}
              style={{
                display: 'block', width: '100%', padding: '9px 14px',
                background: opt.key === value ? 'var(--bg-hover)' : 'none',
                border: 'none', borderBottom: '1px solid var(--border)',
                textAlign: 'left', fontSize: 13, cursor: 'pointer', transition: 'background 0.1s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-hover)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = opt.key === value ? 'var(--bg-hover)' : 'none')}
            >
              {renderOption ? renderOption(opt) : <span style={{ color: 'var(--text)' }}>{opt.label}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function FilterBar({ filters, onChange, showTags, onToggleTags }) {
  const { range, sort, difficulty, hideCompleted, starred } = filters

  function set(key, value) { onChange({ ...filters, [key]: value }) }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
      <Dropdown
        value={range} options={DATE_RANGES} onSelect={(v) => set('range', v)} minWidth={130}
        renderLabel={(opt) => <span style={{ color: 'var(--accent)', fontSize: 13 }}>{opt?.label ?? 'Range'}</span>}
        renderOption={(opt) => <span style={{ color: opt.key === range ? 'var(--accent)' : 'var(--text-muted)' }}>{opt.label}</span>}
      />

      <Dropdown
        value={difficulty} options={DIFFICULTIES} onSelect={(v) => set('difficulty', v)} minWidth={152}
        renderLabel={(opt) => <span style={{ color: opt?.color ?? 'var(--text)', fontSize: 13 }}>{opt?.label ?? 'Difficulty'}</span>}
        renderOption={(opt) => <span style={{ color: opt.color, fontSize: 13 }}>{opt.label}</span>}
      />

      <Dropdown
        value={sort} options={SORT_OPTIONS} onSelect={(v) => set('sort', v)} minWidth={150}
        renderLabel={(opt) => (
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 13 }}>
            <ArrowUpDown size={13} />{opt?.label ?? 'Sort'}
          </span>
        )}
        renderOption={(opt) => <span style={{ color: opt.key === sort ? 'var(--text)' : 'var(--text-muted)', fontSize: 13 }}>{opt.label}</span>}
      />

      <div style={{ width: 1, height: 22, background: 'var(--border)', margin: '0 2px' }} />

      <button
        onClick={() => set('starred', !starred)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '7px 13px',
          background: starred ? 'var(--blue-dim)' : 'var(--bg-card)',
          border: '1px solid ' + (starred ? 'rgba(88,166,255,0.35)' : 'var(--border)'),
          borderRadius: 7, color: starred ? 'var(--blue)' : 'var(--text-muted)',
          fontSize: 13, cursor: 'pointer', transition: 'all 0.15s',
        }}
      >
        <Star size={13} fill={starred ? 'currentColor' : 'none'} />
        Starred
      </button>

      <button
        onClick={() => set('hideCompleted', !hideCompleted)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '7px 13px',
          background: hideCompleted ? 'var(--green-dim)' : 'var(--bg-card)',
          border: '1px solid ' + (hideCompleted ? 'rgba(63,185,80,0.35)' : 'var(--border)'),
          borderRadius: 7, color: hideCompleted ? 'var(--green)' : 'var(--text-muted)',
          fontSize: 13, cursor: 'pointer', transition: 'all 0.15s',
        }}
      >
        <EyeOff size={13} />
        Hide Done
      </button>

      <button
        onClick={onToggleTags}
        title={showTags ? 'Hide all tags' : 'Reveal all tags'}
        style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '7px 13px',
          background: showTags ? 'rgba(240,136,62,0.08)' : 'var(--bg-card)',
          border: '1px solid ' + (showTags ? 'rgba(240,136,62,0.35)' : 'var(--border)'),
          borderRadius: 7, color: showTags ? 'var(--accent)' : 'var(--text-muted)',
          fontSize: 13, cursor: 'pointer', transition: 'all 0.15s',
        }}
      >
        {showTags ? <Eye size={13} /> : <EyeOff size={13} />}
        {showTags ? 'Tags On' : 'Tags Off'}
      </button>
    </div>
  )
}
