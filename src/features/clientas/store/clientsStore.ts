'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CLIENTS } from '@/shared/mock'
import type { Client } from '@/shared/mock'

export interface ClientPhotos {
  before: string[]
  after: string[]
}

interface ClientsState {
  clients: Client[]
  photos: Record<string, ClientPhotos>
  sentTriggers: Set<string>
  addClient: (client: Omit<Client, 'id' | 'joinedAt' | 'avatarHue'>) => string
  updateNotes: (id: string, notes: string) => void
  addPhoto: (clientId: string, type: 'before' | 'after', dataUrl: string) => void
  removePhoto: (clientId: string, type: 'before' | 'after', index: number) => void
  markTriggerSent: (triggerId: string) => void
}

function ensureBucket(photos: Record<string, ClientPhotos>, clientId: string): ClientPhotos {
  return photos[clientId] ?? { before: [], after: [] }
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
        set((state) => {
          const bucket = ensureBucket(state.photos, clientId)
          return {
            photos: {
              ...state.photos,
              [clientId]: { ...bucket, [type]: [...bucket[type], dataUrl] },
            },
          }
        }),
      removePhoto: (clientId, type, index) =>
        set((state) => {
          const bucket = ensureBucket(state.photos, clientId)
          return {
            photos: {
              ...state.photos,
              [clientId]: {
                ...bucket,
                [type]: bucket[type].filter((_, i) => i !== index),
              },
            },
          }
        }),
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
        sentTriggers: Array.from(state.sentTriggers),
      }),
      merge: (persisted: unknown, current) => {
        const p = persisted as Partial<{
          clients: Client[]
          photos: Record<string, ClientPhotos | { before?: string; after?: string }>
          sentTriggers: string[]
        }>
        // Normalize photos: legacy format had single strings, new format has arrays
        const normalizedPhotos: Record<string, ClientPhotos> = {}
        if (p.photos) {
          for (const [clientId, value] of Object.entries(p.photos)) {
            const v = value as ClientPhotos | { before?: string; after?: string }
            const beforeRaw = (v as ClientPhotos).before ?? (v as { before?: string }).before
            const afterRaw = (v as ClientPhotos).after ?? (v as { after?: string }).after
            normalizedPhotos[clientId] = {
              before: Array.isArray(beforeRaw) ? beforeRaw : beforeRaw ? [beforeRaw] : [],
              after: Array.isArray(afterRaw) ? afterRaw : afterRaw ? [afterRaw] : [],
            }
          }
        }
        return {
          ...current,
          ...p,
          photos: normalizedPhotos,
          sentTriggers: new Set<string>(p.sentTriggers ?? []),
        }
      },
    }
  )
)
