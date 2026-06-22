'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, Plus, Tag } from 'lucide-react'
import { toast } from 'sonner'
import type { Task, TaskStatus, Priority, Project, TeamMember } from '@/lib/types'

interface CreateTaskModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingTask?: Task | null
  projects?: Project[]
  members?: TeamMember[]
  defaultStatus?: TaskStatus
  onSaved?: () => void
}

const statuses: TaskStatus[] = ['backlog', 'in_progress', 'review', 'done']
const priorities: Priority[] = ['low', 'medium', 'high', 'critical']

export function CreateTaskModal({
  open,
  onOpenChange,
  editingTask,
  projects = [],
  members = [],
  defaultStatus = 'backlog',
  onSaved,
}: CreateTaskModalProps) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'backlog' as TaskStatus,
    priority: 'medium' as Priority,
    projectId: '',
    assigneeId: '',
    dueDate: '',
    tags: '',
  })

  useEffect(() => {
    if (editingTask) {
      setForm({
        title: editingTask.title,
        description: editingTask.description,
        status: editingTask.status,
        priority: editingTask.priority,
        projectId: editingTask.projectId || '',
        assigneeId: editingTask.assigneeId || '',
        dueDate: editingTask.dueDate ? editingTask.dueDate.split('T')[0] : '',
        tags: editingTask.tags,
      })
    } else {
      setForm({
        title: '',
        description: '',
        status: defaultStatus,
        priority: 'medium',
        projectId: '',
        assigneeId: '',
        dueDate: '',
        tags: '',
      })
    }
  }, [editingTask, open, defaultStatus])

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      toast.error('Task title is required')
      return
    }
    setLoading(true)
    try {
      const selectedMember = members.find((m) => m.id === form.assigneeId)
      const payload = {
        ...form,
        projectId: form.projectId || null,
        assigneeId: form.assigneeId || null,
        assigneeName: selectedMember?.name || null,
        assigneeAvatar: selectedMember?.avatar || null,
        dueDate: form.dueDate || null,
      }
      const url = editingTask ? `/api/tasks/${editingTask.id}` : '/api/tasks'
      const method = editingTask ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Failed')
      toast.success(editingTask ? 'Task updated' : 'Task created', {
        description: `"${form.title}" added to your board.`,
      })
      onOpenChange(false)
      onSaved?.()
    } catch {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong border-white/10 max-h-[90vh] overflow-y-auto scrollbar-cinematic">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-[0_0_24px_-4px_rgba(16,185,129,0.6)]">
              <Plus className="h-4 w-4 text-background" strokeWidth={2.5} />
            </div>
            {editingTask ? 'Edit Task' : 'Create New Task'}
          </DialogTitle>
          <DialogDescription>
            {editingTask ? 'Update task details, assignee, and status.' : 'Add a new task to your Kanban board.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Build 3D card components"
              className="bg-white/5 border-white/10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="desc">Description</Label>
            <Textarea
              id="desc"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Add more context about this task…"
              rows={2}
              className="bg-white/5 border-white/10 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as TaskStatus })}>
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-strong border-white/10">
                  {statuses.map((s) => (
                    <SelectItem key={s} value={s} className="capitalize">{s.replace('_', ' ')}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v as Priority })}>
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-strong border-white/10">
                  {priorities.map((p) => (
                    <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Project</Label>
              <Select value={form.projectId} onValueChange={(v) => setForm({ ...form, projectId: v === 'none' ? '' : v })}>
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue placeholder="No project" />
                </SelectTrigger>
                <SelectContent className="glass-strong border-white/10">
                  <SelectItem value="none">No project</SelectItem>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Assignee</Label>
              <Select value={form.assigneeId} onValueChange={(v) => setForm({ ...form, assigneeId: v === 'none' ? '' : v })}>
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue placeholder="Unassigned" />
                </SelectTrigger>
                <SelectContent className="glass-strong border-white/10">
                  <SelectItem value="none">Unassigned</SelectItem>
                  {members.map((m) => (
                    <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="due">Due Date</Label>
              <Input
                id="due"
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  id="tags"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  placeholder="design, urgent"
                  className="bg-white/5 border-white/10 pl-9"
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-background hover:shadow-[0_0_24px_-4px_rgba(16,185,129,0.6)] font-semibold"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {editingTask ? 'Save Changes' : 'Create Task'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
