'use client'

import { useState, useRef, useEffect } from 'react'
import { StickyNote, X, Check, Eye, EyeOff, Lock } from 'lucide-react'

function HiddenSection({ value, onChange }) {
  const [revealed, setRevealed] = useState(false)

  return (
    <div style={{ marginTop: 8 }}>
      <button
        onClick={() => setRevealed((v) => !v)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          width: '100%', padding: '7px 10px',
          background: revealed ? 'rgba(88,166,255,0.07)' : 'rgba(255,255,255,0.03)',
          border: '1px dashed ' + (revealed ? 'rgba(88,166,255,0.3)' : 'var(--border)'),
          borderRadius: 6, cursor: 'pointer',
          color: revealed ? 'var(--blue)' : 'var(--text-dim)', fontSize: 11,
          transition: 'all 0.15s',
        }}
      >
        <Lock size={11} />
        <span style={{ flex: 1, textAlign: 'left' }}>
          {revealed ? 'Hide secret note' : 'Reveal secret note'}
        </span>
        {revealed ? <EyeOff size={11} /> : <Eye size={11} />}
      </button>

      {revealed && (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Secret note — only shown when revealed..."
          style={{
            marginTop: 6, width: '100%', height: 80,
            background: 'rgba(88,166,255,0.04)',
            border: '1px solid rgba(88,166,255,0.2)',
            borderRadius: 6, color: 'var(--text)', fontSize: 12,
            padding: '8px 10px', resize: 'vertical', outline: 'none', lineHeight: 1.6,
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(88,166,255,0.4)')}
          onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(88,166,255,0.2)')}
        />
      )}
    </div>
  )
}

// note is stored as JSON: { main: string, secret: string }
function parseNote(raw) {
  if (!raw) return { main: '', secret: '' }
  try {
    const parsed = JSON.parse(raw)
    if (typeof parsed === 'object' && parsed !== null) return { main: parsed.main ?? '', secret: parsed.secret ?? '' }
  } catch {}
  // legacy plain string
  return { main: raw, secret: '' }
}

function serializeNote(obj) {
  if (!obj.main && !obj.secret) return ''
  return JSON.stringify(obj)
}

export default function NoteEditor({ title, note, onSave }) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(() => parseNote(note))
  const textareaRef = useRef(null)

  useEffect(() => {
    if (open) {
      setDraft(parseNote(note))
      setTimeout(() => textareaRef.current?.focus(), 50)
    }
  }, [open, note])

  function save() {
    onSave(title, serializeNote(draft))
    setOpen(false)
  }

  const parsed = parseNote(note)
  const hasNote = !!(parsed.main || parsed.secret)

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        title={hasNote ? 'View / edit note' : 'Add a note'}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 32, height: 32,
          background: hasNote ? 'var(--yellow-dim)' : 'transparent',
          border: '1px solid ' + (hasNote ? 'rgba(210,153,34,0.35)' : 'var(--border)'),
          borderRadius: 6, color: hasNote ? 'var(--yellow)' : 'var(--text-dim)',
          cursor: 'pointer', transition: 'all 0.12s', flexShrink: 0,
        }}
        onMouseEnter={(e) => { if (!hasNote) { e.currentTarget.style.borderColor = 'var(--border-bright)'; e.currentTarget.style.color = 'var(--text-muted)' } }}
        onMouseLeave={(e) => { if (!hasNote) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-dim)' } }}
      >
        <StickyNote size={15} />
      </button>

      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 199 }} onClick={save} />
          <div
            style={{
              position: 'absolute', right: 0, top: 'calc(100% + 6px)', width: 310,
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 10, zIndex: 200,
              boxShadow: '0 12px 40px rgba(0,0,0,0.6)', padding: 14,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 500 }}>
                Note
              </span>
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)', padding: 2 }}>
                <X size={13} />
              </button>
            </div>

            <textarea
              ref={textareaRef}
              value={draft.main}
              onChange={(e) => setDraft((d) => ({ ...d, main: e.target.value }))}
              placeholder="Approach, hints, edge cases..."
              style={{
                width: '100%', height: 100,
                background: 'var(--bg)', border: '1px solid var(--border)',
                borderRadius: 7, color: 'var(--text)', fontSize: 13,
                padding: '9px 11px', resize: 'vertical', outline: 'none', lineHeight: 1.6,
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--border-bright)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
            />

            <HiddenSection
              value={draft.secret}
              onChange={(v) => setDraft((d) => ({ ...d, secret: v }))}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
              <button
                onClick={save}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '7px 14px',
                  background: 'var(--accent-dim)', border: '1px solid rgba(240,136,62,0.3)',
                  borderRadius: 6, color: 'var(--accent)', fontSize: 12, fontWeight: 500, cursor: 'pointer',
                }}
              >
                <Check size={13} /> Save
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
