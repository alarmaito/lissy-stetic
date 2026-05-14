'use client'

import { useState } from 'react'
import { Calendar, Clock, DollarSign, User, CheckCircle2, RefreshCcw } from 'lucide-react'
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
import { getClient, getService, SERVICE_COLORS } from '@/shared/mock'
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

  if (!booking) return null

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
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <span
              className="h-3 w-3 rounded-full shrink-0"
              style={{ background: color }}
            />
            Detalle de la cita
          </DialogTitle>
        </DialogHeader>

        {/* Cliente */}
        <div className="flex items-center gap-3">
          <Avatar className="h-11 w-11 shrink-0">
            <AvatarFallback style={{ background: `hsl(${client.avatarHue} 70% 65%)` }}>
              {initials(client.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-sm">{client.name}</p>
            <p className="text-xs text-muted-foreground">{client.phone}</p>
          </div>
          <div className="ml-auto">
            <Badge variant={STATUS_VARIANT[booking.status]}>
              {STATUS_LABELS[booking.status]}
            </Badge>
          </div>
        </div>

        <Separator />

        {/* Detalles */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div
              className="mt-0.5 h-7 w-7 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: `${color}20` }}
            >
              <User className="h-3.5 w-3.5" style={{ color }} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Servicio</p>
              <p className="text-sm font-semibold">{svc.name}</p>
              <Badge variant="outline" className="mt-1 text-[10px] capitalize">{svc.category}</Badge>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-0.5 h-7 w-7 rounded-lg flex items-center justify-center shrink-0 bg-secondary/60">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Fecha</p>
              <p className="text-sm font-semibold capitalize">
                {formatDate(booking.startsAt, { weekday: 'long', day: '2-digit', month: 'long' })}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 h-7 w-7 rounded-lg flex items-center justify-center shrink-0 bg-secondary/60">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Hora</p>
                <p className="text-sm font-semibold">{formatTime(booking.startsAt)}</p>
                <p className="text-xs text-muted-foreground">{durationMin} min</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 h-7 w-7 rounded-lg flex items-center justify-center shrink-0 bg-secondary/60">
                <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Precio</p>
                <p className="text-sm font-semibold">{formatCurrency(svc.price)}</p>
              </div>
            </div>
          </div>

          {booking.notes && (
            <div className="rounded-xl bg-secondary/40 px-3 py-2.5">
              <p className="text-xs text-muted-foreground font-medium mb-0.5">Notas</p>
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
