'use client'

import { create } from 'zustand'
import type { PageKey } from '@/lib/types'

interface AppState {
  // Navigation
  currentPage: PageKey
  setPage: (page: PageKey) => void

  // Sidebar
  sidebarCollapsed: boolean
  toggleSidebar: () => void

  // Command palette
  commandOpen: boolean
  setCommandOpen: (open: boolean) => void

  // Active project filter (for tasks page)
  selectedProjectId: string | 'all'
  setSelectedProjectId: (id: string | 'all') => void

  // Search
  searchQuery: string
  setSearchQuery: (q: string) => void
}

export const useAppStore = create<AppState>((set) => ({
  currentPage: 'dashboard',
  setPage: (page) => set({ currentPage: page }),

  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

  commandOpen: false,
  setCommandOpen: (open) => set({ commandOpen: open }),

  selectedProjectId: 'all',
  setSelectedProjectId: (id) => set({ selectedProjectId: id }),

  searchQuery: '',
  setSearchQuery: (q) => set({ searchQuery: q }),
}))
