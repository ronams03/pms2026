'use client'

import { AuthProvider } from '@/components/pm/auth-provider'
import { ThemeProvider } from '@/components/pm/theme-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  )
}
