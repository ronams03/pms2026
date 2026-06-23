'use client'

import { useAppStore } from '@/lib/store/app-store'
import { useAuth } from '@/components/pm/auth-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Bell, Search, Menu, Command, Plus, Sparkles, LogOut } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useState } from 'react'
import { CreateProjectModal } from '@/components/pm/modals/create-project-modal'
import { CreateTaskModal } from '@/components/pm/modals/create-task-modal'
import { toast } from 'sonner'

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard', subtitle: 'Your cinematic project overview' },
  projects: { title: 'Projects', subtitle: 'Manage and track all your work' },
  tasks: { title: 'Tasks', subtitle: 'Kanban board with drag and drop' },
  team: { title: 'Team', subtitle: 'Members, roles, and collaboration' },
  calendar: { title: 'Calendar', subtitle: 'Events, deadlines, and milestones' },
  settings: { title: 'Settings', subtitle: 'Customize your workspace' },
}

export function Topbar() {
  const { currentPage, toggleSidebar, setCommandOpen, setPage } = useAppStore()
  const { logout } = useAuth()
  const [projectModalOpen, setProjectModalOpen] = useState(false)
  const [taskModalOpen, setTaskModalOpen] = useState(false)
  const info = pageTitles[currentPage] ?? pageTitles.dashboard

  const handleLogout = async () => {
    await logout()
    toast.success('Signed out', { description: 'See you soon!' })
  }

  return (
    <>
      <header className="sticky top-0 z-20 h-20 glass-strong border-b border-white/5 flex items-center gap-3 px-4 lg:px-8">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden md:block min-w-0">
          <h2 key={info.title} className="text-lg font-bold tracking-tight truncate text-sweep fade-in-up-2s">{info.title}</h2>
          <p key={info.subtitle} className="text-xs text-muted-foreground truncate stagger-fade" style={{ animationDelay: '200ms' }}>{info.subtitle}</p>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md mx-auto md:mx-4">
          <button
            onClick={() => setCommandOpen(true)}
            className="group w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all duration-200"
          >
            <Search className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground flex-1 text-left">Search anything…</span>
            <kbd className="hidden md:flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-muted-foreground">
              <Command className="h-2.5 w-2.5" />K
            </kbd>
          </button>
        </div>

        {/* Quick create */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="relative bg-gradient-to-r from-amber-400 to-orange-600 text-background hover:shadow-3d-amber font-semibold shadow-3d">
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              <span className="hidden sm:inline">Create</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 glass-strong border-white/10">
            <DropdownMenuLabel className="text-muted-foreground text-xs">Quick Create</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/5" />
            <DropdownMenuItem
              onClick={() => setProjectModalOpen(true)}
              className="cursor-pointer focus:bg-white/5"
            >
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>New Project</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setTaskModalOpen(true)}
              className="cursor-pointer focus:bg-white/5"
            >
              <Plus className="h-4 w-4 text-emerald-400" />
              <span>New Task</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setPage('team')}
              className="cursor-pointer focus:bg-white/5"
            >
              <Plus className="h-4 w-4 text-violet-400" />
              <span>Invite Member</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setPage('calendar')}
              className="cursor-pointer focus:bg-white/5"
            >
              <Plus className="h-4 w-4 text-rose-400" />
              <span>Schedule Event</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all duration-200">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-amber-400 pulse-glow" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 glass-strong border-white/10">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              <Badge variant="secondary" className="text-[10px]">3 new</Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/5" />
            <div className="max-h-80 overflow-y-auto scrollbar-cinematic">
              {[
                { title: 'Sofia completed a task', desc: 'Onboarding flow v1 · 3h ago', dot: 'bg-emerald-400' },
                { title: 'New project created', desc: 'AI Insights Engine · 5h ago', dot: 'bg-amber-400' },
                { title: 'Diego joined the team', desc: 'Frontend Engineer · 1d ago', dot: 'bg-violet-400' },
                { title: 'Sprint planning tomorrow', desc: '10:00 AM · Conference room', dot: 'bg-sky-400' },
              ].map((n, i) => (
                <DropdownMenuItem key={i} className="cursor-pointer focus:bg-white/5 p-3">
                  <div className="flex gap-3 w-full">
                    <div className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${n.dot}`} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{n.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{n.desc}</p>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="relative p-2.5 rounded-xl bg-white/5 hover:bg-rose-500/10 border border-white/5 hover:border-rose-500/30 text-muted-foreground hover:text-rose-400 transition-all duration-200"
          aria-label="Sign out"
          title="Sign out"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </header>

      <CreateProjectModal open={projectModalOpen} onOpenChange={setProjectModalOpen} />
      <CreateTaskModal open={taskModalOpen} onOpenChange={setTaskModalOpen} />
    </>
  )
}
