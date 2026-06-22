import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// PUT /api/projects/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const project = await db.project.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.status !== undefined && { status: body.status }),
        ...(body.priority !== undefined && { priority: body.priority }),
        ...(body.progress !== undefined && { progress: body.progress }),
        ...(body.color !== undefined && { color: body.color }),
        ...(body.startDate && { startDate: new Date(body.startDate) }),
        ...(body.dueDate && { dueDate: new Date(body.dueDate) }),
      },
    })

    if (body.status === 'completed') {
      await db.activity.create({
        data: {
          type: 'project_completed',
          title: `Completed project "${project.name}"`,
          description: 'Project marked as completed',
          userName: body.userName || 'Alex Morgan',
          projectId: project.id,
        },
      })
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error('Failed to update project:', error)
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 })
  }
}

// DELETE /api/projects/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await db.project.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete project:', error)
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 })
  }
}
