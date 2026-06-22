'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Palette,
  Shield,
  Database,
  Sparkles,
  Save,
  Trash2,
  Download,
  Moon,
  Sun,
  Globe,
  Mail,
  Smartphone,
  KeyRound,
  CheckCircle2,
  Zap,
} from 'lucide-react'
import { toast } from 'sonner'
import { colorGradients } from '@/lib/pm-helpers'
import { cn } from '@/lib/utils'

export function SettingsPage() {
  const [profile, setProfile] = useState({
    name: 'Alex Morgan',
    email: 'alex@nexus.io',
    role: 'Product Lead',
    bio: 'Building cinematic project experiences. Coffee enthusiast. Mountain biker on weekends.',
    timezone: 'Asia/Shanghai',
  })
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    mentions: true,
    weekly: false,
    deadlines: true,
  })
  const [appearance, setAppearance] = useState({
    theme: 'dark',
    accent: 'amber',
    density: 'comfortable',
    reduceMotion: false,
  })
  const [saving, setSaving] = useState(false)

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      toast.success('Settings saved', { description: 'Your preferences have been updated.' })
    }, 800)
  }

  const handleResetData = async () => {
    try {
      await fetch('/api/seed', { method: 'POST' })
      toast.success('Demo data reset', { description: 'Fresh cinematic workspace ready.' })
    } catch {
      toast.error('Failed to reset data')
    }
  }

  const accentColors = ['amber', 'emerald', 'rose', 'violet', 'cyan'] as const

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 pb-16 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-slate-500 to-slate-700 flex items-center justify-center shadow-3d">
          <SettingsIcon className="h-5 w-5 text-background" strokeWidth={2.3} />
        </div>
        <div>
          <h2 className="font-semibold leading-tight">Settings</h2>
          <p className="text-xs text-muted-foreground">Manage your profile, preferences, and workspace</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="glass border-white/5 p-1 h-auto flex flex-wrap">
          <TabsTrigger value="profile" className="data-[state=active]:bg-white/10 data-[state=active]:text-amber-400 gap-1.5">
            <User className="h-3.5 w-3.5" /> Profile
          </TabsTrigger>
          <TabsTrigger value="appearance" className="data-[state=active]:bg-white/10 data-[state=active]:text-amber-400 gap-1.5">
            <Palette className="h-3.5 w-3.5" /> Appearance
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-white/10 data-[state=active]:text-amber-400 gap-1.5">
            <Bell className="h-3.5 w-3.5" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-white/10 data-[state=active]:text-amber-400 gap-1.5">
            <Shield className="h-3.5 w-3.5" /> Security
          </TabsTrigger>
          <TabsTrigger value="data" className="data-[state=active]:bg-white/10 data-[state=active]:text-amber-400 gap-1.5">
            <Database className="h-3.5 w-3.5" /> Data
          </TabsTrigger>
        </TabsList>

        {/* Profile tab */}
        <TabsContent value="profile">
          <Card className="glass border-white/5 shadow-3d p-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-2xl font-bold text-background shadow-3d-amber">
                  AM
                </div>
                <button className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-card border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                  <Sparkles className="h-3 w-3 text-amber-400" />
                </button>
              </div>
              <div>
                <h3 className="font-semibold text-lg">{profile.name}</h3>
                <p className="text-sm text-muted-foreground">{profile.role}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]">
                    <CheckCircle2 className="h-2.5 w-2.5 mr-1" /> Pro Member
                  </Badge>
                  <Badge variant="outline" className="text-[10px]">Since 2024</Badge>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pname">Full Name</Label>
                <Input
                  id="pname"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="bg-white/5 border-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pemail">Email</Label>
                <Input
                  id="pemail"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="bg-white/5 border-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prole">Role</Label>
                <Input
                  id="prole"
                  value={profile.role}
                  onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                  className="bg-white/5 border-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label>Timezone</Label>
                <Select value={profile.timezone} onValueChange={(v) => setProfile({ ...profile, timezone: v })}>
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-strong border-white/10">
                    <SelectItem value="Asia/Shanghai">Asia/Shanghai (UTC+8)</SelectItem>
                    <SelectItem value="America/New_York">America/New York (UTC-5)</SelectItem>
                    <SelectItem value="Europe/London">Europe/London (UTC+0)</SelectItem>
                    <SelectItem value="Asia/Tokyo">Asia/Tokyo (UTC+9)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pbio">Bio</Label>
              <Textarea
                id="pbio"
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                rows={3}
                className="bg-white/5 border-white/10 resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
              <Button variant="ghost">Cancel</Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-gradient-to-r from-amber-400 to-orange-600 text-background hover:shadow-3d-amber font-semibold"
              >
                <Save className="h-4 w-4" /> {saving ? 'Saving…' : 'Save Changes'}
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Appearance tab */}
        <TabsContent value="appearance">
          <Card className="glass border-white/5 shadow-3d p-6 space-y-6">
            <div>
              <h3 className="font-semibold flex items-center gap-2 mb-1">
                <Palette className="h-4 w-4 text-amber-400" /> Theme
              </h3>
              <p className="text-xs text-muted-foreground mb-4">Choose how Nexus looks to you</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'dark', label: 'Cinematic Dark', icon: Moon, desc: 'Deep slate with amber accents' },
                  { value: 'light', label: 'Bright Studio', icon: Sun, desc: 'Clean white with warm gold' },
                ].map((t) => {
                  const Icon = t.icon
                  return (
                    <button
                      key={t.value}
                      onClick={() => setAppearance({ ...appearance, theme: t.value })}
                      className={cn(
                        'relative p-4 rounded-xl border text-left transition-all',
                        appearance.theme === t.value
                          ? 'border-amber-500/40 bg-amber-500/5 shadow-3d-amber'
                          : 'border-white/10 bg-white/5 hover:border-white/20',
                      )}
                    >
                      <Icon className={cn('h-5 w-5 mb-2', appearance.theme === t.value ? 'text-amber-400' : 'text-muted-foreground')} />
                      <p className="text-sm font-medium">{t.label}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{t.desc}</p>
                      {appearance.theme === t.value && (
                        <CheckCircle2 className="absolute top-3 right-3 h-4 w-4 text-amber-400" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <h3 className="font-semibold flex items-center gap-2 mb-1">
                <Sparkles className="h-4 w-4 text-amber-400" /> Accent Color
              </h3>
              <p className="text-xs text-muted-foreground mb-3">Pick your signature color</p>
              <div className="flex gap-2 flex-wrap">
                {accentColors.map((c) => {
                  const grad = colorGradients[c]
                  return (
                    <button
                      key={c}
                      onClick={() => setAppearance({ ...appearance, accent: c })}
                      className={cn(
                        'relative h-12 w-12 rounded-xl bg-gradient-to-br transition-all',
                        grad.bg,
                        appearance.accent === c ? 'ring-2 ring-offset-2 ring-offset-background ring-white/40 scale-110 shadow-3d' : 'opacity-60 hover:opacity-100 hover:scale-105',
                      )}
                    >
                      {appearance.accent === c && (
                        <CheckCircle2 className="absolute inset-0 m-auto h-5 w-5 text-white" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Density</Label>
                <Select value={appearance.density} onValueChange={(v) => setAppearance({ ...appearance, density: v })}>
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-strong border-white/10">
                    <SelectItem value="compact">Compact</SelectItem>
                    <SelectItem value="comfortable">Comfortable</SelectItem>
                    <SelectItem value="spacious">Spacious</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                <div>
                  <p className="text-sm font-medium">Reduce Motion</p>
                  <p className="text-[10px] text-muted-foreground">Minimize animations</p>
                </div>
                <Switch
                  checked={appearance.reduceMotion}
                  onCheckedChange={(v) => setAppearance({ ...appearance, reduceMotion: v })}
                />
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-white/5">
              <Button
                onClick={handleSave}
                className="bg-gradient-to-r from-amber-400 to-orange-600 text-background hover:shadow-3d-amber font-semibold"
              >
                <Save className="h-4 w-4" /> Save Preferences
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Notifications tab */}
        <TabsContent value="notifications">
          <Card className="glass border-white/5 shadow-3d p-6 space-y-4">
            <h3 className="font-semibold flex items-center gap-2 mb-1">
              <Bell className="h-4 w-4 text-amber-400" /> Notification Preferences
            </h3>
            <p className="text-xs text-muted-foreground mb-4">Control what updates you receive and how</p>

            {[
              { key: 'email' as const, icon: Mail, label: 'Email Notifications', desc: 'Receive updates via email' },
              { key: 'push' as const, icon: Smartphone, label: 'Push Notifications', desc: 'Get alerts on your devices' },
              { key: 'mentions' as const, icon: Sparkles, label: 'Mentions & Comments', desc: 'When someone mentions you' },
              { key: 'deadlines' as const, icon: Zap, label: 'Deadline Reminders', desc: 'Alerts before tasks are due' },
              { key: 'weekly' as const, icon: Globe, label: 'Weekly Digest', desc: 'Summary of your week every Monday' },
            ].map((n) => {
              const Icon = n.icon
              return (
                <div key={n.key} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-white/5 flex items-center justify-center">
                      <Icon className="h-4 w-4 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{n.label}</p>
                      <p className="text-[10px] text-muted-foreground">{n.desc}</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications[n.key]}
                    onCheckedChange={(v) => setNotifications({ ...notifications, [n.key]: v })}
                  />
                </div>
              )
            })}

            <div className="flex justify-end pt-2 border-t border-white/5">
              <Button
                onClick={handleSave}
                className="bg-gradient-to-r from-amber-400 to-orange-600 text-background hover:shadow-3d-amber font-semibold"
              >
                <Save className="h-4 w-4" /> Save Preferences
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Security tab */}
        <TabsContent value="security">
          <Card className="glass border-white/5 shadow-3d p-6 space-y-4">
            <h3 className="font-semibold flex items-center gap-2 mb-1">
              <Shield className="h-4 w-4 text-amber-400" /> Security & Access
            </h3>
            <p className="text-xs text-muted-foreground mb-4">Keep your account secure</p>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <KeyRound className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Password</p>
                    <p className="text-[10px] text-muted-foreground">Last changed 3 months ago</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="border-white/10">Change</Button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <Smartphone className="h-5 w-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Two-Factor Authentication</p>
                    <p className="text-[10px] text-muted-foreground">Enabled on this account</p>
                  </div>
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                  <CheckCircle2 className="h-2.5 w-2.5 mr-1" /> Active
                </Badge>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                    <Globe className="h-5 w-5 text-violet-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Active Sessions</p>
                    <p className="text-[10px] text-muted-foreground">2 devices currently signed in</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="border-white/10">Manage</Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Data tab */}
        <TabsContent value="data">
          <Card className="glass border-white/5 shadow-3d p-6 space-y-4">
            <h3 className="font-semibold flex items-center gap-2 mb-1">
              <Database className="h-4 w-4 text-amber-400" /> Data & Workspace
            </h3>
            <p className="text-xs text-muted-foreground mb-4">Manage your workspace data</p>

            <div className="grid sm:grid-cols-2 gap-3">
              <button
                onClick={() => toast.success('Export started', { description: 'You will receive an email when ready.' })}
                className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all text-left"
              >
                <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Download className="h-5 w-5 text-emerald-400" />
                </div>
                <p className="text-sm font-medium">Export Data</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Download all your projects, tasks, and team data</p>
              </button>

              <button
                onClick={handleResetData}
                className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-amber-500/30 transition-all text-left"
              >
                <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Sparkles className="h-5 w-5 text-amber-400" />
                </div>
                <p className="text-sm font-medium">Reset Demo Data</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Restore the cinematic sample workspace</p>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/20">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-rose-500/10 flex items-center justify-center shrink-0">
                  <Trash2 className="h-5 w-5 text-rose-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-rose-400">Danger Zone</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 mb-3">
                    Permanently delete your workspace and all associated data. This cannot be undone.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toast.error('This is a demo — deletion disabled')}
                    className="border-rose-500/30 text-rose-400 hover:bg-rose-500/10"
                  >
                    Delete Workspace
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
