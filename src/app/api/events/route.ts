import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/events?month=YYYY-MM
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const month = searchParams.get('month')

    let where = {}
    if (month) {
      const [year, m] = month.split('-').map(Number)
      const start = new Date(year, m - 1, 1)
      const end = new Date(year, m, 0, 23, 59, 59)
      where = { date: { gte: start, lte: end } }
    }

    const events = await db.event.findMany({
      where,
      orderBy: { date: 'asc' },
    })
    return NextResponse.json(events)
  } catch (error) {
    console.error('Failed to fetch events:', error)
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}

// POST /api/events
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const event = await db.event.create({
      data: {
        title: body.title,
        description: body.description || '',
        date: new Date(body.date),
        time: body.time || '09:00',
        type: body.type || 'meeting',
        projectId: body.projectId || null,
      },
    })
    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error('Failed to create event:', error)
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
  }
}
