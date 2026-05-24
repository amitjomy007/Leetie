'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { parseCSV } from '@/lib/csv'
import { sortProblems, filterProblems, deduplicateProblems } from '@/lib/filters'
import { useProblemState } from '@/lib/storage'
import ProblemRow from './ProblemRow'
import FilterBar from './FilterBar'
import StatsBar from './StatsBar'
import CompanySelector from './CompanySelector'
import { Loader, Search, Zap } from 'lucide-react'

const DEFAULT_FILTERS = {
  range: 'all',
  sort: 'frequency',
  difficulty: 'ALL',
  hideCompleted: false,
  starred: false,
}

// Each company gets a color from this palette — purely visual on the landing page
const COMPANY_COLORS = [
  { bg: 'rgba(248,81,73,0.12)',   border: 'rgba(248,81,73,0.35)',   text: '#f85149' },
  { bg: 'rgba(88,166,255,0.11)',  border: 'rgba(88,166,255,0.35)',  text: '#58a6ff' },
  { bg: 'rgba(63,185,80,0.11)',   border: 'rgba(63,185,80,0.35)',   text: '#3fb950' },
  { bg: 'rgba(240,136,62,0.12)',  border: 'rgba(240,136,62,0.35)',  text: '#f0883e' },
  { bg: 'rgba(188,140,255,0.12)', border: 'rgba(188,140,255,0.35)', text: '#bc8cff' },
  { bg: 'rgba(210,153,34,0.12)',  border: 'rgba(210,153,34,0.35)',  text: '#d29922' },
  { bg: 'rgba(248,81,73,0.12)',   border: 'rgba(248,81,73,0.35)',   text: '#f85149' },
  { bg: 'rgba(88,166,255,0.11)',  border: 'rgba(88,166,255,0.35)',  text: '#58a6ff' },
  { bg: 'rgba(63,185,80,0.11)',   border: 'rgba(63,185,80,0.35)',   text: '#3fb950' },
  { bg: 'rgba(188,140,255,0.12)', border: 'rgba(188,140,255,0.35)', text: '#bc8cff' },
]

const FAANG = [
  'Amazon', 'Apple', 'Google', 'Microsoft', 'Netflix',
  'Meta', 'Uber', 'Airbnb', 'Adobe', 'Bloomberg',
]

const dataCache = {}

// Animated "Select a company to begin" heading
function AnimatedHeading() {
  const full = 'Select a/multiple company/ies to begin'
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    let i = 0
    const id = setInterval(() => {
      i++
      setDisplayed(full.slice(0, i))
      if (i >= full.length) { clearInterval(id); setDone(true) }
    }, 38)
    return () => clearInterval(id)
  }, [])

  return (
    <p style={{
      fontSize: 13, color: 'var(--text-muted)', letterSpacing: '0.01em',
      marginBottom: 22, minHeight: 20, textAlign: 'center',
    }}>
      {displayed}
      {!done && <span className="cursor" style={{ color: 'var(--accent)' }}>|</span>}
    </p>
  )
}

