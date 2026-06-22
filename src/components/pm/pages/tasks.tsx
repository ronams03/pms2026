'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  useDroppable,
  useDraggable,
} from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  KanbanSquare,
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  Flag,
  Calendar,
  GripVertical,
  MessageSquare,
  Paperclip,
  CheckCircle2,
  Sparkles,
  List,
  LayoutGrid,
} from 'lucide-react'
import type { Task, TaskStatus, Project, TeamMember } from '@/lib/types'
import { priorityConfig, colorGradients, getInitials, formatDate, daysUntil } from '@/lib/pm-helpers'
import { CreateTaskModal } from '@/components/pm/modals/create-task-modal'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const columns: { key: TaskStatus; label: string; accent: string; dot: string; gradient: string }[] = [
  { key: 'backlog', label: 'Backlog', accent: 'border-slate-500/30', dot: 'bg-slate-400', gradient: 'from-slate-500/10 to-transparent' },
  { key: 'in_progress', label: 'In Progress', accent: 'border-amber-500/30', dot: 'bg-amber-400', gradient: 'from-amber-500/10 to-transparent' },
  { key: 'review', label: 'In Review', accent: 'border-violet-500/30', dot: 'bg-violet-400', gradient: 'from-violet-500/10 to-transparent' },
  { key: 'done', label: 'Done', accent: 'border-emerald-500/30', dot: 'bg-emerald-400', gradient: 'from-emerald-500/10 to-transparent' },
]

interface DraggableTaskCardProps {
  task: Task
  onEdit: (t: Task) => void
  onDelete: (id: string) => void
  isOverlay?: boolean
}

