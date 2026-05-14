'use client'

import { useMemo, useState } from 'react'
import {
  Calendar,
  Clock,
  DollarSign,
  User,
  CheckCircle2,
  RefreshCcw,
  Award,
  History,
  Heart,
  Sparkles,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
  getClient,
  getPackage,
  getService,
  seedBookings,
  seedClientPackages,
  SERVICE_COLORS,
} from '@/shared/mock'
import type { Booking } from '@/shared/mock'
import { formatDate, formatTime, formatCurrency, initials } from '@/lib/utils'

interface Props {
  booking: Booking | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const STATUS_LABELS: Record<Booking['status'], string> = {
  confirmed: 'Confirmada',
  pending: 'Pendiente',
  completed: 'Completada',
  cancelled: 'Cancelada',
}

const STATUS_VARIANT: Record<Booking['status'], 'success' | 'warning' | 'soft' | 'destructive'> = {
  confirmed: 'success',
  pending: 'warning',
  completed: 'soft',
  cancelled: 'destructive',
}

export function BookingDetailDialog({ booking, open, onOpenChange }: Props) {
  const [confirmed, setConfirmed] = useState(false)
  const [rescheduleMsg, setRescheduleMsg] = useState(false)

  const summary = useMemo(() => {
    if (!booking) return null
    const now = new Date()
    const clientBookings = seedBookings(now).filter((b) => b.clientId === booking.clientId)
    const past = clientBookings
      .filter((b) => new Date(b.startsAt) < new Date(booking.startsAt))
      .sort((a, b) => new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime())
    const pkg = seedClientPackages(now).find((p) => p.clientId === booking.clientId)
    const pkgData = pkg ? getPackage(pkg.packageId) : null
    const totalSpent = past.reduce((sum, b) => {
      const svc = getService(b.serviceId)
      return sum + (svc?.price ?? 0)
    }, 0)
    const lastVisit = past[0]
    return {
      visitCount: past.length,
      totalSpent,
      lastVisit,
      pkg,
      pkgData,
    }
  }, [booking])

  if (!booking || !summary) return null

  const client = getClient(booking.clientId)
  const svc = getService(booking.serviceId)
  if (!client || !svc) return null

  const start = new Date(booking.startsAt)
  const end = new Date(booking.endsAt)
  const durationMin = Math.round((end.getTime() - start.getTime()) / 60000)
  const color = SERVICE_COLORS[svc.id] ?? '#e879a0'

  function handleClose(o: boolean) {
    if (!o) {
      setConfirmed(false)
      setRescheduleMsg(false)
    }
    onOpenChange(o)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <span
              className="h-3 w-3 rounded-full shrink-0"
              style={{ background: color }}
            />
            Detalle de la cita
          </DialogTitle>
        </DialogHeader>

        {/* Cliente con resumen rápido */}
        <div className="rounded-xl bg-gradient-soft border border-border/60 p-3 space-y-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 shrink-0">
              <AvatarFallback style={{ background: `hsl(${client.avatarHue} 70% 65%)` }}>
                {initials(client.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-sm truncate">{client.name}</p>
              <p className="text-xs text-muted-foreground">{client.phone}</p>
            </div>
            <Badge variant={STATUS_VARIANT[booking.status]}>
              {STATUS_LABELS[booking.status]}
            </Badge>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg bg-card/60 px-2 py-1.5">
              <div className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground font-medium">
                <History className="h-3 w-3" />
                Visitas
              </div>
              <p className="text-sm font-bold text-foreground mt-0.5">{summary.visitCount}</p>
            </div>
            <div className="rounded-lg bg-card/60 px-2 py-1.5">
              <div className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground font-medium">
                <DollarSign className="h-3 w-3" />
                Total
              </div>
              <p className="text-sm font-bold text-primary mt-0.5">{formatCurrency(summary.totalSpent)}</p>
            </div>
            <div className="rounded-lg bg-card/60 px-2 py-1.5">
              <div className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground font-medium">
                <Calendar className="h-3 w-3" />
                Última
              </div>
              <p className="text-sm font-bold text-foreground mt-0.5">
                {summary.lastVisit ? formatDate(summary.lastVisit.startsAt, { day: '2-digit', month: 'short' }) : '—'}
              </p>
            </div>
          </div>

          {summary.pkg && summary.pkgData && (
            <div className="flex items-center gap-2 rounded-lg bg-primary/10 border border-primary/20 px-3 py-2">
              <Award className="h-4 w-4 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold leading-tight">{summary.pkgData.name}</p>
                <p className="text-[10px] text-muted-foreground">
                  Sesión {summary.pkg.sessionsUsed} de {summary.pkg.sessionsTotal} ·
                  {' '}{summary.pkg.sessionsTotal - summary.pkg.sessionsUsed} restantes
                </p>
              </div>
            </div>
          )}

          {client.notes && (
            <div className="flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200/60 px-3 py-2">
              <Heart className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-700">Importante</p>
                <p className="text-xs text-amber-900 leading-snug mt-0.5">{client.notes}</p>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Servicio a realizar */}
        <div className="space-y-3">
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold flex items-center gap-1.5">
            <Sparkles className="h-3 w-3 text-primary" />
            Sesión de hoy
          </p>

          <div className="flex items-start gap-3">
            <div
              className="mt-0.5 h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: `${color}25` }}
            >
              <User className="h-4 w-4" style={{ color }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">{svc.name}</p>
              {svc.description && (
                <p className="text-xs text-muted-foreground leading-snug mt-0.5">{svc.description}</p>
              )}
              <Badge variant="outline" className="mt-1.5 text-[10px] capitalize">{svc.category}</Badge>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg bg-secondary/40 px-2.5 py-2">
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium">
                <Calendar className="h-3 w-3" />
                Fecha
              </div>
              <p className="text-xs font-semibold capitalize mt-0.5">
                {formatDate(booking.startsAt, { weekday: 'short', day: '2-digit', month: 'short' })}
              </p>
            </div>
            <div className="rounded-lg bg-secondary/40 px-2.5 py-2">
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium">
                <Clock className="h-3 w-3" />
                Hora
              </div>
              <p className="text-xs font-semibold mt-0.5">{formatTime(booking.startsAt)}</p>
              <p className="text-[10px] text-muted-foreground">{durationMin} min</p>
            </div>
            <div className="rounded-lg bg-secondary/40 px-2.5 py-2">
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium">
                <DollarSign className="h-3 w-3" />
                Precio
              </div>
              <p className="text-xs font-semibold mt-0.5">{formatCurrency(svc.price)}</p>
            </div>
          </div>

          {booking.notes && (
            <div className="rounded-xl bg-secondary/40 px-3 py-2.5">
              <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide mb-0.5">Notas de la cita</p>
              <p className="text-sm">{booking.notes}</p>
            </div>
          )}
        </div>

        <Separator />

        {/* Acciones */}
        <div className="space-y-2">
          {confirmed ? (
            <div className="flex items-center justify-center gap-2 rounded-lg bg-success/10 py-2.5 text-success text-sm font-semibold">
              <CheckCircle2 className="h-4 w-4" />
              Confirmada ✓
            </div>
          ) : (
            <Button
              className="w-full gap-2"
              onClick={() => setConfirmed(true)}
            >
              <CheckCircle2 className="h-4 w-4" />
              Confirmar asistencia
            </Button>
          )}

          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={() => setRescheduleMsg(true)}
          >
            <RefreshCcw className="h-4 w-4" />
            Reagendar
          </Button>

          {rescheduleMsg && (
            <p className="text-xs text-center text-muted-foreground bg-secondary/40 rounded-lg px-3 py-2">
              Esta función estará disponible en la versión completa
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
