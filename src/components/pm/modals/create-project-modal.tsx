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
import { Loader2, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { colorGradients } from '@/lib/pm-helpers'
import { cn } from '@/lib/utils'
import type { Project, ProjectColor, ProjectStatus, Priority } from '@/lib/types'

interface CreateProjectModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingProject?: Project | null
  onSaved?: () => void
}

const colors: ProjectColor[] = ['amber', 'emerald', 'rose', 'violet', 'cyan']
const statuses: ProjectStatus[] = ['planning', 'active', 'on_hold', 'completed']
const priorities: Priority[] = ['low', 'medium', 'high', 'critical']

export function CreateProjectModal({ open, onOpenChange, editingProject, onSaved }: CreateProjectModalProps) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    description: '',
    status: 'planning' as ProjectStatus,
    priority: 'medium' as Priority,
    progress: 0,
    color: 'amber' as ProjectColor,
    dueDate: '',
  })

  useEffect(() => {
    if (editingProject) {
      setForm({
        name: editingProject.name,
        description: editingProject.description,
        status: editingProject.status,
        priority: editingProject.priority,
        progress: editingProject.progress,
        color: editingProject.color,
        dueDate: editingProject.dueDate ? editingProject.dueDate.split('T')[0] : '',
      })
    } else {
      setForm({
        name: '',
        description: '',
        status: 'planning',
        priority: 'medium',
        progress: 0,
        color: 'amber',
        dueDate: '',
      })
    }
  }, [editingProject, open])

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      toast.error('Project name is required')
      return
    }
    setLoading(true)
    try {
      const url = editingProject ? `/api/projects/${editingProject.id}` : '/api/projects'
      const method = editingProject ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Failed')
      toast.success(editingProject ? 'Project updated' : 'Project created', {
        description: `"${form.name}" is ready to go.`,
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
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-3d-amber">
              <Sparkles className="h-4 w-4 text-background" strokeWidth={2.5} />
            </div>
            {editingProject ? 'Edit Project' : 'Create New Project'}
          </DialogTitle>
          <DialogDescription>
            {editingProject ? 'Update project details and progress.' : 'Set up a new project with details, priority, and accent color.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Cinematic Dashboard Redesign"
              className="bg-white/5 border-white/10"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Brief description of the project goals…"
              rows={3}
              className="bg-white/5 border-white/10 resize-none"
            />
          </div>

          {/* Status + Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as ProjectStatus })}>
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

          {/* Progress + Due date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Progress: {form.progress}%</Label>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={form.progress}
                onChange={(e) => setForm({ ...form, progress: Number(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className="bg-white/5 border-white/10"
              />
            </div>
          </div>

          {/* Color picker */}
          <div className="space-y-2">
            <Label>Accent Color</Label>
            <div className="flex gap-2 flex-wrap">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setForm({ ...form, color: c })}
                  className={cn(
                    'relative h-10 w-10 rounded-xl bg-gradient-to-br transition-all duration-200',
                    colorGradients[c].bg,
                    form.color === c
                      ? 'ring-2 ring-offset-2 ring-offset-background ring-white/40 scale-110 shadow-3d'
                      : 'hover:scale-105 opacity-70 hover:opacity-100',
                  )}
                  aria-label={c}
                >
                  {form.color === c && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-white" strokeWidth={2.5} />
                    </span>
                  )}
                </button>
              ))}
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
            className="bg-gradient-to-r from-amber-400 to-orange-600 text-background hover:shadow-3d-amber font-semibold"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {editingProject ? 'Save Changes' : 'Create Project'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
