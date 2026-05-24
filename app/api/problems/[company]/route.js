import { promises as fs } from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'
import { DATE_RANGES } from '@/lib/csv'

export async function GET(request, { params }) {
  const { company } = await params
  const { searchParams } = new URL(request.url)
  const rangeKey = searchParams.get('range') ?? 'all'

  const range = DATE_RANGES.find((r) => r.key === rangeKey) ?? DATE_RANGES[DATE_RANGES.length - 1]
  const filePath = path.join(process.cwd(), 'public', 'brain', company, range.filename)

  try {
    const text = await fs.readFile(filePath, 'utf8')
    return NextResponse.json({ csv: text, range: range.key })
  } catch {
    return NextResponse.json({ csv: null, range: range.key }, { status: 404 })
  }
}
