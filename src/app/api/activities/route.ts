import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/activities
export async function GET() {
  try {
    const activities = await db.activity.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
    return NextResponse.json(activities)
  } catch (error) {
    console.error('Failed to fetch activities:', error)
    return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 })
  }
}
