import { promises as fs } from 'fs'
import path from 'path'
import Navbar from '@/components/layout/Navbar'
import ProblemList from '@/components/problems/ProblemList'

async function getCompanies() {
  const brainDir = path.join(process.cwd(), 'public', 'brain')
  try {
    const entries = await fs.readdir(brainDir, { withFileTypes: true })
    return entries.filter((e) => e.isDirectory()).map((e) => e.name).sort()
  } catch {
    return []
  }
}

export default async function HomePage() {
  const companies = await getCompanies()

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <main style={{ maxWidth: 1320, margin: '0 auto', padding: '0 32px 80px' }}>
        {companies.length === 0 ? (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            minHeight: 'calc(100vh - 58px)',
          }}>
            <div style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 12, padding: '48px 64px', textAlign: 'center',
            }}>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 8 }}>
                No companies found in <code style={{ color: 'var(--accent)' }}>public/brain/</code>
              </p>
              <p style={{ fontSize: 12, color: 'var(--text-dim)' }}>
                Add company folders with CSV files to get started. See the README for structure.
              </p>
            </div>
          </div>
        ) : (
          <ProblemList companies={companies} />
        )}
      </main>
    </div>
  )
}
