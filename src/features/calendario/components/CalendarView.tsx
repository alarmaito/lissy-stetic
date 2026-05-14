'use client'

import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  type Booking,
  type Client,
  type Service,
  SERVICE_COLORS,
  SERVICES,
} from '@/shared/mock'
import { getClient, getService } from '@/shared/mock'
import { cn, formatTime } from '@/lib/utils'
import { BookingDetailDialog } from './BookingDetailDialog'

interface Props {
  bookings: Booking[]
  clients: Client[]
  services: Service[]
}

const HOURS = Array.from({ length: 11 }, (_, i) => i + 9) // 9 AM a 7 PM
const WEEK_DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

function getStartOfWeek(d: Date): Date {
  const date = new Date(d)
  const day = date.getDay()
  const diff = day === 0 ? -6 : 1 - day
  date.setDate(date.getDate() + diff)
  date.setHours(0, 0, 0, 0)
  return date
}

function addDays(d: Date, days: number): Date {
  const r = new Date(d)
  r.setDate(r.getDate() + days)
  return r
}

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function CalendarView({ bookings }: Props) {
  const [weekStart, setWeekStart] = useState(getStartOfWeek(new Date()))
  const [view, setView] = useState<'week' | 'month'>('week')
  const [serviceFilter, setServiceFilter] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

  const filteredBookings = useMemo(
    () =>
      serviceFilter ? bookings.filter((b) => b.serviceId === serviceFilter) : bookings,
    [bookings, serviceFilter]
  )

  const monthLabel = weekStart.toLocaleDateString('es-US', { month: 'long', year: 'numeric' })

  return (
    <div className="space-y-4">
      {/* Header controls */}
      <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setWeekStart(addDays(weekStart, view === 'week' ? -7 : -30))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setWeekStart(getStartOfWeek(new Date()))}>
              Hoy
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setWeekStart(addDays(weekStart, view === 'week' ? 7 : 30))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <h2 className="font-display text-lg font-bold capitalize">{monthLabel}</h2>
        </div>

        <div className="flex items-center gap-2">
          <Tabs value={view} onValueChange={(v) => setView(v as 'week' | 'month')}>
            <TabsList>
              <TabsTrigger value="week">Semana</TabsTrigger>
              <TabsTrigger value="month">Mes</TabsTrigger>
            </TabsList>
          </Tabs>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nueva cita
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agendar nueva cita</DialogTitle>
                <DialogDescription>
                  Completa los datos de la cita. Esta es una vista demo.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <Input placeholder="Buscar clienta..." />
                <select className="w-full h-10 rounded-lg border border-input bg-card px-3 text-sm shadow-soft">
                  <option>Seleccionar servicio</option>
                  {SERVICES.map((s) => (
                    <option key={s.id}>{s.name}</option>
                  ))}
                </select>
                <div className="grid grid-cols-2 gap-2">
                  <Input type="date" />
                  <Input type="time" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => setDialogOpen(false)}>Confirmar cita</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin pb-1">
        <Filter className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <button
          onClick={() => setServiceFilter(null)}
          className={cn(
            'shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition-all border',
            !serviceFilter
              ? 'bg-gradient-rose text-primary-foreground border-transparent shadow-glow'
              : 'border-border/60 text-muted-foreground hover:bg-secondary'
          )}
        >
          Todos
        </button>
        {SERVICES.map((s) => (
          <button
            key={s.id}
            onClick={() => setServiceFilter(s.id)}
            className={cn(
              'shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition-all border flex items-center gap-1.5',
              serviceFilter === s.id
                ? 'bg-secondary text-foreground border-primary/60'
                : 'border-border/60 text-muted-foreground hover:bg-secondary'
            )}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: SERVICE_COLORS[s.id] }}
            />
            {s.name}
          </button>
        ))}
      </div>

      {view === 'week' ? (
        <WeekGrid
          weekStart={weekStart}
          bookings={filteredBookings}
          onSelectBooking={setSelectedBooking}
        />
      ) : (
        <MonthGrid
          weekStart={weekStart}
          bookings={filteredBookings}
          onSelectBooking={setSelectedBooking}
        />
      )}

      <BookingDetailDialog
        booking={selectedBooking}
        open={selectedBooking !== null}
        onOpenChange={(o) => { if (!o) setSelectedBooking(null) }}
      />
    </div>
  )
}

interface WeekGridProps {
  weekStart: Date
  bookings: Booking[]
  onSelectBooking: (b: Booking) => void
}

function WeekGrid({ weekStart, bookings, onSelectBooking }: WeekGridProps) {
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
  const today = new Date()

  return (
    <div className="rounded-2xl border border-border/70 bg-card shadow-soft overflow-x-auto">
      <div className="min-w-[820px]">
        {/* Header días */}
        <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-border/60 bg-secondary/30">
          <div />
          {days.map((d, i) => {
            const isToday = sameDay(d, today)
            return (
              <div
                key={i}
                className={cn(
                  'px-2 py-3 text-center border-l border-border/40',
                  isToday && 'bg-primary/10'
                )}
              >
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">
                  {WEEK_DAYS[i]}
                </p>
                <p
                  className={cn(
                    'font-display text-lg font-bold mt-0.5',
                    isToday && 'text-primary'
                  )}
                >
                  {d.getDate()}
                </p>
              </div>
            )
          })}
        </div>

        {/* Grid horas */}
        <div className="grid grid-cols-[60px_repeat(7,1fr)]">
          {HOURS.map((h) => (
            <Hour key={h} h={h} days={days} bookings={bookings} onSelectBooking={onSelectBooking} />
          ))}
        </div>
      </div>
    </div>
  )
}

