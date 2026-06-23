'use client'

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import type { SessionUser } from '@/lib/auth-server'

interface AuthContextValue {
  user: SessionUser | null
  loading: boolean
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>
  register: (name: string, email: string, password: string, rememberMe?: boolean) => Promise<void>
  logout: () => Promise<void>
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const USER_STORAGE_KEY = 'pms-user'

/** Save user to localStorage (only when remember me is checked) */
function saveUserLocal(user: SessionUser) {
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
  } catch {
    // ignore
  }
}

/** Read saved user from localStorage (returns null if not found/invalid) */
function readUserLocal(): SessionUser | null {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed && parsed.id && parsed.email) return parsed as SessionUser
    return null
  } catch {
    return null
  }
}

/** Clear saved user from localStorage */
function clearUserLocal() {
  try {
    localStorage.removeItem(USER_STORAGE_KEY)
  } catch {
    // ignore
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Lazy init: restore from localStorage immediately (instant login, no flash)
  const [user, setUser] = useState<SessionUser | null>(() => {
    if (typeof window === 'undefined') return null
    return readUserLocal()
  })
  const [loading, setLoading] = useState(true)
  const initialized = useRef(false)

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me', { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        if (data.user) {
          setUser(data.user)
          // Keep localStorage in sync (user might have been restored from there)
          saveUserLocal(data.user)
        } else {
          // Server says no session — clear local + state
          clearUserLocal()
          setUser(null)
        }
      } else {
        clearUserLocal()
        setUser(null)
      }
    } catch {
      // Network error: keep localStorage user if present (offline-friendly)
      // but mark loading false so UI can proceed
      if (!readUserLocal()) setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  // On mount: if we restored a user from localStorage, validate it with the server.
  // If no localStorage user, just check the cookie-based session.
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    refresh()
  }, [refresh])

  const login = useCallback(async (email: string, password: string, rememberMe = true) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, rememberMe }),
    })
    const data = await res.json()
    if (!res.ok) {
      throw new Error(data.error || 'Login failed')
    }
    setUser(data.user)
    // Persist to localStorage so the login survives browser restarts
    if (rememberMe) {
      saveUserLocal(data.user)
    } else {
      clearUserLocal()
    }
  }, [])

  const register = useCallback(async (name: string, email: string, password: string, rememberMe = true) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, rememberMe }),
    })
    const data = await res.json()
    if (!res.ok) {
      throw new Error(data.error || 'Registration failed')
    }
    setUser(data.user)
    if (rememberMe) {
      saveUserLocal(data.user)
    } else {
      clearUserLocal()
    }
  }, [])

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    clearUserLocal()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}
