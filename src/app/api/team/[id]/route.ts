import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// PUT /api/team/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const member = await db.teamMember.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.role !== undefined && { role: body.role }),
        ...(body.email !== undefined && { email: body.email }),
        ...(body.department !== undefined && { department: body.department }),
        ...(body.avatar !== undefined && { avatar: body.avatar }),
        ...(body.status !== undefined && { status: body.status }),
      },
    })
    return NextResponse.json(member)
  } catch (error) {
    console.error('Failed to update team member:', error)
    return NextResponse.json({ error: 'Failed to update team member' }, { status: 500 })
  }
}

// DELETE /api/team/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await db.teamMember.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete team member:', error)
    return NextResponse.json({ error: 'Failed to delete team member' }, { status: 500 })
  }
}
