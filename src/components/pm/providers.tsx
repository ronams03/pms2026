'use client'

import { AuthProvider } from '@/components/pm/auth-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}
