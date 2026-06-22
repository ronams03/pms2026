import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST /api/seed - populate initial cinematic demo data
export async function POST() {
  try {
    // Clear existing
    await db.activity.deleteMany()
    await db.event.deleteMany()
    await db.task.deleteMany()
    await db.project.deleteMany()
    await db.teamMember.deleteMany()

    // Team members
    const team = await Promise.all([
      db.teamMember.create({ data: { name: 'Alex Morgan', role: 'Product Lead', email: 'alex@nexus.io', department: 'Product', avatar: 'amber', status: 'active' } }),
      db.teamMember.create({ data: { name: 'Sofia Chen', role: 'Senior Engineer', email: 'sofia@nexus.io', department: 'Engineering', avatar: 'emerald', status: 'active' } }),
      db.teamMember.create({ data: { name: 'Marcus Reed', role: 'UX Designer', email: 'marcus@nexus.io', department: 'Design', avatar: 'rose', status: 'away' } }),
      db.teamMember.create({ data: { name: 'Priya Patel', role: 'Backend Engineer', email: 'priya@nexus.io', department: 'Engineering', avatar: 'violet', status: 'active' } }),
      db.teamMember.create({ data: { name: 'James Park', role: 'DevOps Engineer', email: 'james@nexus.io', department: 'Engineering', avatar: 'cyan', status: 'offline' } }),
      db.teamMember.create({ data: { name: 'Lena Voss', role: 'QA Engineer', email: 'lena@nexus.io', department: 'Quality', avatar: 'amber', status: 'active' } }),
      db.teamMember.create({ data: { name: 'Diego Torres', role: 'Frontend Engineer', email: 'diego@nexus.io', department: 'Engineering', avatar: 'emerald', status: 'active' } }),
      db.teamMember.create({ data: { name: 'Aria Kim', role: 'Data Analyst', email: 'aria@nexus.io', department: 'Analytics', avatar: 'rose', status: 'away' } }),
    ])

    // Projects
    const projects = await Promise.all([
      db.project.create({ data: { name: 'Cinematic Dashboard Redesign', description: 'Complete overhaul of the analytics dashboard with real-time data visualization and 3D depth.', status: 'active', priority: 'high', progress: 68, color: 'amber', startDate: new Date('2025-01-15'), dueDate: new Date('2025-03-30') } }),
      db.project.create({ data: { name: 'Mobile App Launch', description: 'Cross-platform mobile application for iOS and Android with offline support.', status: 'active', priority: 'critical', progress: 42, color: 'emerald', startDate: new Date('2025-02-01'), dueDate: new Date('2025-05-15') } }),
      db.project.create({ data: { name: 'API Platform v2', description: 'Microservices migration with GraphQL gateway and event-driven architecture.', status: 'planning', priority: 'high', progress: 15, color: 'violet', startDate: new Date('2025-02-20'), dueDate: new Date('2025-06-30') } }),
      db.project.create({ data: { name: 'Brand Identity Refresh', description: 'New visual identity system, logo suite, and brand guidelines.', status: 'completed', priority: 'medium', progress: 100, color: 'rose', startDate: new Date('2024-11-01'), dueDate: new Date('2025-01-15') } }),
      db.project.create({ data: { name: 'Customer Portal', description: 'Self-service portal with billing, support tickets, and account management.', status: 'on_hold', priority: 'medium', progress: 35, color: 'cyan', startDate: new Date('2025-01-05'), dueDate: new Date('2025-04-20') } }),
      db.project.create({ data: { name: 'AI Insights Engine', description: 'Machine learning pipeline for predictive analytics and anomaly detection.', status: 'active', priority: 'critical', progress: 78, color: 'amber', startDate: new Date('2024-12-10'), dueDate: new Date('2025-03-10') } }),
    ])

    // Tasks (Kanban)
    const [p1, p2, p3, p4, _p5, p6] = projects
    const [m1, _m2, m3, m4, m5, m6, m7, m8] = team

    const tasksData = [
      // Backlog
      { title: 'Design token system v2', description: 'Refactor color and spacing tokens for theming', status: 'backlog', priority: 'medium', projectId: p1.id, assigneeId: m3.id, assigneeName: m3.name, assigneeAvatar: m3.avatar, tags: 'design,system' },
      { title: 'Set up CI/CD pipeline', description: 'GitHub Actions with preview deployments', status: 'backlog', priority: 'high', projectId: p3.id, assigneeId: m5.id, assigneeName: m5.name, assigneeAvatar: m5.avatar, tags: 'devops,ci' },
      { title: 'User research interviews', description: 'Interview 10 power users about workflows', status: 'backlog', priority: 'low', projectId: p2.id, assigneeId: m3.id, assigneeName: m3.name, assigneeAvatar: m3.avatar, tags: 'research' },
      { title: 'Database schema review', description: 'Review and optimize query performance', status: 'backlog', priority: 'medium', projectId: p3.id, assigneeId: m4.id, assigneeName: m4.name, assigneeAvatar: m4.avatar, tags: 'backend,db' },

      // In Progress
      { title: 'Build 3D card components', description: 'Glassmorphism cards with depth shadows and hover lift', status: 'in_progress', priority: 'high', projectId: p1.id, assigneeId: m7.id, assigneeName: m7.name, assigneeAvatar: m7.avatar, tags: 'frontend,ui', dueDate: new Date('2025-02-28') },
      { title: 'Implement auth flow', description: 'OAuth2 with magic link and SSO', status: 'in_progress', priority: 'critical', projectId: p2.id, assigneeId: m4.id, assigneeName: m4.name, assigneeAvatar: m4.avatar, tags: 'auth,security', dueDate: new Date('2025-03-05') },
      { title: 'Train anomaly detection model', description: 'Isolation forest on time-series metrics', status: 'in_progress', priority: 'high', projectId: p6.id, assigneeId: m8.id, assigneeName: m8.name, assigneeAvatar: m8.avatar, tags: 'ml,data', dueDate: new Date('2025-02-25') },
      { title: 'Mobile push notifications', description: 'FCM integration with topic subscriptions', status: 'in_progress', priority: 'medium', projectId: p2.id, assigneeId: _m2.id, assigneeName: _m2.name, assigneeAvatar: _m2.avatar, tags: 'mobile,notifications' },

      // Review
      { title: 'Dashboard chart library', description: 'Recharts integration with custom themes', status: 'review', priority: 'medium', projectId: p1.id, assigneeId: m7.id, assigneeName: m7.name, assigneeAvatar: m7.avatar, tags: 'frontend,charts' },
      { title: 'API rate limiting', description: 'Token bucket with Redis backing', status: 'review', priority: 'high', projectId: p3.id, assigneeId: m4.id, assigneeName: m4.name, assigneeAvatar: m4.avatar, tags: 'backend,performance' },
      { title: 'Accessibility audit', description: 'WCAG 2.1 AA compliance pass', status: 'review', priority: 'medium', projectId: p1.id, assigneeId: m6.id, assigneeName: m6.name, assigneeAvatar: m6.avatar, tags: 'a11y,qa' },

      // Done
      { title: 'Project kickoff documentation', description: 'Stakeholder alignment and scope doc', status: 'done', priority: 'low', projectId: p1.id, assigneeId: m1.id, assigneeName: m1.name, assigneeAvatar: m1.avatar, tags: 'docs' },
      { title: 'Brand color palette', description: 'Cinematic palette with amber/emerald accents', status: 'done', priority: 'medium', projectId: p4.id, assigneeId: m3.id, assigneeName: m3.name, assigneeAvatar: m3.avatar, tags: 'design,brand' },
      { title: 'Logo final export', description: 'SVG, PNG, and favicon variants', status: 'done', priority: 'medium', projectId: p4.id, assigneeId: m3.id, assigneeName: m3.name, assigneeAvatar: m3.avatar, tags: 'design,brand' },
      { title: 'Feature flag system', description: 'LaunchDarkly-style flags with segments', status: 'done', priority: 'high', projectId: p6.id, assigneeId: m5.id, assigneeName: m5.name, assigneeAvatar: m5.avatar, tags: 'devops,infra' },
      { title: 'Onboarding flow v1', description: '3-step wizard with progress', status: 'done', priority: 'medium', projectId: p2.id, assigneeId: m7.id, assigneeName: m7.name, assigneeAvatar: m7.avatar, tags: 'frontend,ux' },
    ]

    await db.task.createMany({ data: tasksData })

    // Activities
    const activities = [
      { type: 'task_completed', title: 'Sofia completed "Onboarding flow v1"', description: 'Mobile App Launch · 3 hours ago', userName: 'Sofia Chen', projectId: p2.id, createdAt: new Date(Date.now() - 3 * 3600 * 1000) },
      { type: 'project_created', title: 'New project "AI Insights Engine"', description: 'Critical priority · 5 hours ago', userName: 'Alex Morgan', projectId: p6.id, createdAt: new Date(Date.now() - 5 * 3600 * 1000) },
      { type: 'member_joined', title: 'Diego Torres joined Engineering', description: 'Frontend Engineer · 1 day ago', userName: 'Alex Morgan', createdAt: new Date(Date.now() - 26 * 3600 * 1000) },
      { type: 'task_created', title: 'Marcus created "Design token system v2"', description: 'Cinematic Dashboard · 1 day ago', userName: 'Marcus Reed', projectId: p1.id, createdAt: new Date(Date.now() - 28 * 3600 * 1000) },
      { type: 'project_completed', title: 'Brand Identity Refresh completed', description: '100% progress · 2 days ago', userName: 'Alex Morgan', projectId: p4.id, createdAt: new Date(Date.now() - 50 * 3600 * 1000) },
      { type: 'task_completed', title: 'James completed "Feature flag system"', description: 'AI Insights Engine · 3 days ago', userName: 'James Park', projectId: p6.id, createdAt: new Date(Date.now() - 72 * 3600 * 1000) },
    ]
    await db.activity.createMany({ data: activities })

    // Events (this month)
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()
    const events = [
      { title: 'Sprint Planning', description: 'Q1 sprint 4 kickoff', date: new Date(year, month, Math.min(now.getDate() + 2, 28)), time: '10:00', type: 'meeting', projectId: p1.id },
      { title: 'Design Review', description: 'Dashboard mockups review with stakeholders', date: new Date(year, month, Math.min(now.getDate() + 5, 28)), time: '14:30', type: 'review', projectId: p1.id },
      { title: 'Mobile App Beta Launch', description: 'Release to TestFlight and Play Store beta', date: new Date(year, month, Math.min(now.getDate() + 8, 28)), time: '09:00', type: 'milestone', projectId: p2.id },
      { title: 'API v2 Architecture Sync', description: 'Review microservices boundaries', date: new Date(year, month, Math.min(now.getDate() + 11, 28)), time: '11:00', type: 'meeting', projectId: p3.id },
      { title: 'AI Model Demo', description: 'Stakeholder demo of anomaly detection', date: new Date(year, month, Math.min(now.getDate() + 14, 28)), time: '15:00', type: 'milestone', projectId: p6.id },
      { title: 'Sprint Retrospective', description: 'Team retro for sprint 3', date: new Date(year, month, Math.max(now.getDate() - 2, 1)), time: '16:00', type: 'meeting' },
      { title: 'Q1 OKR Review', description: 'Quarterly objectives check-in', date: new Date(year, month, Math.max(now.getDate() - 5, 1)), time: '13:00', type: 'review' },
    ]
    await db.event.createMany({ data: events })

    return NextResponse.json({
      success: true,
      message: 'Seeded successfully',
      counts: { team: team.length, projects: projects.length, tasks: tasksData.length, activities: activities.length, events: events.length },
    })
  } catch (error) {
    console.error('Seed failed:', error)
    return NextResponse.json({ error: 'Seed failed', detail: String(error) }, { status: 500 })
  }
}
