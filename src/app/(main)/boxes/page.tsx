import {
  DoorOpen,
  DoorClosed,
  Wrench,
  Sparkles,
  AlertCircle,
  Calendar as CalendarIcon,
  DollarSign,
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatCard } from '@/shared/components/StatCard'
import {
  BOXES,
  BOX_RENTALS,
  DAY_LABELS,
  TENANTS,
  getBox,
  getRental,
  getTenant,
  seedRentalPayments,
} from '@/shared/mock'
import { cn, formatCurrency, formatDate, initials } from '@/lib/utils'

const STATUS_META = {
  active: { label: 'Ocupado', icon: DoorClosed, color: 'success' as const },
  available: { label: 'Disponible', icon: DoorOpen, color: 'soft' as const },
  maintenance: { label: 'En mantención', icon: Wrench, color: 'warning' as const },
}

const PAYMENT_META = {
  paid: { label: 'Pagado', variant: 'success' as const },
  pending: { label: 'Pendiente', variant: 'warning' as const },
  overdue: { label: 'Vencido', variant: 'destructive' as const },
}

export default function BoxesPage() {
  const now = new Date()
  const payments = seedRentalPayments(now)
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const currentMonthPayments = payments.filter((p) => p.month === currentMonth)

  const totalMonthlyRevenue = BOX_RENTALS.filter((r) => r.active).reduce(
    (s, r) => s + r.monthlyRate,
    0
  )
  const paidThisMonth = currentMonthPayments
    .filter((p) => p.status === 'paid')
    .reduce((s, p) => s + p.amount, 0)
  const pendingThisMonth = currentMonthPayments
    .filter((p) => p.status !== 'paid')
    .reduce((s, p) => s + p.amount, 0)
  const occupiedBoxes = BOXES.filter((b) => b.status === 'active').length

  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <StatCard
          icon={DollarSign}
          label="Ingreso mensual"
          value={formatCurrency(totalMonthlyRevenue)}
          hint={`${occupiedBoxes} de ${BOXES.length} boxes ocupados`}
          variant="gradient"
        />
        <StatCard
          icon={Sparkles}
          label="Cobrado este mes"
          value={formatCurrency(paidThisMonth)}
          hint={`${currentMonthPayments.filter((p) => p.status === 'paid').length} pagos al día`}
        />
        <StatCard
          icon={AlertCircle}
          label="Por cobrar"
          value={formatCurrency(pendingThisMonth)}
          hint={`${currentMonthPayments.filter((p) => p.status !== 'paid').length} arrendatarias pendientes`}
        />
        <StatCard
          icon={DoorOpen}
          label="Disponibles"
          value={String(BOXES.filter((b) => b.status === 'available').length)}
          hint="Para nuevo arriendo"
        />
      </div>

      {/* Grid de boxes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Estado de los boxes</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Vista física del centro · {BOXES.length} espacios
            </p>
          </div>
          <Button variant="outline" size="sm">
            Configurar boxes
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {BOXES.map((box) => {
              const rental = BOX_RENTALS.find((r) => r.boxId === box.id && r.active)
              const tenant = rental ? getTenant(rental.tenantId) : null
              const meta = STATUS_META[box.status]
              const Icon = meta.icon
              return (
                <div
                  key={box.id}
                  className={cn(
                    'rounded-2xl p-4 border-2 transition-all hover:shadow-lift',
                    box.status === 'active' && 'border-primary/30 bg-gradient-soft',
                    box.status === 'available' && 'border-dashed border-border/80 bg-card',
                    box.status === 'maintenance' && 'border-warning/30 bg-warning/5'
                  )}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={cn(
                        'h-9 w-9 rounded-xl flex items-center justify-center',
                        box.status === 'active' && 'bg-primary text-primary-foreground',
                        box.status === 'available' && 'bg-secondary text-muted-foreground',
                        box.status === 'maintenance' && 'bg-warning/20 text-warning'
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <Badge variant={meta.color}>{meta.label}</Badge>
                  </div>
                  <p className="font-display text-base font-bold">{box.name}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">
                    {box.description}
                  </p>
                  {tenant && (
                    <div className="mt-3 pt-3 border-t border-border/60 flex items-center gap-2">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback
                          className="text-[10px]"
                          style={{ background: `hsl(${tenant.avatarHue} 70% 70%)` }}
                        >
                          {initials(tenant.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold truncate leading-tight">
                          {tenant.name.split(' ')[0]} {tenant.name.split(' ')[1]?.[0]}.
                        </p>
                        <p className="text-[10px] text-muted-foreground truncate">{tenant.specialty}</p>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Arrendatarias */}
      <Card>
        <CardHeader>
          <CardTitle>Arrendatarias activas</CardTitle>
          <p className="text-xs text-muted-foreground">
            Profesionales independientes que rentan boxes
          </p>
        </CardHeader>
        <CardContent>
          <div className="hidden md:grid grid-cols-12 gap-3 px-1 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground border-b border-border/60">
            <div className="col-span-4">Arrendataria</div>
            <div className="col-span-2">Box</div>
            <div className="col-span-3">Horarios</div>
            <div className="col-span-2">Tarifa</div>
            <div className="col-span-1 text-right">Estado</div>
          </div>
          <div className="divide-y divide-border/60">
            {BOX_RENTALS.filter((r) => r.active).map((rental) => {
              const tenant = getTenant(rental.tenantId)!
              const box = getBox(rental.boxId)!
              const monthPayment = currentMonthPayments.find((p) => p.rentalId === rental.id)
              const status = monthPayment?.status ?? 'pending'
              return (
                <div
                  key={rental.id}
                  className="grid grid-cols-2 md:grid-cols-12 gap-3 py-4 items-center"
                >
                  <div className="col-span-2 md:col-span-4 flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback style={{ background: `hsl(${tenant.avatarHue} 70% 70%)` }}>
                        {initials(tenant.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{tenant.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{tenant.specialty}</p>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium">{box.name}</p>
                  </div>
                  <div className="md:col-span-3 flex flex-wrap items-center gap-1">
                    {rental.daysOfWeek.map((d) => (
                      <Badge key={d} variant="outline" className="text-[10px] px-1.5">
                        {DAY_LABELS[d]}
                      </Badge>
                    ))}
                    <span className="text-xs text-muted-foreground ml-1">
                      {rental.startTime}–{rental.endTime}
                    </span>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm font-semibold">{formatCurrency(rental.monthlyRate)}</p>
                    <p className="text-xs text-muted-foreground">por mes</p>
                  </div>
                  <div className="md:col-span-1 flex justify-end">
                    <Badge variant={PAYMENT_META[status].variant}>{PAYMENT_META[status].label}</Badge>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Cobros del mes */}
      <Card>
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
          <div>
            <CardTitle>Cobros · {now.toLocaleDateString('es-US', { month: 'long', year: 'numeric' })}</CardTitle>
            <p className="text-xs text-muted-foreground mt-1 capitalize">
              Estado de cobranza del mes actual
            </p>
          </div>
          <CalendarIcon className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {currentMonthPayments.map((p) => {
              const rental = getRental(p.rentalId)!
              const tenant = getTenant(rental.tenantId)!
              const box = getBox(rental.boxId)!
              const meta = PAYMENT_META[p.status]
              return (
                <div
                  key={p.id}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-4 py-3 border',
                    p.status === 'paid' && 'bg-success/5 border-success/20',
                    p.status === 'pending' && 'bg-warning/5 border-warning/30',
                    p.status === 'overdue' && 'bg-destructive/5 border-destructive/30'
                  )}
                >
                  <Avatar className="h-9 w-9">
                    <AvatarFallback style={{ background: `hsl(${tenant.avatarHue} 70% 70%)` }}>
                      {initials(tenant.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">
                      {tenant.name} <span className="text-muted-foreground font-normal">· {box.name}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {p.status === 'paid' && p.paidAt
                        ? `Pagado el ${formatDate(p.paidAt)}`
                        : `Vence el ${formatDate(p.dueDate)}`}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold">{formatCurrency(p.amount)}</p>
                    <Badge variant={meta.variant} className="mt-0.5">
                      {meta.label}
                    </Badge>
                  </div>
                  {p.status !== 'paid' && (
                    <Button size="sm" className="shrink-0">
                      Cobrar
                    </Button>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
