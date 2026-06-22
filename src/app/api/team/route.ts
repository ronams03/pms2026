import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/team
export async function GET() {
  try {
    const members = await db.teamMember.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(members)
  } catch (error) {
    console.error('Failed to fetch team:', error)
    return NextResponse.json({ error: 'Failed to fetch team' }, { status: 500 })
  }
}

// POST /api/team
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const member = await db.teamMember.create({
      data: {
        name: body.name,
        role: body.role,
        email: body.email,
        department: body.department || 'Engineering',
        avatar: body.avatar || '',
        status: body.status || 'active',
      },
    })

    await db.activity.create({
      data: {
        type: 'member_joined',
        title: `${member.name} joined the team`,
        description: `New ${member.role} in ${member.department}`,
        userName: body.userName || 'Alex Morgan',
      },
    })

    return NextResponse.json(member, { status: 201 })
  } catch (error) {
    console.error('Failed to create team member:', error)
    return NextResponse.json({ error: 'Failed to create team member' }, { status: 500 })
  }
}
