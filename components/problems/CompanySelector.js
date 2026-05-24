'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { X, Search } from 'lucide-react'

const VISIBLE_LIMIT = 40

export default function CompanySelector({ companies, selected, onChange }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [visibleCount, setVisibleCount] = useState(VISIBLE_LIMIT)
  const inputRef = useRef(null)
  const containerRef = useRef(null)
  const listRef = useRef(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const pool = companies.filter((c) => !selected.includes(c))
    if (!q) return pool
    return pool.filter((c) => c.toLowerCase().includes(q))
  }, [query, companies, selected])

  const visible = filtered.slice(0, visibleCount)

  function handleScroll() {
    const el = listRef.current
    if (!el) return
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 40) {
      setVisibleCount((v) => Math.min(v + VISIBLE_LIMIT, filtered.length))
    }
  }

  const add = useCallback((company) => {
    onChange([...selected, company])
    setQuery('')
    setVisibleCount(VISIBLE_LIMIT)
    inputRef.current?.focus()
  }, [selected, onChange])

  const remove = useCallback((company) => {
    onChange(selected.filter((c) => c !== company))
  }, [selected, onChange])

  useEffect(() => {
    setVisibleCount(VISIBLE_LIMIT)
  }, [query])

  useEffect(() => {
    function handleClick(e) {
      if (!containerRef.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <div
        style={{
          display: 'flex', flexWrap: 'wrap', gap: 6, padding: '8px 12px',
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 8, minHeight: 42, cursor: 'text', transition: 'border-color 0.15s',
        }}
        onClick={() => { inputRef.current?.focus(); setOpen(true) }}
      >
        <Search size={14} style={{ color: 'var(--text-dim)', alignSelf: 'center', flexShrink: 0 }} />
        {selected.map((c) => (
          <span key={c} style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '2px 8px',
            background: 'var(--accent-dim)', border: '1px solid rgba(240,136,62,0.3)',
            borderRadius: 4, fontSize: 12, color: 'var(--accent)',
          }}>
            {c}
            <button
              onClick={(e) => { e.stopPropagation(); remove(c) }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', padding: 0, lineHeight: 1 }}
            >
              <X size={10} />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          placeholder={selected.length === 0 ? 'Filter by company...' : ''}
          style={{
            background: 'none', border: 'none', outline: 'none',
            color: 'var(--text)', fontSize: 13, flex: 1, minWidth: 120, padding: '2px 0',
          }}
        />
      </div>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 8, zIndex: 100, maxHeight: 300, overflowY: 'auto',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}
          ref={listRef}
          onScroll={handleScroll}
        >
          {visible.length === 0 && (
            <div style={{ padding: '14px 16px', fontSize: 12, color: 'var(--text-dim)' }}>
              No companies found
            </div>
          )}
          {visible.map((c) => (
            <button
              key={c}
              onMouseDown={(e) => { e.preventDefault(); add(c) }}
              style={{
                display: 'block', width: '100%', padding: '9px 14px',
                background: 'none', border: 'none',
                borderBottom: '1px solid var(--border)',
                textAlign: 'left', color: 'var(--text)', fontSize: 13,
                cursor: 'pointer', transition: 'background 0.1s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-hover)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
            >
              {c}
            </button>
          ))}
          {visibleCount < filtered.length && (
            <div style={{ padding: '10px 14px', fontSize: 11, color: 'var(--text-dim)', textAlign: 'center' }}>
              Scroll for more — {filtered.length - visibleCount} remaining
            </div>
          )}
        </div>
      )}
    </div>
  )
}
