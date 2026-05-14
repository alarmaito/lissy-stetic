'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Search, Filter, ChevronRight } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { initials, relativeDay } from '@/lib/utils'
import type { Booking, Client, ClientPackage } from '@/shared/mock'
import { getPackage, getService } from '@/shared/mock'

interface Props {
  clients: Client[]
  bookings: Booking[]
  clientPackages: ClientPackage[]
}

type FilterKey = 'todas' | 'paquete' | 'recientes' | 'inactivas'

export function ClientsTable({ clients, bookings, clientPackages }: Props) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<FilterKey>('todas')

  const enriched = useMemo(() => {
    const now = new Date()
    return clients.map((c) => {
      const cBookings = bookings.filter((b) => b.clientId === c.id)
      const past = cBookings.filter((b) => new Date(b.startsAt) <= now).sort((a, b) => new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime())
      const future = cBookings.filter((b) => new Date(b.startsAt) > now).sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())
      const pkg = clientPackages.find((p) => p.clientId === c.id)
      const lastVisit = past[0]
      const nextVisit = future[0]
      const daysSince = lastVisit
        ? Math.floor((now.getTime() - new Date(lastVisit.startsAt).getTime()) / (1000 * 60 * 60 * 24))
        : 999
      return { client: c, lastVisit, nextVisit, pkg, daysSince }
    })
  }, [clients, bookings, clientPackages])

  const filtered = useMemo(() => {
    let list = enriched
    if (query) {
      const q = query.toLowerCase()
      list = list.filter(
        (r) => r.client.name.toLowerCase().includes(q) || r.client.phone.includes(q)
      )
    }
    if (filter === 'paquete') list = list.filter((r) => r.pkg)
    if (filter === 'recientes') list = list.filter((r) => r.daysSince <= 7)
    if (filter === 'inactivas') list = list.filter((r) => r.daysSince > 30)
    return list
  }, [enriched, query, filter])

  const filterOptions: { key: FilterKey; label: string; count: number }[] = [
    { key: 'todas', label: 'Todas', count: enriched.length },
    { key: 'paquete', label: 'Con paquete activo', count: enriched.filter((r) => r.pkg).length },
    { key: 'recientes', label: 'Visita reciente', count: enriched.filter((r) => r.daysSince <= 7).length },
    { key: 'inactivas', label: 'Inactivas (+30 días)', count: enriched.filter((r) => r.daysSince > 30).length },
  ]

  return (
    <div className="space-y-5">
      <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o teléfono"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin pb-1">
          <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
          {filterOptions.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                filter === f.key
                  ? 'bg-gradient-rose text-primary-foreground shadow-glow'
                  : 'bg-secondary/60 text-muted-foreground hover:bg-secondary'
              }`}
            >
              {f.label} · {f.count}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border/70 bg-card overflow-hidden shadow-soft">
        <div className="hidden md:grid grid-cols-12 gap-3 px-5 py-3 border-b border-border/60 bg-secondary/40 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          <div className="col-span-4">Clienta</div>
          <div className="col-span-2">Último servicio</div>
          <div className="col-span-3">Paquete</div>
          <div className="col-span-2">Próxima cita</div>
          <div className="col-span-1" />
        </div>

        <div className="divide-y divide-border/60">
          {filtered.length === 0 && (
            <div className="px-5 py-12 text-center text-sm text-muted-foreground">
              No se encontraron clientas con esos filtros.
            </div>
          )}
          {filtered.map(({ client, lastVisit, nextVisit, pkg }) => {
            const lastService = lastVisit ? getService(lastVisit.serviceId) : null
            const nextService = nextVisit ? getService(nextVisit.serviceId) : null
            const pkgData = pkg ? getPackage(pkg.packageId) : null
            const progress = pkg ? (pkg.sessionsUsed / pkg.sessionsTotal) * 100 : 0

            return (
              <Link
                key={client.id}
                href={`/clientas/${client.id}`}
                className="grid grid-cols-2 md:grid-cols-12 gap-3 px-5 py-4 items-center hover:bg-secondary/30 transition-colors"
              >
                <div className="col-span-2 md:col-span-4 flex items-center gap-3 min-w-0">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarFallback style={{ background: `hsl(${client.avatarHue} 70% 70%)` }}>
                      {initials(client.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{client.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{client.phone}</p>
                  </div>
                </div>

                <div className="md:col-span-2">
                  {lastService ? (
                    <>
                      <p className="text-sm font-medium truncate">{lastService.name}</p>
                      <p className="text-xs text-muted-foreground">{relativeDay(lastVisit!.startsAt)}</p>
                    </>
                  ) : (
                    <p className="text-xs text-muted-foreground">Sin visitas</p>
                  )}
                </div>

                <div className="md:col-span-3">
                  {pkg && pkgData ? (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium truncate pr-2">Masaje reductivo</span>
                        <span className="text-muted-foreground shrink-0">
                          {pkg.sessionsUsed}/{pkg.sessionsTotal}
                        </span>
                      </div>
                      <Progress value={progress} />
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">—</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  {nextService && nextVisit ? (
                    <Badge variant="soft" className="font-medium">
                      {relativeDay(nextVisit.startsAt)}
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">Sin agendar</span>
                  )}
                </div>

                <div className="md:col-span-1 flex justify-end">
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
