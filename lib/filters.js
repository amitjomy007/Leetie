export const SORT_OPTIONS = [
  { key: 'frequency', label: 'Frequency' },
  { key: 'acceptance', label: 'Acceptance' },
  { key: 'difficulty', label: 'Difficulty' },
  { key: 'title', label: 'Title' },
]

const DIFFICULTY_ORDER = { EASY: 0, MEDIUM: 1, HARD: 2, UNKNOWN: 3 }

export function sortProblems(problems, sortKey, direction = 'desc') {
  const sorted = [...problems].sort((a, b) => {
    switch (sortKey) {
      case 'frequency':
        return b.frequency - a.frequency
      case 'acceptance':
        return b.acceptance - a.acceptance
      case 'difficulty':
        return DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty]
      case 'title':
        return a.title.localeCompare(b.title)
      default:
        return 0
    }
  })
  return direction === 'asc' ? sorted.reverse() : sorted
}

export function filterProblems(problems, filters) {
  const { difficulty, topics, search, hideCompleted, starred, problemStates } = filters

  return problems.filter((p) => {
    if (difficulty && difficulty !== 'ALL' && p.difficulty !== difficulty) return false
    if (topics && topics.length > 0 && !topics.some((t) => p.topics.includes(t))) return false
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false
    if (hideCompleted && problemStates?.[p.title]?.done) return false
    if (starred && !problemStates?.[p.title]?.starred) return false
    return true
  })
}

export function deduplicateProblems(problemsWithCompany) {
  const map = new Map()
  for (const { problem, company } of problemsWithCompany) {
    if (map.has(problem.title)) {
      map.get(problem.title).companies.push(company)
    } else {
      map.set(problem.title, { ...problem, companies: [company] })
    }
  }
  return Array.from(map.values())
}