interface HourProps {
  h: number
  days: Date[]
  bookings: Booking[]
  onSelectBooking: (b: Booking) => void
}

function Hour({ h, days, bookings, onSelectBooking }: HourProps) {
  return (
    <>
      <div className="border-t border-border/40 px-2 py-2 text-[10px] text-muted-foreground font-medium">
        {h % 12 === 0 ? 12 : h % 12}:00 {h < 12 ? 'AM' : 'PM'}
      </div>
      {days.map((d, i) => {
        const slotStart = new Date(d)
        slotStart.setHours(h, 0, 0, 0)
        const slotEnd = new Date(d)
        slotEnd.setHours(h + 1, 0, 0, 0)
        const slotBookings = bookings.filter((b) => {
          const bd = new Date(b.startsAt)
          return bd >= slotStart && bd < slotEnd
        })
        return (
          <div
            key={i}
            className="border-l border-t border-border/40 px-1.5 py-1 min-h-[64px] space-y-1 group hover:bg-secondary/30 cursor-pointer transition-colors"
          >
            {slotBookings.map((b) => {
              const svc = getService(b.serviceId)!
              const client = getClient(b.clientId)!
              return (
                <div
                  key={b.id}
                  className="rounded-lg px-2 py-1.5 text-[11px] font-medium border-l-[3px] text-foreground shadow-soft cursor-pointer hover:opacity-80 transition-opacity"
                  style={{
                    background: `${SERVICE_COLORS[svc.id]}20`,
                    borderLeftColor: SERVICE_COLORS[svc.id],
                  }}
                  onClick={(e) => { e.stopPropagation(); onSelectBooking(b) }}
                >
                  <p className="font-semibold truncate leading-tight">{client.name.split(' ')[0]}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{svc.name}</p>
                  <p className="text-[10px] text-muted-foreground">{formatTime(b.startsAt)}</p>
                </div>
              )
            })}
          </div>
        )
      })}
    </>
  )
}

interface MonthGridProps {
  weekStart: Date
  bookings: Booking[]
  onSelectBooking: (b: Booking) => void
}

function MonthGrid({ weekStart, bookings, onSelectBooking }: MonthGridProps) {
  const monthStart = new Date(weekStart.getFullYear(), weekStart.getMonth(), 1)
  const startOffset = (monthStart.getDay() + 6) % 7
  const daysInMonth = new Date(weekStart.getFullYear(), weekStart.getMonth() + 1, 0).getDate()
  const totalCells = Math.ceil((daysInMonth + startOffset) / 7) * 7
  const today = new Date()

  return (
    <div className="rounded-2xl border border-border/70 bg-card shadow-soft overflow-hidden">
      <div className="grid grid-cols-7 border-b border-border/60 bg-secondary/30">
        {WEEK_DAYS.map((d) => (
          <div
            key={d}
            className="px-2 py-2 text-center text-[11px] uppercase tracking-wide font-semibold text-muted-foreground"
          >
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {Array.from({ length: totalCells }).map((_, i) => {
          const dayNum = i - startOffset + 1
          if (dayNum < 1 || dayNum > daysInMonth) {
            return (
              <div
                key={i}
                className="min-h-[88px] border-t border-l border-border/40 bg-secondary/10"
              />
            )
          }
          const day = new Date(weekStart.getFullYear(), weekStart.getMonth(), dayNum)
          const isToday = sameDay(day, today)
          const dayBookings = bookings.filter((b) => sameDay(new Date(b.startsAt), day))
          return (
            <div
              key={i}
              className={cn(
                'min-h-[88px] border-t border-l border-border/40 p-1.5 space-y-1 hover:bg-secondary/30 transition-colors cursor-pointer',
                isToday && 'bg-primary/5'
              )}
            >
              <p className={cn('text-xs font-semibold', isToday && 'text-primary')}>{dayNum}</p>
              {dayBookings.slice(0, 3).map((b) => {
                const svc = getService(b.serviceId)!
                return (
                  <div
                    key={b.id}
                    className="text-[9px] rounded px-1 py-0.5 truncate font-medium cursor-pointer hover:opacity-70 transition-opacity"
                    style={{
                      background: `${SERVICE_COLORS[svc.id]}25`,
                      color: SERVICE_COLORS[svc.id].replace(/65%|70%|72%|60%/, '40%'),
                    }}
                    onClick={(e) => { e.stopPropagation(); onSelectBooking(b) }}
                  >
                    {formatTime(b.startsAt).replace(/\s/g, '')} {svc.name.split(' ')[0]}
                  </div>
                )
              })}
              {dayBookings.length > 3 && (
                <Badge variant="soft" className="text-[9px] px-1.5 py-0">
                  +{dayBookings.length - 3} más
                </Badge>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
