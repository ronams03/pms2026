'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  FolderKanban,
  Plus,
  Search,
  LayoutGrid,
  List,
  MoreVertical,
  Pencil,
  Trash2,
  Calendar,
  Flag,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import type { Project } from '@/lib/types'
import { colorGradients, statusConfig, priorityConfig, formatDate, daysUntil } from '@/lib/pm-helpers'
import { CreateProjectModal } from '@/components/pm/modals/create-project-modal'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAppStore } from '@/lib/store/app-store'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

type ViewMode = 'grid' | 'list'
type FilterStatus = 'all' | 'planning' | 'active' | 'on_hold' | 'completed'

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<ViewMode>('grid')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Project | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const { setPage, setSelectedProjectId } = useAppStore()

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/projects')
      setProjects(await res.json())
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = projects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await fetch(`/api/projects/${deleteId}`, { method: 'DELETE' })
      toast.success('Project deleted')
      setDeleteId(null)
      load()
    } catch {
      toast.error('Failed to delete')
    }
  }

  const handleEdit = (p: Project) => {
    setEditing(p)
    setModalOpen(true)
  }

  if (loading) {
    return (
      <div className="p-4 md:p-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-56 rounded-2xl glass animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 pb-16">
      {/* Header actions */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between">
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects…"
            className="pl-9 bg-white/5 border-white/10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as FilterStatus)}>
            <SelectTrigger className="w-36 bg-white/5 border-white/10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="glass-strong border-white/10">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="planning">Planning</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="on_hold">On Hold</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex rounded-xl bg-white/5 border border-white/10 p-0.5">
            <button
              onClick={() => setView('grid')}
              className={cn('p-2 rounded-lg transition-colors', view === 'grid' ? 'bg-white/10 text-amber-400' : 'text-muted-foreground')}
              aria-label="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView('list')}
              className={cn('p-2 rounded-lg transition-colors', view === 'list' ? 'bg-white/10 text-amber-400' : 'text-muted-foreground')}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          <Button
            onClick={() => { setEditing(null); setModalOpen(true) }}
            className="bg-gradient-to-r from-amber-400 to-orange-600 text-background hover:shadow-3d-amber font-semibold"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            <span className="hidden sm:inline">New Project</span>
          </Button>
        </div>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total', value: projects.length, color: 'amber' as const },
          { label: 'Active', value: projects.filter(p => p.status === 'active').length, color: 'emerald' as const },
          { label: 'Planning', value: projects.filter(p => p.status === 'planning').length, color: 'violet' as const },
          { label: 'Completed', value: projects.filter(p => p.status === 'completed').length, color: 'rose' as const },
        ].map((s) => {
          const grad = colorGradients[s.color]
          return (
            <Card key={s.label} className="glass border-white/5 p-4 flex items-center gap-3">
              <div className={`h-9 w-9 rounded-lg bg-gradient-to-br ${grad.bg} flex items-center justify-center shadow-3d`}>
                <FolderKanban className="h-4 w-4 text-background" strokeWidth={2.3} />
              </div>
              <div>
                <p className="text-xl font-bold leading-none">{s.value}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{s.label}</p>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Projects grid/list */}
      {filtered.length === 0 ? (
        <Card className="glass border-white/5 p-12 text-center">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-amber-400/20 to-orange-600/20 flex items-center justify-center mb-4">
            <FolderKanban className="h-8 w-8 text-amber-400" />
          </div>
          <h3 className="font-semibold text-lg">No projects found</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            {search || statusFilter !== 'all' ? 'Try adjusting your filters' : 'Create your first project to get started'}
          </p>
          <Button
            onClick={() => { setEditing(null); setModalOpen(true) }}
            className="bg-gradient-to-r from-amber-400 to-orange-600 text-background hover:shadow-3d-amber font-semibold"
          >
            <Plus className="h-4 w-4" /> Create Project
          </Button>
        </Card>
      ) : view === 'grid' ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p, i) => {
            const grad = colorGradients[p.color]
            const days = daysUntil(p.dueDate)
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
              >
                <Card className="group relative overflow-hidden glass border-white/5 card-3d hover:shadow-3d-lg h-full flex flex-col">
                  {/* Color top accent */}
                  <div className={`h-1.5 bg-gradient-to-r ${grad.bg}`} />

                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${grad.bg} flex items-center justify-center shadow-3d ${grad.glow}`}>
                        <FolderKanban className="h-5 w-5 text-background" strokeWidth={2.3} />
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1.5 rounded-lg hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical className="h-4 w-4 text-muted-foreground" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="glass-strong border-white/10">
                          <DropdownMenuItem onClick={() => handleEdit(p)} className="cursor-pointer focus:bg-white/5">
                            <Pencil className="h-3.5 w-3.5" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => { setSelectedProjectId(p.id); setPage('tasks') }}
                            className="cursor-pointer focus:bg-white/5"
                          >
                            <ArrowRight className="h-3.5 w-3.5" /> View Tasks
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-white/5" />
                          <DropdownMenuItem
                            onClick={() => setDeleteId(p.id)}
                            className="cursor-pointer focus:bg-rose-500/10 text-rose-400"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <h3 className="font-semibold text-base leading-tight mb-1">{p.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3 flex-1">{p.description || 'No description'}</p>

                    <div className="flex items-center gap-1.5 mb-3">
                      <Badge variant="outline" className={`text-[10px] ${statusConfig[p.status].className}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${statusConfig[p.status].dot} mr-1`} />
                        {statusConfig[p.status].label}
                      </Badge>
                      <Badge variant="outline" className={`text-[10px] ${priorityConfig[p.priority].className}`}>
                        <Flag className="h-2.5 w-2.5 mr-1" />{priorityConfig[p.priority].label}
                      </Badge>
                    </div>

                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] text-muted-foreground">Progress</span>
                        <span className="text-xs font-semibold">{p.progress}%</span>
                      </div>
                      <Progress value={p.progress} className="h-1.5" />
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/5 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />{formatDate(p.dueDate)}
                      </span>
                      {days !== null && p.status !== 'completed' && (
                        <span className={cn('flex items-center gap-1', days < 0 ? 'text-rose-400' : days < 7 ? 'text-amber-400' : '')}>
                          <Clock className="h-3 w-3" />
                          {days < 0 ? `${Math.abs(days)}d overdue` : days === 0 ? 'Today' : `${days}d left`}
                        </span>
                      )}
                      {p.status === 'completed' && (
                        <span className="flex items-center gap-1 text-emerald-400">
                          <CheckCircle2 className="h-3 w-3" /> Completed
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
      ) : (
        <Card className="glass border-white/5 overflow-hidden">
          <div className="divide-y divide-white/5">
            {filtered.map((p) => {
              const grad = colorGradients[p.color]
              return (
                <div key={p.id} className="flex items-center gap-3 p-4 hover:bg-white/3 transition-colors group">
                  <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${grad.bg} flex items-center justify-center shadow-3d shrink-0`}>
                    <FolderKanban className="h-4 w-4 text-background" strokeWidth={2.3} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{p.name}</p>
                      <Badge variant="outline" className={`text-[10px] ${statusConfig[p.status].className}`}>
                        {statusConfig[p.status].label}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{p.description}</p>
                  </div>
                  <div className="hidden md:block w-32">
                    <Progress value={p.progress} className="h-1.5" />
                    <p className="text-[10px] text-muted-foreground mt-1">{p.progress}%</p>
                  </div>
                  <Badge variant="outline" className={`text-[10px] ${priorityConfig[p.priority].className} hidden sm:flex`}>
                    {priorityConfig[p.priority].label}
                  </Badge>
                  <div className="hidden lg:block text-xs text-muted-foreground w-24">{formatDate(p.dueDate)}</div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1.5 rounded-lg hover:bg-white/10">
                        <MoreVertical className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="glass-strong border-white/10">
                      <DropdownMenuItem onClick={() => handleEdit(p)} className="cursor-pointer focus:bg-white/5">
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => { setSelectedProjectId(p.id); setPage('tasks') }}
                        className="cursor-pointer focus:bg-white/5"
                      >
                        <ArrowRight className="h-3.5 w-3.5" /> View Tasks
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-white/5" />
                      <DropdownMenuItem
                        onClick={() => setDeleteId(p.id)}
                        className="cursor-pointer focus:bg-rose-500/10 text-rose-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      <CreateProjectModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        editingProject={editing}
        onSaved={load}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent className="glass-strong border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="h-4 w-4 text-rose-400" /> Delete Project?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the project and all its tasks. This action cannot be undone.
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
