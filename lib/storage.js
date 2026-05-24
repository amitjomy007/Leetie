'use client'

import { useState, useEffect, useCallback } from 'react'

function useLocalStorage(key, initialValue) {
  const [state, setState] = useState(initialValue)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item !== null) setState(JSON.parse(item))
    } catch {
      // ignore
    }
    setHydrated(true)
  }, [key])

  const setValue = useCallback(
    (value) => {
      setState((prev) => {
        const next = typeof value === 'function' ? value(prev) : value
        try {
          window.localStorage.setItem(key, JSON.stringify(next))
        } catch {
          // ignore
        }
        return next
      })
    },
    [key]
  )

  return [state, setValue, hydrated]
}

export function useProblemState() {
  const [data, setData, hydrated] = useLocalStorage('grind75_problems', {})

  const getState = useCallback(
    (title) => data[title] ?? { done: false, doneAt: null, starred: false, note: '' },
    [data]
  )

  const markDone = useCallback(
    (title) => {
      setData((prev) => {
        const cur = prev[title] ?? {}
        const isDone = !cur.done
        return {
          ...prev,
          [title]: {
            ...cur,
            done: isDone,
            doneAt: isDone ? new Date().toISOString() : null,
          },
        }
      })
    },
    [setData]
  )

  const toggleStar = useCallback(
    (title) => {
      setData((prev) => {
        const cur = prev[title] ?? {}
        return { ...prev, [title]: { ...cur, starred: !cur.starred } }
      })
    },
    [setData]
  )

  const setNote = useCallback(
    (title, note) => {
      setData((prev) => {
        const cur = prev[title] ?? {}
        return { ...prev, [title]: { ...cur, note } }
      })
    },
    [setData]
  )

  const setTimerStart = useCallback(
    (title, startedAt) => {
      setData((prev) => {
        const cur = prev[title] ?? {}
        return { ...prev, [title]: { ...cur, timerStartedAt: startedAt, timerPausedAt: null, timerElapsed: 0 } }
      })
    },
    [setData]
  )

  const pauseTimer = useCallback(
    (title, elapsed) => {
      setData((prev) => {
        const cur = prev[title] ?? {}
        return { ...prev, [title]: { ...cur, timerPausedAt: new Date().toISOString(), timerElapsed: elapsed } }
      })
    },
    [setData]
  )

  const resetTimer = useCallback(
    (title) => {
      setData((prev) => {
        const cur = prev[title] ?? {}
        return { ...prev, [title]: { ...cur, timerStartedAt: null, timerPausedAt: null, timerElapsed: 0 } }
      })
    },
    [setData]
  )

  return { getState, markDone, toggleStar, setNote, setTimerStart, pauseTimer, resetTimer, hydrated }
}
