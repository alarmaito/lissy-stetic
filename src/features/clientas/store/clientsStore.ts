'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CLIENTS } from '@/shared/mock'
import type { Client } from '@/shared/mock'

interface ClientPhoto {
  before?: string // base64 data URL
  after?: string  // base64 data URL
}

interface ClientsState {
  clients: Client[]
  photos: Record<string, ClientPhoto>
  sentTriggers: Set<string> // trigger IDs that were "sent"
  addClient: (client: Omit<Client, 'id' | 'joinedAt' | 'avatarHue'>) => string
  updateNotes: (id: string, notes: string) => void
  addPhoto: (clientId: string, type: 'before' | 'after', dataUrl: string) => void
  markTriggerSent: (triggerId: string) => void
}

export const useClientsStore = create<ClientsState>()(
  persist(
    (set) => ({
      clients: CLIENTS,
      photos: {},
      sentTriggers: new Set<string>(),
      addClient: (client) => {
        const id = `c${Date.now()}`
        const hues = [340, 300, 25, 200, 160, 60, 280, 20]
        const avatarHue = hues[Math.floor(Math.random() * hues.length)]
        set((state) => ({
          clients: [
            { ...client, id, avatarHue, joinedAt: new Date().toISOString().split('T')[0] },
            ...state.clients,
          ],
        }))
        return id
      },
      updateNotes: (id, notes) =>
        set((state) => ({
          clients: state.clients.map((c) => (c.id === id ? { ...c, notes } : c)),
        })),
      addPhoto: (clientId, type, dataUrl) =>
        set((state) => ({
          photos: {
            ...state.photos,
            [clientId]: { ...state.photos[clientId], [type]: dataUrl },
          },
        })),
      markTriggerSent: (triggerId) =>
        set((state) => ({
          sentTriggers: new Set([...state.sentTriggers, triggerId]),
        })),
    }),
    {
      name: 'lissy-clients',
      partialize: (state) => ({
        clients: state.clients,
        photos: state.photos,
        sentTriggers: Array.from(state.sentTriggers), // serialize Set
      }),
      merge: (persisted: unknown, current) => {
        const p = persisted as Partial<ClientsState & { sentTriggers: string[] }>
        return {
          ...current,
          ...p,
          sentTriggers: new Set<string>(p.sentTriggers ?? []),
        }
      },
    }
  )
)
