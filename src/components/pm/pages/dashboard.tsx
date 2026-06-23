'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
} from 'recharts'
import {
  FolderKanban,
  CheckCircle2,
  Users,
  TrendingUp,
  ArrowUpRight,
  Activity as ActivityIcon,
  Clock,
  Sparkles,
  Zap,
  Target,
  Rocket,
} from 'lucide-react'
import type { DashboardStats, Activity, Project } from '@/lib/types'
import { colorGradients, statusConfig, formatRelative, getInitials } from '@/lib/pm-helpers'
import { useAppStore } from '@/lib/store/app-store'
import { motion } from 'framer-motion'

const PIE_COLORS = ['#f59e0b', '#10b981', '#8b5cf6', '#f43f5e', '#06b6d4']

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const { setPage, setSelectedProjectId } = useAppStore()

  const load = async () => {
    setLoading(true)
    try {
      const [dashRes, actRes, projRes] = await Promise.all([
        fetch('/api/dashboard'),
        fetch('/api/activities'),
        fetch('/api/projects'),
      ])
      setStats(await dashRes.json())
      setActivities(await actRes.json())
      setProjects(await projRes.json())
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  if (loading || !stats) {
    return (
      <div className="p-4 md:p-8 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 rounded-2xl glass animate-pulse" />
          ))}
        </div>
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 h-80 rounded-2xl glass animate-pulse" />
          <div className="h-80 rounded-2xl glass animate-pulse" />
        </div>
      </div>
    )
  }

  const { stats: s, weekData, statusCounts, recentProjects } = stats

  const pieData = statusCounts.map((sc) => ({
    name: sc.status.replace('_', ' '),
    value: sc._count,
  }))

  const statCards = [
    { label: 'Total Projects', value: s.projects, sub: `${s.activeProjects} active`, icon: FolderKanban, color: 'amber', trend: '+12%', page: 'projects' as const },
    { label: 'Tasks Completed', value: s.completedTasks, sub: `${s.completionRate}% rate`, icon: CheckCircle2, color: 'emerald', trend: '+24%', page: 'tasks' as const },
    { label: 'Team Members', value: s.members, sub: 'across 5 teams', icon: Users, color: 'violet', trend: '+3', page: 'team' as const },
    { label: 'Completion Rate', value: `${s.completionRate}%`, sub: 'this quarter', icon: TrendingUp, color: 'cyan', trend: '+8%', page: 'tasks' as const },
  ]

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 pb-16">
      {/* Hero greeting */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl border-gradient p-6 md:p-8 shadow-3d-lg"
      >
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-amber-500/15 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Badge className="mb-3 bg-amber-500/10 text-amber-400 border-amber-500/20">
              <Sparkles className="h-3 w-3 mr-1" /> Welcome back
            </Badge>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-glow-soft fade-in-up-2s">
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, Alex
            </h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base stagger-fade" style={{ animationDelay: '400ms' }}>
              You have <span className="text-amber-400 font-semibold text-glow-amber">{s.tasks} tasks</span> in flight across{' '}
              <span className="text-emerald-400 font-semibold text-glow-emerald">{s.activeProjects} active projects</span>.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setPage('tasks')}
              variant="outline"
              className="glass border-white/10 hover:bg-white/10"
            >
              <Target className="h-4 w-4 mr-1" /> View Tasks
            </Button>
            <Button
              onClick={() => setPage('projects')}
              className="bg-gradient-to-r from-amber-400 to-orange-600 text-background hover:shadow-3d-amber font-semibold"
            >
              <Rocket className="h-4 w-4 mr-1" /> New Project
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon
          const grad = colorGradients[stat.color as keyof typeof colorGradients]
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Card
                onClick={() => setPage(stat.page)}
                className="relative overflow-hidden glass border-white/5 card-3d hover:shadow-3d-lg p-4 md:p-5 h-full cursor-pointer group/stat"
              >
                <div className={`absolute -top-8 -right-8 h-24 w-24 rounded-full bg-gradient-to-br ${grad.bg} opacity-20 blur-2xl group-hover/stat:opacity-40 transition-opacity`} />
                <div className="relative">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${grad.bg} flex items-center justify-center shadow-3d`}>
                      <Icon className="h-5 w-5 text-background" strokeWidth={2.3} />
                    </div>
                    <Badge variant="outline" className="border-emerald-500/20 text-emerald-400 text-[10px]">
                      <ArrowUpRight className="h-2.5 w-2.5 mr-0.5" />{stat.trend}
                    </Badge>
                  </div>
                  <p className="text-2xl md:text-3xl font-bold tracking-tight">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
                  <p className="text-[10px] text-muted-foreground/60 mt-1">{stat.sub}</p>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Weekly activity area chart */}
        <Card className="lg:col-span-2 glass border-white/5 shadow-3d p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-400" /> Weekly Task Velocity
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">Tasks created in the last 7 days</p>
            </div>
            <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20">Live</Badge>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={weekData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="day" stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  background: 'rgba(20,20,28,0.95)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(12px)',
                }}
                labelStyle={{ color: '#f59e0b' }}
              />
              <Area
                type="monotone"
                dataKey="tasks"
                stroke="#f59e0b"
                strokeWidth={2.5}
                fill="url(#colorTasks)"
                dot={{ fill: '#f59e0b', r: 3 }}
                activeDot={{ r: 5, fill: '#fbbf24' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Task status pie + radial completion */}
        <Card className="glass border-white/5 shadow-3d p-5">
          <h3 className="font-semibold mb-1">Task Distribution</h3>
          <p className="text-xs text-muted-foreground mb-3">By workflow status</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: 'rgba(20,20,28,0.95)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-1.5 mt-2">
            {pieData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5 text-[10px]">
                <span className="h-2 w-2 rounded-full" style={{ background: PIE_COLORS[i] }} />
                <span className="text-muted-foreground capitalize">{d.name}</span>
                <span className="ml-auto font-medium">{d.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom row: recent projects + activity */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Recent projects */}
        <Card className="lg:col-span-2 glass border-white/5 shadow-3d p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <FolderKanban className="h-4 w-4 text-emerald-400" /> Active Projects
            </h3>
            <Button variant="ghost" size="sm" onClick={() => setPage('projects')} className="text-xs h-7">
              View all <ArrowUpRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
          <div className="space-y-2 max-h-80 overflow-y-auto scrollbar-cinematic pr-1">
            {projects.slice(0, 5).map((p) => {
              const grad = colorGradients[p.color]
              return (
                <button
                  key={p.id}
                  onClick={() => { setSelectedProjectId(p.id); setPage('tasks') }}
                  className="w-full group flex items-center gap-3 p-3 rounded-xl bg-white/3 hover:bg-white/5 border border-white/5 hover:border-white/10 transition-all duration-200 text-left card-3d"
                >
                  <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${grad.bg} flex items-center justify-center shadow-3d shrink-0`}>
                    <FolderKanban className="h-4 w-4 text-background" strokeWidth={2.3} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">{p.name}</p>
                      <Badge variant="outline" className={`text-[9px] px-1.5 py-0 ${statusConfig[p.status].className}`}>
                        {statusConfig[p.status].label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Progress value={p.progress} className="h-1.5 flex-1" />
                      <span className="text-[10px] text-muted-foreground w-9 text-right">{p.progress}%</span>
                    </div>
                  </div>
                </button>
              )
            })}
            {projects.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">No projects yet</p>
            )}
          </div>
        </Card>

        {/* Activity feed */}
        <Card className="glass border-white/5 shadow-3d p-5">
          <h3 className="font-semibold flex items-center gap-2 mb-4">
            <ActivityIcon className="h-4 w-4 text-violet-400" /> Recent Activity
          </h3>
          <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-cinematic pr-1">
            {activities.slice(0, 8).map((a) => (
              <div key={a.id} className="flex gap-3 group">
                <div className="relative shrink-0">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500/30 to-purple-600/30 border border-white/10 flex items-center justify-center text-[10px] font-bold">
                    {getInitials(a.userName)}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-amber-400 border-2 border-card" />
                </div>
                <div className="flex-1 min-w-0 pb-3 border-b border-white/5 last:border-0 last:pb-0">
                  <p className="text-xs font-medium leading-snug">{a.title}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">{a.description}</p>
                  <p className="text-[9px] text-muted-foreground/60 mt-1 flex items-center gap-1">
                    <Clock className="h-2.5 w-2.5" />{formatRelative(a.createdAt)}
                  </p>
                </div>
              </div>
            ))}
            {activities.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">No recent activity</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
