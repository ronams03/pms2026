import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/dashboard - aggregated stats
export async function GET() {
  try {
    const [projects, tasks, members, completedTasks, activeProjects] = await Promise.all([
      db.project.count(),
      db.task.count(),
      db.teamMember.count(),
      db.task.count({ where: { status: 'done' } }),
      db.project.count({ where: { status: 'active' } }),
    ])

    const totalTasks = tasks || 1
    const completionRate = Math.round((completedTasks / totalTasks) * 100)

    // Status distribution
    const statusCounts = await db.task.groupBy({
      by: ['status'],
      _count: true,
    })

    // Priority distribution
    const priorityCounts = await db.task.groupBy({
      by: ['priority'],
      _count: true,
    })

    // Recent projects with progress
    const recentProjects = await db.project.findMany({
      orderBy: { createdAt: 'desc' },
      take: 6,
      select: { id: true, name: true, progress: true, status: true, color: true },
    })

    // Weekly activity (last 7 days task creation)
    const now = new Date()
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const recentTasks = await db.task.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: { createdAt: true, status: true },
    })

    const weekData = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(now.getTime() - (6 - i) * 24 * 60 * 60 * 1000)
      const dayStr = day.toLocaleDateString('en', { weekday: 'short' })
      const dayStart = new Date(day.setHours(0, 0, 0, 0))
      const dayEnd = new Date(day.setHours(23, 59, 59, 999))
      const count = recentTasks.filter(t => t.createdAt >= dayStart && t.createdAt <= dayEnd).length
      return { day: dayStr, tasks: count }
    })

    return NextResponse.json({
      stats: {
        projects,
        tasks,
        members,
        activeProjects,
        completedTasks,
        completionRate,
      },
      statusCounts,
      priorityCounts,
      recentProjects,
      weekData,
    })
  } catch (error) {
    console.error('Failed to fetch dashboard:', error)
    return NextResponse.json({ error: 'Failed to fetch dashboard' }, { status: 500 })
  }
}
