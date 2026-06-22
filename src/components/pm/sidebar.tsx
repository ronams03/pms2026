'use client'

import { useAppStore } from '@/lib/store/app-store'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  FolderKanban,
  KanbanSquare,
  Users,
  CalendarDays,
  Settings,
  Sparkles,
  ChevronLeft,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import type { PageKey } from '@/lib/types'
import { motion } from 'framer-motion'

interface NavItem {
  key: PageKey
  label: string
  icon: LucideIcon
  description: string
}

const navItems: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Overview & analytics' },
  { key: 'projects', label: 'Projects', icon: FolderKanban, description: 'All your work' },
  { key: 'tasks', label: 'Tasks', icon: KanbanSquare, description: 'Kanban board' },
  { key: 'team', label: 'Team', icon: Users, description: 'Members & roles' },
  { key: 'calendar', label: 'Calendar', icon: CalendarDays, description: 'Events & deadlines' },
  { key: 'settings', label: 'Settings', icon: Settings, description: 'Preferences' },
]

export function Sidebar() {
  const { currentPage, setPage, sidebarCollapsed, toggleSidebar } = useAppStore()

  return (
    <>
      {/* Mobile overlay */}
      {!sidebarCollapsed && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={cn(
          'fixed lg:sticky top-0 z-40 h-screen flex flex-col',
          'glass-strong border-r border-white/5',
          'transition-all duration-300 ease-out',
          sidebarCollapsed ? '-translate-x-full lg:translate-x-0 lg:w-0 lg:border-r-0' : 'translate-x-0 w-72',
        )}
      >
        <div className={cn('flex flex-col h-full', sidebarCollapsed && 'lg:hidden')}>
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 h-20 border-b border-white/5 shrink-0">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-600 blur-md opacity-60" />
              <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-3d-amber">
                <Sparkles className="h-5 w-5 text-background" strokeWidth={2.5} />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold tracking-tight text-gradient-amber">Nexus</h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Project Studio</p>
            </div>
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
              aria-label="Close sidebar"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto scrollbar-cinematic">
            <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
              Workspace
            </p>
            {navItems.map((item) => {
              const Icon = item.icon
              const active = currentPage === item.key
              return (
                <button
                  key={item.key}
                  onClick={() => {
                    setPage(item.key)
                    if (window.innerWidth < 1024) toggleSidebar()
                  }}
                  className={cn(
                    'group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200',
                    'text-left',
                    active
                      ? 'nav-active text-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/5',
                  )}
                >
                  {active && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-gradient-to-b from-amber-400 to-orange-600"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  <div className={cn(
                    'relative h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-200',
                    active
                      ? 'bg-gradient-to-br from-amber-400/20 to-orange-600/20 text-amber-400'
                      : 'bg-white/5 group-hover:bg-white/10',
                  )}>
                    <Icon className="h-4 w-4" strokeWidth={2.2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-tight">{item.label}</p>
                    <p className="text-[10px] text-muted-foreground/70 leading-tight mt-0.5 truncate">
                      {item.description}
                    </p>
                  </div>
                  {active && (
                    <div className="h-1.5 w-1.5 rounded-full bg-amber-400 pulse-glow" />
                  )}
                </button>
              )
            })}
          </nav>

          {/* Upgrade card */}
          <div className="p-3 shrink-0">
            <div className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent p-4">
              <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-amber-500/20 blur-2xl" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-3d-amber">
                    <Zap className="h-3.5 w-3.5 text-background" strokeWidth={2.5} />
                  </div>
                  <p className="text-sm font-semibold">Pro Plan</p>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
                  Unlock unlimited projects, advanced analytics & AI insights.
                </p>
                <button
                  onClick={() => useAppStore.getState().setPage('settings')}
                  className="w-full text-xs font-medium py-2 rounded-lg bg-gradient-to-r from-amber-400 to-orange-600 text-background hover:shadow-3d-amber transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Upgrade now
                </button>
              </div>
            </div>
          </div>

          {/* User */}
          <div className="px-3 pb-4 shrink-0">
            <button
              onClick={() => setPage('settings')}
              className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors"
            >
              <div className="relative">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-xs font-bold text-background shadow-3d">
                  AM
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 border-2 border-sidebar" />
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-medium truncate">Alex Morgan</p>
                <p className="text-[10px] text-muted-foreground truncate">Product Lead</p>
              </div>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
