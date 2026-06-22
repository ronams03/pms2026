import type { ProjectColor, ProjectStatus, Priority, TaskStatus, MemberStatus, EventType } from '@/lib/types'

// Color → Tailwind gradient classes for project accents
export const colorGradients: Record<ProjectColor, { bg: string; text: string; ring: string; soft: string; glow: string }> = {
  amber: {
    bg: 'from-amber-500 to-orange-600',
    text: 'text-amber-400',
    ring: 'ring-amber-500/40',
    soft: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    glow: 'shadow-[0_0_24px_-4px_rgba(245,158,11,0.5)]',
  },
  emerald: {
    bg: 'from-emerald-500 to-teal-600',
    text: 'text-emerald-400',
    ring: 'ring-emerald-500/40',
    soft: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    glow: 'shadow-[0_0_24px_-4px_rgba(16,185,129,0.5)]',
  },
  rose: {
    bg: 'from-rose-500 to-pink-600',
    text: 'text-rose-400',
    ring: 'ring-rose-500/40',
    soft: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    glow: 'shadow-[0_0_24px_-4px_rgba(244,63,94,0.5)]',
  },
  violet: {
    bg: 'from-violet-500 to-purple-600',
    text: 'text-violet-400',
    ring: 'ring-violet-500/40',
    soft: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    glow: 'shadow-[0_0_24px_-4px_rgba(139,92,246,0.5)]',
  },
  cyan: {
    bg: 'from-cyan-500 to-sky-600',
    text: 'text-cyan-400',
    ring: 'ring-cyan-500/40',
    soft: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    glow: 'shadow-[0_0_24px_-4px_rgba(6,182,212,0.5)]',
  },
}

export const statusConfig: Record<ProjectStatus, { label: string; className: string; dot: string }> = {
  planning: { label: 'Planning', className: 'bg-sky-500/10 text-sky-400 border-sky-500/20', dot: 'bg-sky-400' },
  active: { label: 'Active', className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', dot: 'bg-emerald-400' },
  on_hold: { label: 'On Hold', className: 'bg-amber-500/10 text-amber-400 border-amber-500/20', dot: 'bg-amber-400' },
  completed: { label: 'Completed', className: 'bg-violet-500/10 text-violet-400 border-violet-500/20', dot: 'bg-violet-400' },
}

export const priorityConfig: Record<Priority, { label: string; className: string; icon: string; bar: string }> = {
  low: { label: 'Low', className: 'bg-slate-500/10 text-slate-400 border-slate-500/20', icon: '○', bar: 'bg-slate-400' },
  medium: { label: 'Medium', className: 'bg-sky-500/10 text-sky-400 border-sky-500/20', icon: '◐', bar: 'bg-sky-400' },
  high: { label: 'High', className: 'bg-amber-500/10 text-amber-400 border-amber-500/20', icon: '▲', bar: 'bg-amber-400' },
  critical: { label: 'Critical', className: 'bg-rose-500/10 text-rose-400 border-rose-500/20', icon: '◆', bar: 'bg-rose-400' },
}

export const taskStatusConfig: Record<TaskStatus, { label: string; accent: string; dot: string }> = {
  backlog: { label: 'Backlog', accent: 'border-slate-500/30', dot: 'bg-slate-400' },
  in_progress: { label: 'In Progress', accent: 'border-amber-500/40', dot: 'bg-amber-400' },
  review: { label: 'In Review', accent: 'border-violet-500/40', dot: 'bg-violet-400' },
  done: { label: 'Done', accent: 'border-emerald-500/40', dot: 'bg-emerald-400' },
}

export const memberStatusConfig: Record<MemberStatus, { label: string; dot: string; className: string }> = {
  active: { label: 'Active', dot: 'bg-emerald-400', className: 'text-emerald-400' },
  away: { label: 'Away', dot: 'bg-amber-400', className: 'text-amber-400' },
  offline: { label: 'Offline', dot: 'bg-slate-500', className: 'text-slate-500' },
}

export const eventTypeConfig: Record<EventType, { label: string; className: string; dot: string }> = {
  meeting: { label: 'Meeting', className: 'bg-sky-500/10 text-sky-400 border-sky-500/20', dot: 'bg-sky-400' },
  deadline: { label: 'Deadline', className: 'bg-rose-500/10 text-rose-400 border-rose-500/20', dot: 'bg-rose-400' },
  milestone: { label: 'Milestone', className: 'bg-amber-500/10 text-amber-400 border-amber-500/20', dot: 'bg-amber-400' },
  review: { label: 'Review', className: 'bg-violet-500/10 text-violet-400 border-violet-500/20', dot: 'bg-violet-400' },
}

// Avatar initials from name
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

// Format relative time
export function formatRelative(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const diff = Date.now() - d.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return d.toLocaleDateString('en', { month: 'short', day: 'numeric' })
}

export function formatDate(date: string | Date | null): string {
  if (!date) return '—'
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function daysUntil(date: string | Date | null): number | null {
  if (!date) return null
  const d = typeof date === 'string' ? new Date(date) : date
  return Math.ceil((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
}
