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
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, UserPlus } from 'lucide-react'
import { toast } from 'sonner'
import { colorGradients } from '@/lib/pm-helpers'
import { cn } from '@/lib/utils'
import type { TeamMember, MemberStatus } from '@/lib/types'

interface CreateMemberModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingMember?: TeamMember | null
  onSaved?: () => void
}

const colors = ['amber', 'emerald', 'rose', 'violet', 'cyan'] as const
const departments = ['Engineering', 'Design', 'Product', 'Quality', 'Analytics', 'Marketing', 'Operations']
const statuses: MemberStatus[] = ['active', 'away', 'offline']

export function CreateMemberModal({ open, onOpenChange, editingMember, onSaved }: CreateMemberModalProps) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    role: '',
    email: '',
    department: 'Engineering',
    avatar: 'amber',
    status: 'active' as MemberStatus,
  })

  useEffect(() => {
    if (editingMember) {
      setForm({
        name: editingMember.name,
        role: editingMember.role,
        email: editingMember.email,
        department: editingMember.department,
        avatar: editingMember.avatar || 'amber',
        status: editingMember.status,
      })
    } else {
      setForm({ name: '', role: '', email: '', department: 'Engineering', avatar: 'amber', status: 'active' })
    }
  }, [editingMember, open])

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      toast.error('Name and email are required')
      return
    }
    setLoading(true)
    try {
      const url = editingMember ? `/api/team/${editingMember.id}` : '/api/team'
      const method = editingMember ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Failed')
      toast.success(editingMember ? 'Member updated' : 'Member added', {
        description: `${form.name} is now on the team.`,
      })
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
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-[0_0_24px_-4px_rgba(139,92,246,0.6)]">
              <UserPlus className="h-4 w-4 text-background" strokeWidth={2.5} />
            </div>
            {editingMember ? 'Edit Member' : 'Add Team Member'}
          </DialogTitle>
          <DialogDescription>
            {editingMember ? 'Update member profile and role.' : 'Invite a new member to collaborate on projects.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Sofia Chen"
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="name@nexus.io"
                className="bg-white/5 border-white/10"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                placeholder="e.g. Senior Engineer"
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label>Department</Label>
              <Select value={form.department} onValueChange={(v) => setForm({ ...form, department: v })}>
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-strong border-white/10">
                  {departments.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as MemberStatus })}>
                <SelectTrigger className="bg-white/5 border-white/10 capitalize">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-strong border-white/10">
                  {statuses.map((s) => (
                    <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Avatar Color</Label>
              <div className="flex gap-2 flex-wrap pt-1">
                {colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setForm({ ...form, avatar: c })}
                    className={cn(
                      'h-8 w-8 rounded-full bg-gradient-to-br transition-all',
                      colorGradients[c].bg,
                      form.avatar === c ? 'ring-2 ring-offset-2 ring-offset-background ring-white/40 scale-110' : 'opacity-60 hover:opacity-100',
                    )}
                  />
                ))}
              </div>
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
            className="bg-gradient-to-r from-violet-500 to-purple-600 text-background hover:shadow-[0_0_24px_-4px_rgba(139,92,246,0.6)] font-semibold"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {editingMember ? 'Save Changes' : 'Add Member'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
