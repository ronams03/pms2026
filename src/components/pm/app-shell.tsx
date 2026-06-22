'use client'

import { useEffect, useState } from 'react'
import { useAppStore } from '@/lib/store/app-store'
import { Sidebar } from '@/components/pm/sidebar'
import { Topbar } from '@/components/pm/topbar'
import { DashboardPage } from '@/components/pm/pages/dashboard'
import { ProjectsPage } from '@/components/pm/pages/projects'
import { TasksPage } from '@/components/pm/pages/tasks'
import { TeamPage } from '@/components/pm/pages/team'
import { CalendarPage } from '@/components/pm/pages/calendar'
import { SettingsPage } from '@/components/pm/pages/settings'
import { CommandPalette } from '@/components/pm/command-palette'
import { toast } from 'sonner'
import { Activity as ActivityIcon } from 'lucide-react'

export function AppShell() {
  const { currentPage, commandOpen, setCommandOpen } = useAppStore()
  const [seeding, setSeeding] = useState(false)

  // Seed on first mount if empty
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/projects')
        const data = await res.json()
        if (Array.isArray(data) && data.length === 0) {
          setSeeding(true)
          const seedRes = await fetch('/api/seed', { method: 'POST' })
          if (seedRes.ok) {
            toast.success('Welcome to Nexus — demo data loaded', {
              description: 'Explore the cinematic dashboard, projects, and Kanban board.',
            })
          }
        }
      } catch {
        // ignore
      } finally {
        setSeeding(false)
      }
    })()
  }, [])

  // Keyboard shortcut for command palette
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCommandOpen(!commandOpen)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [commandOpen, setCommandOpen])

  return (
    <div className="relative min-h-screen bg-cinematic flex">
      {/* Ambient background blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-amber-500/10 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 h-96 w-96 rounded-full bg-emerald-500/8 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-violet-500/6 blur-[120px]" />
      </div>

      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 lg:pl-0">
        <Topbar />
        <main className="flex-1 overflow-y-auto scrollbar-cinematic">
          {seeding && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
              <div className="glass-strong rounded-2xl px-8 py-6 flex items-center gap-4 shadow-3d-lg">
                <div className="h-10 w-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                <div>
                  <p className="font-medium">Loading cinematic workspace</p>
                  <p className="text-sm text-muted-foreground">Preparing your demo data…</p>
                </div>
              </div>
            </div>
          )}
          <div key={currentPage} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            {currentPage === 'dashboard' && <DashboardPage />}
            {currentPage === 'projects' && <ProjectsPage />}
            {currentPage === 'tasks' && <TasksPage />}
            {currentPage === 'team' && <TeamPage />}
            {currentPage === 'calendar' && <CalendarPage />}
            {currentPage === 'settings' && <SettingsPage />}
          </div>
        </main>
      </div>

      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
    </div>
  )
}
