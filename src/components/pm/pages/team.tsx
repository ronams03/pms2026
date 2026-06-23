'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Users,
  Plus,
  Search,
  Mail,
  MoreVertical,
  Pencil,
  Trash2,
  Briefcase,
  TrendingUp,
  CheckCircle2,
  Clock,
  Sparkles,
  LayoutGrid,
  List,
} from 'lucide-react'
import type { TeamMember } from '@/lib/types'
import { colorGradients, memberStatusConfig, getInitials } from '@/lib/pm-helpers'
import { CreateMemberModal } from '@/components/pm/modals/create-member-modal'
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
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

type ViewMode = 'list' | 'grid'

export function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [view, setView] = useState<ViewMode>('list')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<TeamMember | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/team')
      setMembers(await res.json())
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = members.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.role.toLowerCase().includes(search.toLowerCase()) ||
    m.department.toLowerCase().includes(search.toLowerCase()),
  )

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await fetch(`/api/team/${deleteId}`, { method: 'DELETE' })
      toast.success('Member removed')
      setDeleteId(null)
      load()
    } catch {
      toast.error('Failed to remove')
    }
  }

  const departments = Array.from(new Set(members.map((m) => m.department)))

  if (loading) {
    return (
      <div className="p-4 md:p-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 rounded-2xl glass animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 pb-16 fade-in-up-2s">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-3d">
            <Users className="h-5 w-5 text-background" strokeWidth={2.3} />
          </div>
          <div>
            <h2 className="font-semibold leading-tight text-glow-soft">Team Members</h2>
            <p className="text-xs text-muted-foreground">{members.length} members across {departments.length} departments</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search members…"
              className="pl-9 bg-white/5 border-white/10"
            />
          </div>
          <div className="flex rounded-xl bg-white/5 border border-white/10 p-0.5">
            <button
              onClick={() => setView('list')}
              className={cn('p-2 rounded-lg transition-colors', view === 'list' ? 'bg-white/10 text-violet-400' : 'text-muted-foreground')}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView('grid')}
              className={cn('p-2 rounded-lg transition-colors', view === 'grid' ? 'bg-white/10 text-violet-400' : 'text-muted-foreground')}
              aria-label="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
          <Button
            onClick={() => { setEditing(null); setModalOpen(true) }}
            className="bg-gradient-to-r from-violet-500 to-purple-600 text-background hover:shadow-[0_0_24px_-4px_rgba(139,92,246,0.6)] font-semibold"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            <span className="hidden sm:inline">Add Member</span>
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Members', value: members.length, icon: Users, color: 'violet' as const },
          { label: 'Active Now', value: members.filter(m => m.status === 'active').length, icon: CheckCircle2, color: 'emerald' as const },
          { label: 'Away', value: members.filter(m => m.status === 'away').length, icon: Clock, color: 'amber' as const },
          { label: 'Departments', value: departments.length, icon: Briefcase, color: 'cyan' as const },
        ].map((s) => {
          const grad = colorGradients[s.color]
          const Icon = s.icon
          return (
            <Card key={s.label} className="glass border-white/5 p-4 flex items-center gap-3">
              <div className={`h-9 w-9 rounded-lg bg-gradient-to-br ${grad.bg} flex items-center justify-center shadow-3d`}>
                <Icon className="h-4 w-4 text-background" strokeWidth={2.3} />
              </div>
              <div>
                <p className="text-xl font-bold leading-none">{s.value}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{s.label}</p>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Members list/grid */}
      {filtered.length === 0 ? (
        <Card className="glass border-white/5 p-12 text-center">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-600/20 flex items-center justify-center mb-4">
            <Users className="h-8 w-8 text-violet-400" />
          </div>
          <h3 className="font-semibold text-lg">No members found</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            {search ? 'Try a different search' : 'Add your first team member'}
          </p>
          <Button
            onClick={() => { setEditing(null); setModalOpen(true) }}
            className="bg-gradient-to-r from-violet-500 to-purple-600 text-background font-semibold"
          >
            <Plus className="h-4 w-4" /> Add Member
          </Button>
        </Card>
      ) : view === 'list' ? (
        <Card className="glass border-white/5 overflow-hidden">
          {/* Table header */}
          <div className="hidden md:grid grid-cols-12 gap-3 px-4 py-3 border-b border-white/5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
            <div className="col-span-4">Member</div>
            <div className="col-span-2">Department</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-3">Email</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>
          <div className="divide-y divide-white/5">
            {filtered.map((m, i) => {
              const grad = colorGradients[(m.avatar as keyof typeof colorGradients) || 'amber']
              const status = memberStatusConfig[m.status]
              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                  onClick={() => { setEditing(m); setModalOpen(true) }}
                  className="group grid grid-cols-12 gap-3 px-4 py-3 items-center hover:bg-white/3 transition-colors cursor-pointer"
                >
                  <div className="col-span-12 md:col-span-4 flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                      <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${grad.bg} flex items-center justify-center text-xs font-bold text-background shadow-3d`}>
                        {getInitials(m.name)}
                      </div>
                      <div className={cn('absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card', status.dot)} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{m.name}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{m.role}</p>
                    </div>
                  </div>
                  <div className="col-span-6 md:col-span-2 hidden md:block">
                    <Badge variant="outline" className="text-[10px] bg-white/5 border-white/10">
                      <Briefcase className="h-2.5 w-2.5 mr-1" />{m.department}
                    </Badge>
                  </div>
                  <div className="col-span-6 md:col-span-2 hidden md:block">
                    <Badge variant="outline" className={cn('text-[10px]', status.className, 'border-current/20')}>
                      <span className={cn('h-1.5 w-1.5 rounded-full mr-1', status.dot)} />
                      {status.label}
                    </Badge>
                  </div>
                  <div className="col-span-12 md:col-span-3 hidden md:block min-w-0">
                    <a
                      href={`mailto:${m.email}`}
                      className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Mail className="h-3 w-3 shrink-0" />
                      <span className="truncate">{m.email}</span>
                    </a>
                  </div>
                  <div className="col-span-12 md:col-span-1 flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="glass-strong border-white/10">
                        <DropdownMenuItem onClick={() => { setEditing(m); setModalOpen(true) }} className="cursor-pointer focus:bg-white/5">
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-white/5" />
                        <DropdownMenuItem
                          onClick={() => setDeleteId(m.id)}
                          className="cursor-pointer focus:bg-rose-500/10 text-rose-400"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Remove
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((m, i) => {
            const grad = colorGradients[(m.avatar as keyof typeof colorGradients) || 'amber']
            const status = memberStatusConfig[m.status]
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
              >
                <Card
                  onClick={() => { setEditing(m); setModalOpen(true) }}
                  className="group relative overflow-hidden glass border-white/5 card-3d hover:shadow-3d-lg p-5 cursor-pointer"
                >
                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className="relative">
                        <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${grad.bg} flex items-center justify-center text-lg font-bold text-background shadow-3d`}>
                          {getInitials(m.name)}
                        </div>
                        <div className={cn('absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-card', status.dot)} />
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="p-1.5 rounded-lg hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreVertical className="h-4 w-4 text-muted-foreground" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="glass-strong border-white/10">
                          <DropdownMenuItem onClick={() => { setEditing(m); setModalOpen(true) }} className="cursor-pointer focus:bg-white/5">
                            <Pencil className="h-3.5 w-3.5" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-white/5" />
                          <DropdownMenuItem
                            onClick={() => setDeleteId(m.id)}
                            className="cursor-pointer focus:bg-rose-500/10 text-rose-400"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <h3 className="font-semibold text-base leading-tight">{m.name}</h3>
                    <p className="text-sm text-muted-foreground">{m.role}</p>

                    <div className="flex items-center gap-2 mt-3">
                      <Badge variant="outline" className="text-[10px] bg-white/5 border-white/10">
                        <Briefcase className="h-2.5 w-2.5 mr-1" />{m.department}
                      </Badge>
                      <Badge variant="outline" className={cn('text-[10px]', status.className, 'border-current/20')}>
                        <span className={cn('h-1.5 w-1.5 rounded-full mr-1', status.dot)} />
                        {status.label}
                      </Badge>
                    </div>

                    <div className="mt-3 pt-3 border-t border-white/5">
                      <a
                        href={`mailto:${m.email}`}
                        className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Mail className="h-3 w-3" />
                        <span className="truncate">{m.email}</span>
                      </a>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}

      <CreateMemberModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        editingMember={editing}
        onSaved={load}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent className="glass-strong border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="h-4 w-4 text-rose-400" /> Remove Member?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This member will no longer have access to projects and tasks.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-rose-500 hover:bg-rose-600 text-white"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