export default function ProblemList({ companies }) {
  const [selectedCompanies, setSelectedCompanies] = useState([])
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [cacheVersion, setCacheVersion] = useState(0)
  const [loading, setLoading] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const [showTags, setShowTags] = useState(false)
  const [landed, setLanded] = useState(false)
  const fetchingRef = useRef(new Set())
  const selectorRef = useRef(null)

  const { getState, markDone, toggleStar, setNote, setTimerStart, pauseTimer, resetTimer, hydrated } = useProblemState()

  useEffect(() => {
    if (selectedCompanies.length > 0 && !landed) setLanded(true)
  }, [selectedCompanies])

  useEffect(() => {
    if (selectedCompanies.length === 0) return
    const { range } = filters
    const needed = selectedCompanies.filter((c) => {
      const key = `${c}:${range}`
      return !(key in dataCache) && !fetchingRef.current.has(key)
    })
    if (needed.length === 0) return

    needed.forEach((c) => fetchingRef.current.add(`${c}:${filters.range}`))
    setLoading(true)

    Promise.all(
      needed.map(async (company) => {
        const res = await fetch(`/api/problems/${encodeURIComponent(company)}?range=${filters.range}`)
        const parsed = res.ok ? parseCSV((await res.json()).csv ?? '') : []
        return { company, parsed }
      })
    ).then((results) => {
      for (const { company, parsed } of results) {
        dataCache[`${company}:${filters.range}`] = parsed
      }
      setCacheVersion((v) => v + 1)
      setLoading(false)
    })
  }, [selectedCompanies.join(','), filters.range])

  const problems = useMemo(() => {
    if (selectedCompanies.length === 0) return []
    const pwc = []
    for (const company of selectedCompanies) {
      const rows = dataCache[`${company}:${filters.range}`]
      if (!rows) continue
      for (const p of rows) pwc.push({ problem: p, company })
    }
    const deduped = deduplicateProblems(pwc)
    const statesMap = {}
    for (const p of deduped) statesMap[p.title] = getState(p.title)
    const filtered = filterProblems(deduped, { ...filters, search: searchInput, problemStates: statesMap })
    return sortProblems(filtered, filters.sort)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cacheVersion, selectedCompanies, filters, searchInput, getState])

  const allCached = selectedCompanies.length > 0 &&
    selectedCompanies.every((c) => `${c}:${filters.range}` in dataCache)
  const isRangeEmpty = allCached && problems.length === 0 &&
    !searchInput && filters.difficulty === 'ALL' && !filters.hideCompleted && !filters.starred

  const problemStates = useMemo(() => {
    const map = {}
    for (const p of problems) map[p.title] = getState(p.title)
    return map
  }, [problems, getState])

  const quickPick = FAANG.filter((c) => companies.includes(c))

  function handleQuickPick(company) {
    setSelectedCompanies([company])
  }

  function handleMoreClick() {
    setLanded(true)
    setTimeout(() => {
      selectorRef.current?.querySelector('input')?.focus()
    }, 150)
  }

  if (!hydrated) return null

  // ── LANDING ──────────────────────────────────────────────────────────────
  if (!landed) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 58px)',
        padding: '0 24px 60px',
      }}>
        {/* Logo */}
        <img
          src="/logo.png"
          alt="Leetie"
          style={{ width: 110, height: 110, borderRadius: 28, objectFit: 'contain', marginBottom: 18 }}
          onError={(e) => (e.currentTarget.style.display = 'none')}
        />

        {/* Brand name */}
        <h1 className="font-display" style={{
          fontSize: 56, fontWeight: 800, letterSpacing: '-0.04em',
          color: 'var(--text)', marginBottom: 12, textAlign: 'center', lineHeight: 1,
        }}>
          Leet<span style={{ color: 'var(--accent)' }}>ie</span>
        </h1>

        {/* Description */}
        <p style={{
          fontSize: 15, color: 'var(--text-muted)', textAlign: 'center',
          maxWidth: 460, lineHeight: 1.7, marginBottom: 48,
        }}>
          Company-wise LeetCode problems sorted by real interview frequency.
          Track progress, set timers, take notes — just a small attempt.
        </p>

        {/* Company picker card */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 16,
          padding: '32px 40px',
          width: '100%',
          maxWidth: 720,
        }}>
          <AnimatedHeading />

          {/* Colorful company buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginBottom: 16 }}>
            {quickPick.map((c, i) => {
              const col = COMPANY_COLORS[i % COMPANY_COLORS.length]
              return (
                <button
                  key={c}
                  onClick={() => handleQuickPick(c)}
                  style={{
                    padding: '11px 22px',
                    background: col.bg,
                    border: `1px solid ${col.border}`,
                    borderRadius: 9,
                    color: col.text,
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    fontFamily: 'inherit',
                    letterSpacing: '-0.01em',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = `0 6px 20px ${col.border}`
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  {c}
                </button>
              )
            })}

            {/* More button — highlighted with accent glow */}
            <button
              onClick={handleMoreClick}
              className="pulse"
              style={{
                padding: '11px 22px',
                background: 'var(--accent-dim)',
                border: '1px solid var(--accent)',
                borderRadius: 9,
                color: 'var(--accent)',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 8,
                transition: 'all 0.15s',
                fontFamily: 'inherit',
                letterSpacing: '-0.01em',
                boxShadow: '0 0 16px rgba(240,136,62,0.2)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 6px 24px rgba(240,136,62,0.35)'
                e.currentTarget.style.animationPlayState = 'paused'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 0 16px rgba(240,136,62,0.2)'
                e.currentTarget.style.animationPlayState = 'running'
              }}
            >
              <Search size={14} />
              Search among {companies.length} companies
            </button>
          </div>

          <p style={{ fontSize: 11, color: 'var(--text-dim)', textAlign: 'center' }}>
            Click any company above, or search for a specific one
          </p>
        </div>
      </div>
    )
  }

  // ── MAIN VIEW ─────────────────────────────────────────────────────────────
  return (
    <div className="fade-up">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '16px 0 12px' }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div ref={selectorRef} style={{ flex: 1 }}>
            <CompanySelector companies={companies} selected={selectedCompanies} onChange={setSelectedCompanies} />
          </div>
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search problems..."
            style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 8, color: 'var(--text)', fontSize: 13,
              padding: '9px 14px', outline: 'none', width: 220, transition: 'border-color 0.15s',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--border-bright)')}
            onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
          />
        </div>
        <FilterBar
          filters={filters} onChange={setFilters}
          showTags={showTags} onToggleTags={() => setShowTags((v) => !v)}
        />
      </div>

      {selectedCompanies.length === 0 && (
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 10, padding: '60px 0', textAlign: 'center',
        }}>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>
            Search and select a company above
          </p>
          <p style={{ fontSize: 11, color: 'var(--text-dim)' }}>
            {companies.length} companies available
          </p>
        </div>
      )}

      {selectedCompanies.length > 0 && (
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 10, overflow: 'hidden',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '40px 1fr 100px 80px 72px 230px',
            gap: 16, padding: '10px 20px',
            borderBottom: '1px solid var(--border)', background: 'var(--bg)',
          }}>
            {['', 'Problem', 'Difficulty', 'Frequency', 'Acceptance', 'Actions'].map((col) => (
              <span key={col} style={{
                fontSize: 11, color: 'var(--text-dim)',
                letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500,
              }}>
                {col}
              </span>
            ))}
          </div>

          <StatsBar problems={problems} problemStates={problemStates} />

          {loading && (
            <div style={{ padding: 48, display: 'flex', justifyContent: 'center', color: 'var(--text-dim)' }}>
              <Loader size={18} className="spin-slow" />
            </div>
          )}

          {!loading && isRangeEmpty && (
            <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-dim)', fontSize: 13 }}>
              No problems in the dataset for this time range.
            </div>
          )}

          {!loading && !isRangeEmpty && problems.length === 0 && (
            <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-dim)', fontSize: 13 }}>
              No matching problems.
            </div>
          )}

          {!loading && problems.map((problem) => (
            <ProblemRow
              key={problem.title}
              problem={problem}
              state={problemStates[problem.title] ?? {}}
              showTags={showTags}
              onMarkDone={markDone}
              onToggleStar={toggleStar}
              onSaveNote={setNote}
              onStartTimer={setTimerStart}
              onPauseTimer={pauseTimer}
              onResetTimer={resetTimer}
            />
          ))}
        </div>
      )}
    </div>
  )
}
