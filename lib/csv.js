import Papa from 'papaparse'

export const DATE_RANGES = [
  { key: '30d', label: '30 Days', filename: '1. Thirty Days.csv' },
  { key: '90d', label: '3 Months', filename: '2. Three Months.csv' },
  { key: '6m', label: '6 Months', filename: '3. Six Months.csv' },
  { key: '6m+', label: '6+ Months', filename: '4. More Than Six Months.csv' },
  { key: 'all', label: 'All Time', filename: '5. All.csv' },
]

export function parseCSV(text) {
  const result = Papa.parse(text.trim(), {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
  })

  return result.data
    .filter((row) => row.Title && row.Title.trim())
    .map((row) => ({
      title: row.Title?.trim() ?? '',
      difficulty: (row.Difficulty?.trim() ?? 'UNKNOWN').toUpperCase(),
      frequency: parseFloat(row.Frequency) || 0,
      acceptance: parseFloat(row['Acceptance Rate']) || 0,
      link: row.Link?.trim() ?? '',
      topics: row.Topics
        ? row.Topics.split(',').map((t) => t.trim()).filter(Boolean)
        : [],
    }))
}

export function slugify(name) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export function deslugify(slug, companies) {
  return companies.find((c) => slugify(c) === slug) ?? slug
}
