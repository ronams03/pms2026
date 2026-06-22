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
import { Loader2, CalendarPlus } from 'lucide-react'
import { toast } from 'sonner'
import type { EventType, Project } from '@/lib/types'

interface CreateEventModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projects?: Project[]
  defaultDate?: Date | null
  onSaved?: () => void
}

const eventTypes: EventType[] = ['meeting', 'deadline', 'milestone', 'review']

export function CreateEventModal({ open, onOpenChange, projects = [], defaultDate, onSaved }: CreateEventModalProps) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '09:00',
    type: 'meeting' as EventType,
    projectId: '',
  })

  useEffect(() => {
    const d = defaultDate || new Date()
    setForm((f) => ({
      ...f,
      date: d.toISOString().split('T')[0],
      title: '',
      description: '',
      time: '09:00',
      type: 'meeting',
      projectId: '',
    }))
  }, [defaultDate, open])

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.date) {
      toast.error('Title and date are required')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, projectId: form.projectId || null }),
      })
      if (!res.ok) throw new Error('Failed')
      toast.success('Event scheduled', { description: `"${form.title}" added to your calendar.` })
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
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-[0_0_24px_-4px_rgba(244,63,94,0.6)]">
              <CalendarPlus className="h-4 w-4 text-background" strokeWidth={2.5} />
            </div>
            Schedule Event
          </DialogTitle>
          <DialogDescription>Add a meeting, deadline, milestone, or review to your calendar.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="etitle">Event Title</Label>
            <Input
              id="etitle"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Sprint Planning"
              className="bg-white/5 border-white/10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edesc">Description</Label>
            <Textarea
              id="edesc"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Add agenda or notes…"
              rows={2}
              className="bg-white/5 border-white/10 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as EventType })}>
                <SelectTrigger className="bg-white/5 border-white/10 capitalize">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-strong border-white/10">
                  {eventTypes.map((t) => (
                    <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Project (optional)</Label>
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
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="edate">Date</Label>
              <Input
                id="edate"
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="etime">Time</Label>
              <Input
                id="etime"
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="bg-white/5 border-white/10"
              />
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
            className="bg-gradient-to-r from-rose-500 to-pink-600 text-background hover:shadow-[0_0_24px_-4px_rgba(244,63,94,0.6)] font-semibold"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Schedule Event
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
