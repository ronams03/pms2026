'use client'

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { useAppStore } from '@/lib/store/app-store'
import {
  LayoutDashboard,
  FolderKanban,
  KanbanSquare,
  Users,
  CalendarDays,
  Settings,
  Plus,
  Search,
  Sparkles,
  ArrowRight,
} from 'lucide-react'

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const { setPage } = useAppStore()

  const go = (page: Parameters<typeof setPage>[0]) => {
    setPage(page)
    onOpenChange(false)
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search projects, tasks, or jump to a page…" />
      <CommandList className="scrollbar-cinematic">
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => go('dashboard')} className="cursor-pointer">
            <LayoutDashboard className="h-4 w-4 text-amber-400" />
            <span>Go to Dashboard</span>
          </CommandItem>
          <CommandItem onSelect={() => go('projects')} className="cursor-pointer">
            <FolderKanban className="h-4 w-4 text-emerald-400" />
            <span>Go to Projects</span>
          </CommandItem>
          <CommandItem onSelect={() => go('tasks')} className="cursor-pointer">
            <KanbanSquare className="h-4 w-4 text-violet-400" />
            <span>Go to Tasks Board</span>
          </CommandItem>
          <CommandItem onSelect={() => go('team')} className="cursor-pointer">
            <Users className="h-4 w-4 text-rose-400" />
            <span>Go to Team</span>
          </CommandItem>
          <CommandItem onSelect={() => go('calendar')} className="cursor-pointer">
            <CalendarDays className="h-4 w-4 text-sky-400" />
            <span>Go to Calendar</span>
          </CommandItem>
          <CommandItem onSelect={() => go('settings')} className="cursor-pointer">
            <Settings className="h-4 w-4 text-slate-400" />
            <span>Go to Settings</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Quick Actions">
          <CommandItem onSelect={() => go('projects')} className="cursor-pointer">
            <Plus className="h-4 w-4 text-amber-400" />
            <span>Create new project</span>
            <ArrowRight className="ml-auto h-3 w-3 text-muted-foreground" />
          </CommandItem>
          <CommandItem onSelect={() => go('tasks')} className="cursor-pointer">
            <Plus className="h-4 w-4 text-emerald-400" />
            <span>Create new task</span>
            <ArrowRight className="ml-auto h-3 w-3 text-muted-foreground" />
          </CommandItem>
          <CommandItem onSelect={() => go('calendar')} className="cursor-pointer">
            <Plus className="h-4 w-4 text-rose-400" />
            <span>Schedule new event</span>
            <ArrowRight className="ml-auto h-3 w-3 text-muted-foreground" />
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Suggestions">
          <CommandItem onSelect={() => go('dashboard')} className="cursor-pointer">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>View dashboard analytics</span>
          </CommandItem>
          <CommandItem onSelect={() => go('tasks')} className="cursor-pointer">
            <Search className="h-4 w-4 text-violet-400" />
            <span>Review tasks in progress</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
