import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/projects - list all projects
export async function GET() {
  try {
    const projects = await db.project.findMany({
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { tasks: true } } },
    })
    return NextResponse.json(projects)
  } catch (error) {
    console.error('Failed to fetch projects:', error)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

// POST /api/projects - create a project
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const project = await db.project.create({
      data: {
        name: body.name,
        description: body.description || '',
        status: body.status || 'planning',
        priority: body.priority || 'medium',
        progress: body.progress || 0,
        color: body.color || 'amber',
        startDate: body.startDate ? new Date(body.startDate) : new Date(),
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
      },
    })

    await db.activity.create({
      data: {
        type: 'project_created',
        title: `Created project "${project.name}"`,
        description: `New ${project.status} project with ${project.priority} priority`,
        userName: body.userName || 'Alex Morgan',
        projectId: project.id,
      },
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('Failed to create project:', error)
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}
