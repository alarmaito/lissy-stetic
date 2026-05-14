'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { UserPlus, Sparkles } from 'lucide-react'
import { ClientsTable } from '@/features/clientas/components/ClientsTable'
import { AddClientDialog } from '@/features/clientas/components/AddClientDialog'
import { useClientsStore } from '@/features/clientas/store/clientsStore'
import { seedBookings, seedClientPackages } from '@/shared/mock'

export default function ClientasPage() {
  const clients = useClientsStore((s) => s.clients)
  const [addOpen, setAddOpen] = useState(false)

  const now = new Date()
  const bookings = seedBookings(now)
  const clientPackages = seedClientPackages(now)

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{clients.length}</span> clientas registradas ·
            <span className="text-primary font-semibold ml-1.5">6 con paquete activo</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Sparkles className="h-4 w-4" />
            Generar triggers
          </Button>
          <Button className="gap-2" onClick={() => setAddOpen(true)}>
            <UserPlus className="h-4 w-4" />
            Nueva clienta
          </Button>
        </div>
      </div>

      <ClientsTable clients={clients} bookings={bookings} clientPackages={clientPackages} />

      <AddClientDialog open={addOpen} onOpenChange={setAddOpen} />
    </div>
  )
}
