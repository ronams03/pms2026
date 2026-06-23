'use client'

import { useEffect, useState, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Plus,
  Clock,
  Trash2,
  MapPin,
  Sparkles,
} from 'lucide-react'
import type { CalendarEvent, Project } from '@/lib/types'
import { eventTypeConfig, colorGradients } from '@/lib/pm-helpers'
import { CreateEventModal } from '@/components/pm/modals/create-event-modal'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [current, setCurrent] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const monthStr = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`
      const [eRes, pRes] = await Promise.all([
        fetch(`/api/events?month=${monthStr}`),
        fetch('/api/projects'),
      ])
      setEvents(await eRes.json())
      setProjects(await pRes.json())
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [current])

  const calendarDays = useMemo(() => {
    const year = current.getFullYear()
    const month = current.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startWeekday = firstDay.getDay()
    const daysInMonth = lastDay.getDate()

    const days: (Date | null)[] = []
    for (let i = 0; i < startWeekday; i++) days.push(null)
    for (let d = 1; d <= daysInMonth; d++) days.push(new Date(year, month, d))
    while (days.length % 7 !== 0) days.push(null)
    return days
  }, [current])

  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>()
    events.forEach((e) => {
      const key = new Date(e.date).toDateString()
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(e)
    })
    return map
  }, [events])

  const upcomingEvents = useMemo(() => {
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    return [...events]
      .filter((e) => new Date(e.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 6)
  }, [events])

  const today = new Date()
  const isToday = (d: Date) => d.toDateString() === today.toDateString()
  const isSelected = (d: Date) => selectedDate && d.toDateString() === selectedDate.toDateString()

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await fetch(`/api/events/${deleteId}`, { method: 'DELETE' })
      toast.success('Event deleted')
      setDeleteId(null)
      load()
    } catch {
      toast.error('Failed to delete')
    }
  }

  const goToday = () => setCurrent(new Date())
  const prevMonth = () => setCurrent(new Date(current.getFullYear(), current.getMonth() - 1, 1))
  const nextMonth = () => setCurrent(new Date(current.getFullYear(), current.getMonth() + 1, 1))

  const selectedDayEvents = selectedDate ? eventsByDay.get(selectedDate.toDateString()) || [] : []

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 pb-16 fade-in-up-2s">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-3d">
            <CalendarDays className="h-5 w-5 text-background" strokeWidth={2.3} />
          </div>
          <div>
            <h2 className="font-semibold leading-tight text-glow-soft">
              {MONTHS[current.getMonth()]} {current.getFullYear()}
            </h2>
            <p className="text-xs text-muted-foreground">{events.length} events this month</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-xl bg-white/5 border border-white/10 p-0.5">
            <Button variant="ghost" size="icon" onClick={prevMonth} className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={goToday} className="h-8 text-xs">Today</Button>
            <Button variant="ghost" size="icon" onClick={nextMonth} className="h-8 w-8">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button
            onClick={() => { setSelectedDate(new Date()); setModalOpen(true) }}
            className="bg-gradient-to-r from-rose-500 to-pink-600 text-background hover:shadow-[0_0_24px_-4px_rgba(244,63,94,0.6)] font-semibold"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            <span className="hidden sm:inline">New Event</span>
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Calendar grid */}
        <Card className="lg:col-span-2 glass border-white/5 shadow-3d p-4 md:p-5">
          {/* Weekday header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {WEEKDAYS.map((d) => (
              <div key={d} className="text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground py-2">
                {d}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, i) => {
              if (!day) return <div key={i} className="aspect-square" />
              const dayEvents = eventsByDay.get(day.toDateString()) || []
              const isCurrentMonth = day.getMonth() === current.getMonth()
              return (
                <button
                  key={i}
                  onClick={() => setSelectedDate(day)}
                  className={cn(
                    'relative aspect-square rounded-lg p-1.5 flex flex-col items-start text-left transition-all duration-200',
                    'hover:bg-white/5 border',
                    isSelected(day) ? 'bg-amber-500/10 border-amber-500/40 shadow-3d-amber' : 'border-transparent',
                    !isCurrentMonth && 'opacity-30',
                  )}
                >
                  <span className={cn(
                    'text-xs font-medium',
                    isToday(day) && 'flex items-center justify-center h-5 w-5 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 text-background text-[10px] font-bold',
                  )}>
                    {day.getDate()}
                  </span>
                  {dayEvents.length > 0 && (
                    <div className="mt-auto w-full space-y-0.5">
                      {dayEvents.slice(0, 2).map((e) => {
                        const cfg = eventTypeConfig[e.type as keyof typeof eventTypeConfig] || eventTypeConfig.meeting
                        return (
                          <div
                            key={e.id}
                            className={cn('text-[8px] px-1 py-0.5 rounded truncate border', cfg.className)}
                            title={e.title}
                          >
                            {e.title}
                          </div>
                        )
                      })}
                      {dayEvents.length > 2 && (
                        <div className="text-[8px] text-muted-foreground px-1">+{dayEvents.length - 2} more</div>
                      )}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </Card>

        {/* Sidebar: selected day + upcoming */}
        <div className="space-y-4">
          {/* Selected day events */}
          <Card className="glass border-white/5 shadow-3d p-5">
            <h3 className="font-semibold mb-1">
              {selectedDate ? selectedDate.toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' }) : 'Select a day'}
            </h3>
            <p className="text-xs text-muted-foreground mb-3">{selectedDayEvents.length} event{selectedDayEvents.length !== 1 ? 's' : ''}</p>
            <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-cinematic">
              {selectedDayEvents.length === 0 ? (
                <button
                  onClick={() => { if (selectedDate) setModalOpen(true) }}
                  className="w-full py-6 flex flex-col items-center gap-2 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  <span className="text-xs">No events — add one</span>
                </button>
              ) : (
                selectedDayEvents.map((e) => {
                  const cfg = eventTypeConfig[e.type as keyof typeof eventTypeConfig] || eventTypeConfig.meeting
                  const project = projects.find((p) => p.id === e.projectId)
                  return (
                    <motion.div
                      key={e.id}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="group relative p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className={cn('h-2 w-2 rounded-full', cfg.dot)} />
                            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">{cfg.label}</span>
                          </div>
                          <p className="text-sm font-medium leading-tight">{e.title}</p>
                          <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                            <Clock className="h-2.5 w-2.5" />{e.time}
                          </p>
                          {project && (
                            <Badge variant="outline" className={cn('text-[9px] mt-1.5', colorGradients[project.color as keyof typeof colorGradients]?.soft)}>
                              {project.name}
                            </Badge>
                          )}
                        </div>
                        <button
                          onClick={() => setDeleteId(e.id)}
                          className="p-1 rounded hover:bg-rose-500/10 text-muted-foreground hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </motion.div>
                  )
                })
              )}
            </div>
          </Card>

          {/* Upcoming events */}
          <Card className="glass border-white/5 shadow-3d p-5">
            <h3 className="font-semibold mb-1 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-400" /> Upcoming
            </h3>
            <p className="text-xs text-muted-foreground mb-3">Next events on your calendar</p>
            <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-cinematic">
              {upcomingEvents.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-6">No upcoming events</p>
              ) : (
                upcomingEvents.map((e) => {
                  const cfg = eventTypeConfig[e.type as keyof typeof eventTypeConfig] || eventTypeConfig.meeting
                  const d = new Date(e.date)
                  return (
                    <div key={e.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                      <div className="text-center shrink-0">
                        <p className="text-[9px] text-muted-foreground uppercase">{d.toLocaleDateString('en', { month: 'short' })}</p>
                        <p className="text-lg font-bold leading-none">{d.getDate()}</p>
                      </div>
                      <div className="w-px h-8 bg-white/10" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{e.title}</p>
                        <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Clock className="h-2.5 w-2.5" />{e.time}
                          <span className={cn('h-1 w-1 rounded-full ml-1', cfg.dot)} />
                          {cfg.label}
                        </p>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </Card>
        </div>
      </div>

      <CreateEventModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        projects={projects}
        defaultDate={selectedDate || new Date()}
        onSaved={load}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent className="glass-strong border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="h-4 w-4 text-rose-400" /> Delete Event?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This event will be permanently removed from your calendar.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-rose-500 hover:bg-rose-600 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
