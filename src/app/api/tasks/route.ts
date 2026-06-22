import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/tasks
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const projectId = searchParams.get('projectId')
    const status = searchParams.get('status')

    const tasks = await db.task.findMany({
      where: {
        ...(projectId && projectId !== 'all' && { projectId }),
        ...(status && status !== 'all' && { status }),
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(tasks)
  } catch (error) {
    console.error('Failed to fetch tasks:', error)
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 })
  }
}

// POST /api/tasks
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const task = await db.task.create({
      data: {
        title: body.title,
        description: body.description || '',
        status: body.status || 'backlog',
        priority: body.priority || 'medium',
        projectId: body.projectId || null,
        assigneeId: body.assigneeId || null,
        assigneeName: body.assigneeName || null,
        assigneeAvatar: body.assigneeAvatar || null,
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        tags: body.tags || '',
      },
    })

    await db.activity.create({
      data: {
        type: 'task_created',
        title: `Created task "${task.title}"`,
        description: `New ${task.priority} priority task`,
        userName: body.userName || 'Alex Morgan',
        projectId: task.projectId,
      },
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error('Failed to create task:', error)
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 })
  }
}
