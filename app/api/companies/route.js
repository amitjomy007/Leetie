import { promises as fs } from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

export async function GET() {
  const brainDir = path.join(process.cwd(), 'public', 'brain')

  try {
    const entries = await fs.readdir(brainDir, { withFileTypes: true })
    const companies = entries
      .filter((e) => e.isDirectory())
      .map((e) => e.name)
      .sort()
    return NextResponse.json({ companies })
  } catch {
    return NextResponse.json({ companies: [] })
  }
}
