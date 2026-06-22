import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// PUT /api/tasks/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const prev = await db.task.findUnique({ where: { id } })

    const task = await db.task.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.status !== undefined && { status: body.status }),
        ...(body.priority !== undefined && { priority: body.priority }),
        ...(body.projectId !== undefined && { projectId: body.projectId }),
        ...(body.assigneeId !== undefined && { assigneeId: body.assigneeId }),
        ...(body.assigneeName !== undefined && { assigneeName: body.assigneeName }),
        ...(body.assigneeAvatar !== undefined && { assigneeAvatar: body.assigneeAvatar }),
        ...(body.dueDate !== undefined && { dueDate: body.dueDate ? new Date(body.dueDate) : null }),
        ...(body.tags !== undefined && { tags: body.tags }),
      },
    })

    // Log status change to done
    if (prev && prev.status !== 'done' && body.status === 'done') {
      await db.activity.create({
        data: {
          type: 'task_completed',
          title: `Completed task "${task.title}"`,
          description: 'Task moved to Done',
          userName: body.userName || 'Alex Morgan',
          projectId: task.projectId,
        },
      })
    }

    return NextResponse.json(task)
  } catch (error) {
    console.error('Failed to update task:', error)
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 })
  }
}

// DELETE /api/tasks/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await db.task.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete task:', error)
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 })
  }
}
