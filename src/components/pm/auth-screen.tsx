'use client'

import { useState } from 'react'
import { useAuth } from '@/components/pm/auth-provider'
import { AnimatedText } from '@/components/pm/animated-text'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail, Lock, User, ArrowRight, Loader2, Eye, EyeOff, ShieldCheck, Zap, Target } from 'lucide-react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

type Mode = 'login' | 'register'

export function AuthScreen() {
  const { login, register } = useAuth()
  const [mode, setMode] = useState<Mode>('login')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.email.trim() || !form.password) {
      toast.error('Please fill in all fields')
      return
    }
    if (mode === 'register' && form.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      if (mode === 'register') {
        await register(form.name, form.email, form.password)
        toast.success('Account created!', { description: 'Welcome to Project Management System.' })
      } else {
        await login(form.email, form.password)
        toast.success('Welcome back!', { description: 'Loading your workspace…' })
      }
      // The AuthProvider state update triggers AppShell to re-render → dashboard shows.
      // No manual navigation needed.
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const switchMode = (m: Mode) => {
    setMode(m)
    setForm({ name: '', email: '', password: '' })
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-cinematic overflow-hidden">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-40 -left-40 h-[28rem] w-[28rem] rounded-full bg-amber-500/15 blur-[120px] animate-pulse" />
        <div className="absolute top-1/3 -right-40 h-[28rem] w-[28rem] rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 h-[28rem] w-[28rem] rounded-full bg-violet-500/8 blur-[120px]" />
      </div>

      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left: branding / showcase (hidden on mobile) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:flex flex-col gap-8"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-600 blur-md opacity-50" />
              <div className="relative h-14 w-14 rounded-2xl overflow-hidden shadow-3d-amber ring-1 ring-white/10">
                <img
                  src="/logo-pm.png"
                  alt="Project Management System logo"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gradient-animated leading-tight">PROJECT MANAGEMENT</h1>
              <p className="text-xs text-muted-foreground uppercase tracking-reveal">SYSTEM</p>
            </div>
          </div>

          <div>
            <h2 className="text-3xl xl:text-4xl font-bold tracking-tight leading-tight mb-3 text-glow-soft">
              <AnimatedText text="Where cinematic design" as="span" className="block" delay={200} stagger={28} />
              <span className="block">
                meets{' '}
                <span className="text-gradient-animated text-glow-amber">project mastery</span>.
              </span>
            </h2>
            <p className="text-muted-foreground leading-relaxed max-w-md fade-in-up-2s" style={{ animationDelay: '700ms' }}>
              Plan projects, run Kanban boards, and collaborate with your team — all in a beautifully crafted, 3D-realistic workspace.
            </p>
          </div>

          <div className="space-y-3">
            {[
              { icon: Target, title: 'Kanban Boards', desc: 'Drag, drop, and ship tasks with ease' },
              { icon: Zap, title: 'Real-time Dashboard', desc: 'Track velocity, status, and progress' },
              { icon: ShieldCheck, title: 'Secure Access', desc: 'Your data, protected and private' },
            ].map((f) => {
              const Icon = f.icon
              return (
                <div key={f.title} className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl glass border-white/5 flex items-center justify-center shadow-3d">
                    <Icon className="h-4 w-4 text-amber-400" strokeWidth={2.3} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{f.title}</p>
                    <p className="text-xs text-muted-foreground">{f.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Right: auth card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="glass-strong border-white/10 rounded-3xl shadow-3d-lg overflow-hidden">
            {/* Mobile logo */}
            <div className="lg:hidden flex items-center justify-center gap-3 pt-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-600 blur-md opacity-50" />
                <div className="relative h-11 w-11 rounded-xl overflow-hidden shadow-3d-amber ring-1 ring-white/10">
                  <img
                    src="/logo-pm.png"
                    alt="Project Management System logo"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Tab switch */}
            <div className="p-6 pb-0">
              <div className="flex rounded-xl bg-white/5 border border-white/10 p-1">
                <button
                  onClick={() => switchMode('login')}
                  className={cn(
                    'flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                    mode === 'login' ? 'bg-gradient-to-r from-amber-400 to-orange-600 text-background shadow-3d-amber' : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  Sign In
                </button>
                <button
                  onClick={() => switchMode('register')}
                  className={cn(
                    'flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                    mode === 'register' ? 'bg-gradient-to-r from-amber-400 to-orange-600 text-background shadow-3d-amber' : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  Create Account
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div className="text-center mb-2">
                    <h2 className="text-xl font-bold tracking-tight text-gradient-animated text-glow-amber">
                      <AnimatedText
                        key={mode}
                        text={mode === 'login' ? 'Welcome back' : 'Create your account'}
                        as="span"
                        delay={100}
                        stagger={35}
                      />
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1 stagger-fade" style={{ animationDelay: '500ms' }}>
                      {mode === 'login'
                        ? 'Sign in to access your cinematic workspace'
                        : 'Start managing your projects in minutes'}
                    </p>
                  </div>

                  {mode === 'register' && (
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="Alex Morgan"
                          className="pl-9 bg-white/5 border-white/10"
                          autoComplete="name"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="you@example.com"
                        className="pl-9 bg-white/5 border-white/10"
                        autoComplete="email"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        placeholder={mode === 'register' ? 'At least 6 characters' : '••••••••'}
                        className="pl-9 pr-9 bg-white/5 border-white/10"
                        autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-amber-400 to-orange-600 text-background hover:shadow-3d-amber font-semibold h-11"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        {mode === 'login' ? 'Sign In' : 'Create Account'}
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </>
                    )}
                  </Button>

                  <p className="text-center text-xs text-muted-foreground pt-1">
                    {mode === 'login' ? (
                      <>
                        Don&apos;t have an account?{' '}
                        <button type="button" onClick={() => switchMode('register')} className="text-amber-400 hover:underline font-medium">
                          Sign up
                        </button>
                      </>
                    ) : (
                      <>
                        Already have an account?{' '}
                        <button type="button" onClick={() => switchMode('login')} className="text-amber-400 hover:underline font-medium">
                          Sign in
                        </button>
                      </>
                    )}
                  </p>
                </motion.div>
              </AnimatePresence>
            </form>
          </div>

          <p className="text-center text-[10px] text-muted-foreground/60 mt-4">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