function DraggableTaskCard({ task, onEdit, onDelete, isOverlay }: DraggableTaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  })
  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.4 : 1,
  }
  const days = daysUntil(task.dueDate)
  const tags = task.tags ? task.tags.split(',').filter(Boolean) : []

  return (
    <div ref={isOverlay ? undefined : setNodeRef} style={isOverlay ? undefined : style}>
      <Card
        className={cn(
          'group relative overflow-hidden glass border-white/5 p-3.5 cursor-grab active:cursor-grabbing',
          isOverlay && 'shadow-3d-lg rotate-2 scale-105 border-amber-500/40',
        )}
      >
        <div className="flex items-start justify-between mb-2">
          <Badge variant="outline" className={`text-[9px] ${priorityConfig[task.priority].className}`}>
            <Flag className="h-2.5 w-2.5 mr-1" />{priorityConfig[task.priority].label}
          </Badge>
          <div className="flex items-center gap-0.5">
            {!isOverlay && (
              <button
                {...attributes}
                {...listeners}
                className="p-1 rounded hover:bg-white/10 text-muted-foreground/50 hover:text-muted-foreground cursor-grab active:cursor-grabbing"
                aria-label="Drag task"
              >
                <GripVertical className="h-3.5 w-3.5" />
              </button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1 rounded hover:bg-white/10 text-muted-foreground/50 hover:text-muted-foreground">
                  <MoreVertical className="h-3.5 w-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass-strong border-white/10">
                <DropdownMenuItem onClick={() => onEdit(task)} className="cursor-pointer focus:bg-white/5">
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuItem
                  onClick={() => onDelete(task.id)}
                  className="cursor-pointer focus:bg-rose-500/10 text-rose-400"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <p className="text-sm font-medium leading-snug mb-1.5">{task.title}</p>
        {task.description && (
          <p className="text-[11px] text-muted-foreground line-clamp-2 mb-2">{task.description}</p>
        )}

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {tags.map((t) => (
              <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-muted-foreground border border-white/5">
                #{t.trim()}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <div className="flex items-center gap-1.5">
            {task.assigneeName ? (
              <div className="flex items-center gap-1.5">
                <div className={cn(
                  'h-6 w-6 rounded-full bg-gradient-to-br flex items-center justify-center text-[9px] font-bold text-background',
                  colorGradients[(task.assigneeAvatar as keyof typeof colorGradients) || 'amber'].bg,
                )}>
                  {getInitials(task.assigneeName)}
                </div>
              </div>
            ) : (
              <div className="h-6 w-6 rounded-full border border-dashed border-white/20" />
            )}
            <span className="flex items-center gap-0.5 text-[9px] text-muted-foreground">
              <MessageSquare className="h-2.5 w-2.5" />3
            </span>
            <span className="flex items-center gap-0.5 text-[9px] text-muted-foreground">
              <Paperclip className="h-2.5 w-2.5" />2
            </span>
          </div>
          {task.dueDate && (
            <span className={cn(
              'flex items-center gap-1 text-[9px]',
              task.status === 'done' ? 'text-emerald-400' : days !== null && days < 0 ? 'text-rose-400' : days !== null && days < 3 ? 'text-amber-400' : 'text-muted-foreground',
            )}>
              {task.status === 'done' ? <CheckCircle2 className="h-2.5 w-2.5" /> : <Calendar className="h-2.5 w-2.5" />}
              {formatDate(task.dueDate)}
            </span>
          )}
        </div>
      </Card>
    </div>
  )
}

function DroppableColumn({
  status,
  label,
  accent,
  dot,
  gradient,
  tasks,
  onAddTask,
  onEdit,
  onDelete,
}: {
  status: TaskStatus
  label: string
  accent: string
  dot: string
  gradient: string
  tasks: Task[]
  onAddTask: (s: TaskStatus) => void
  onEdit: (t: Task) => void
  onDelete: (id: string) => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status })

  return (
    <div className="flex flex-col min-w-0">
      <div className={cn('relative rounded-t-2xl px-4 py-3 border-t-2 overflow-hidden', accent)}>
        <div className={`absolute inset-0 bg-gradient-to-b ${gradient} rounded-t-2xl pointer-events-none`} />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={cn('h-2 w-2 rounded-full', dot)} />
            <h3 className="text-sm font-semibold">{label}</h3>
            <Badge variant="secondary" className="text-[10px] h-5 px-1.5">{tasks.length}</Badge>
          </div>
          <button
            onClick={() => onAddTask(status)}
            className="p-1 rounded-md hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={`Add task to ${label}`}
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          'flex-1 rounded-b-2xl p-2.5 space-y-2.5 min-h-[200px] transition-colors glass border border-t-0 border-white/5',
          isOver && 'bg-amber-500/5 border-amber-500/30',
        )}
      >
        {tasks.length === 0 ? (
          <button
            onClick={() => onAddTask(status)}
            className="w-full py-8 flex flex-col items-center gap-2 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span className="text-xs">Add a task</span>
          </button>
        ) : (
          tasks.map((task) => (
            <DraggableTaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
          ))
        )}
      </div>
    </div>
  )
}

export function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Task | null>(null)
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>('backlog')
  const [projectFilter, setProjectFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [view, setView] = useState<'list' | 'board'>('list')
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  )

  const load = async () => {
    setLoading(true)
    try {
      const [tRes, pRes, mRes] = await Promise.all([
        fetch('/api/tasks'),
        fetch('/api/projects'),
        fetch('/api/team'),
      ])
      setTasks(await tRes.json())
      setProjects(await pRes.json())
      setMembers(await mRes.json())
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleDragStart = (e: DragStartEvent) => {
    setActiveId(e.active.id as string)
  }

  const handleDragEnd = useCallback(async (e: DragEndEvent) => {
    const { active, over } = e
    setActiveId(null)
    if (!over) return

    const taskId = active.id as string
    const newStatus = over.id as TaskStatus

    const task = tasks.find((t) => t.id === taskId)
    if (!task || task.status === newStatus) return

    // Optimistic update
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)))

    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (newStatus === 'done') {
        toast.success('Task completed!', { description: `"${task.title}" moved to Done` })
      }
    } catch {
      toast.error('Failed to move task')
      setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: task.status } : t)))
    }
  }, [tasks])

  const handleDelete = async (id: string) => {
    const prev = tasks
    setTasks((t) => t.filter((task) => task.id !== id))
    try {
      await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
      toast.success('Task deleted')
    } catch {
      setTasks(prev)
      toast.error('Failed to delete')
    }
  }

  const handleAddTask = (status: TaskStatus) => {
    setEditing(null)
    setDefaultStatus(status)
    setModalOpen(true)
  }

  const handleEdit = (t: Task) => {
    setEditing(t)
    setModalOpen(true)
  }

  const filtered = tasks.filter((t) => {
    const matchesProject = projectFilter === 'all' || t.projectId === projectFilter
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter
    return matchesProject && matchesStatus
  })
  const activeTask = activeId ? tasks.find((t) => t.id === activeId) : null

  const projectName = (id: string | null) => projects.find((p) => p.id === id)?.name || '—'

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    const task = tasks.find((t) => t.id === taskId)
    if (!task || task.status === newStatus) return
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)))
    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
    } catch {
      setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: task.status } : t)))
      toast.error('Failed to update status')
    }
  }

  if (loading) {
    return (
      <div className="p-4 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-96 rounded-2xl glass animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-4 pb-16">
      {/* Filter bar */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-3d">
            <KanbanSquare className="h-4 w-4 text-background" strokeWidth={2.3} />
          </div>
          <div>
            <h2 className="font-semibold leading-tight">Tasks</h2>
            <p className="text-xs text-muted-foreground">{filtered.length} tasks · {view === 'board' ? 'drag to move' : 'list view'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Select value={projectFilter} onValueChange={setProjectFilter}>
            <SelectTrigger className="w-40 bg-white/5 border-white/10">
              <SelectValue placeholder="All projects" />
            </SelectTrigger>
            <SelectContent className="glass-strong border-white/10">
              <SelectItem value="all">All Projects</SelectItem>
              {projects.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {view === 'list' && (
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36 bg-white/5 border-white/10">
                <SelectValue placeholder="All status" />
              </SelectTrigger>
              <SelectContent className="glass-strong border-white/10">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="backlog">Backlog</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="review">In Review</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>
          )}
          <div className="flex rounded-xl bg-white/5 border border-white/10 p-0.5">
            <button
              onClick={() => setView('list')}
              className={cn('p-2 rounded-lg transition-colors', view === 'list' ? 'bg-white/10 text-emerald-400' : 'text-muted-foreground')}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView('board')}
              className={cn('p-2 rounded-lg transition-colors', view === 'board' ? 'bg-white/10 text-emerald-400' : 'text-muted-foreground')}
              aria-label="Board view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
          <Button
            onClick={() => handleAddTask('backlog')}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-background hover:shadow-[0_0_24px_-4px_rgba(16,185,129,0.6)] font-semibold"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            <span className="hidden sm:inline">New Task</span>
          </Button>
        </div>
      </div>

      {/* List view */}
      {view === 'list' ? (
        <Card className="glass border-white/5 overflow-hidden">
          <div className="hidden md:grid grid-cols-12 gap-3 px-4 py-3 border-b border-white/5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
            <div className="col-span-4">Task</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1">Priority</div>
            <div className="col-span-2">Assignee</div>
            <div className="col-span-2">Project</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>
          <div className="divide-y divide-white/5 max-h-[70vh] overflow-y-auto scrollbar-cinematic">
            {filtered.length === 0 ? (
              <div className="px-4 py-12 text-center text-sm text-muted-foreground">
                No tasks found. Adjust filters or create a new task.
              </div>
            ) : filtered.map((task, i) => {
              const days = daysUntil(task.dueDate)
              const tags = task.tags ? task.tags.split(',').filter(Boolean) : []
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.02 }}
                  className="group grid grid-cols-12 gap-3 px-4 py-3 items-center hover:bg-white/3 transition-colors"
                >
                  <div className="col-span-12 md:col-span-4 min-w-0">
                    <p className="text-sm font-medium truncate">{task.title}</p>
                    {task.description && (
                      <p className="text-[11px] text-muted-foreground truncate">{task.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      {task.dueDate && (
                        <span className={cn(
                          'flex items-center gap-1 text-[10px]',
                          task.status === 'done' ? 'text-emerald-400' : days !== null && days < 0 ? 'text-rose-400' : days !== null && days < 3 ? 'text-amber-400' : 'text-muted-foreground',
                        )}>
                          <Calendar className="h-2.5 w-2.5" />{formatDate(task.dueDate)}
                        </span>
                      )}
                      {tags.slice(0, 2).map((t) => (
                        <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-muted-foreground border border-white/5">
                          #{t.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="col-span-6 md:col-span-2 hidden md:block">
                    <Select
                      value={task.status}
                      onValueChange={(v) => handleStatusChange(task.id, v as TaskStatus)}
                    >
                      <SelectTrigger className="h-7 text-[11px] bg-white/5 border-white/10 capitalize py-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass-strong border-white/10">
                        {columns.map((c) => (
                          <SelectItem key={c.key} value={c.key} className="capitalize text-xs">{c.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-6 md:col-span-1 hidden md:block">
                    <Badge variant="outline" className={`text-[9px] ${priorityConfig[task.priority].className}`}>
                      <Flag className="h-2.5 w-2.5 mr-1" />{priorityConfig[task.priority].label}
                    </Badge>
                  </div>
                  <div className="col-span-6 md:col-span-2 hidden md:block min-w-0">
                    {task.assigneeName ? (
                      <div className="flex items-center gap-1.5">
                        <div className={cn(
                          'h-6 w-6 rounded-full bg-gradient-to-br flex items-center justify-center text-[9px] font-bold text-background shrink-0',
                          colorGradients[(task.assigneeAvatar as keyof typeof colorGradients) || 'amber'].bg,
                        )}>
                          {getInitials(task.assigneeName)}
                        </div>
                        <span className="text-xs truncate">{task.assigneeName}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">Unassigned</span>
                    )}
                  </div>
                  <div className="col-span-6 md:col-span-2 hidden md:block min-w-0">
                    <span className="text-xs text-muted-foreground truncate block">{projectName(task.projectId)}</span>
                  </div>
                  <div className="col-span-12 md:col-span-1 flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="glass-strong border-white/10">
                        <DropdownMenuItem onClick={() => handleEdit(task)} className="cursor-pointer focus:bg-white/5">
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </DropdownMenuItem>
                        {task.status !== 'done' && (
                          <DropdownMenuItem onClick={() => handleStatusChange(task.id, 'done')} className="cursor-pointer focus:bg-white/5">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Mark Done
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator className="bg-white/5" />
                        <DropdownMenuItem
                          onClick={() => handleDelete(task.id)}
                          className="cursor-pointer focus:bg-rose-500/10 text-rose-400"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </Card>
      ) : (
        /* Board view */
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {columns.map((col) => (
              <DroppableColumn
                key={col.key}
                status={col.key}
                label={col.label}
                accent={col.accent}
                dot={col.dot}
                gradient={col.gradient}
                tasks={tasks.filter((t) => t.status === col.key && (projectFilter === 'all' || t.projectId === projectFilter))}
                onAddTask={handleAddTask}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>

          <DragOverlay>
            {activeTask ? (
              <DraggableTaskCard task={activeTask} onEdit={() => {}} onDelete={() => {}} isOverlay />
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      <CreateTaskModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        editingTask={editing}
        projects={projects}
        members={members}
        defaultStatus={defaultStatus}
        onSaved={load}
      />
    </div>
  )
}
