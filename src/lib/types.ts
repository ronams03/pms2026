// Shared types for Project Management System

export type ProjectStatus = 'planning' | 'active' | 'on_hold' | 'completed'
export type Priority = 'low' | 'medium' | 'high' | 'critical'
export type TaskStatus = 'backlog' | 'in_progress' | 'review' | 'done'
export type MemberStatus = 'active' | 'away' | 'offline'
export type ProjectColor = 'amber' | 'emerald' | 'rose' | 'violet' | 'cyan'
export type EventType = 'meeting' | 'deadline' | 'milestone' | 'review'

export interface Project {
  id: string
  name: string
  description: string
  status: ProjectStatus
  priority: Priority
  progress: number
  color: ProjectColor
  startDate: string
  dueDate: string | null
  createdAt: string
  updatedAt: string
  _count?: { tasks: number }
}

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: Priority
  projectId: string | null
  assigneeId: string | null
  assigneeName: string | null
  assigneeAvatar: string | null
  dueDate: string | null
  tags: string
  createdAt: string
  updatedAt: string
}

export interface TeamMember {
  id: string
  name: string
  role: string
  email: string
  department: string
  avatar: string
  status: MemberStatus
  createdAt: string
  updatedAt: string
}

export interface Activity {
  id: string
  type: string
  title: string
  description: string
  userName: string
  projectId: string | null
  createdAt: string
}

export interface CalendarEvent {
  id: string
  title: string
  description: string
  date: string
  time: string
  type: EventType
  projectId: string | null
  createdAt: string
  updatedAt: string
}

export interface DashboardStats {
  stats: {
    projects: number
    tasks: number
    members: number
    activeProjects: number
    completedTasks: number
    completionRate: number
  }
  statusCounts: { status: string; _count: number }[]
  priorityCounts: { priority: string; _count: number }[]
  recentProjects: { id: string; name: string; progress: number; status: string; color: string }[]
  weekData: { day: string; tasks: number }[]
}

export type PageKey = 'dashboard' | 'projects' | 'tasks' | 'team' | 'calendar' | 'settings'
