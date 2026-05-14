import { CalendarCheck, DollarSign, Sparkles, Users, ArrowUpRight, Clock } from 'lucide-react'
import { BirthdayWidget } from '@/features/dashboard/components/BirthdayWidget'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { StatCard } from '@/shared/components/StatCard'
import { RevenueChart } from '@/features/dashboard/components/RevenueChart'
import { TriggerCard } from '@/features/dashboard/components/TriggerCard'
import {
  CLIENTS,
  SERVICE_COLORS,
  getClient,
  getService,
  seedBookings,
  seedTransactions,
  seedTriggers,
} from '@/shared/mock'
import { formatCurrency, formatTime, initials } from '@/lib/utils'

function getMonthLabel(date: Date): string {
  return date.toLocaleDateString('es-US', { month: 'short' })
}

export default function DashboardPage() {
  const now = new Date()
  const bookings = seedBookings(now)
  const transactions = seedTransactions(now)
  const triggers = seedTriggers(now)

  const today = new Date(now)
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const todayBookings = bookings
    .filter((b) => {
      const d = new Date(b.startsAt)
      return d >= today && d < tomorrow && (b.status === 'confirmed' || b.status === 'pending')
    })
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())

  // Ingresos del mes actual (últimos 30 días)
  const thirtyDaysAgo = new Date(now)
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const monthTransactions = transactions.filter((t) => new Date(t.date) >= thirtyDaysAgo)
  const monthIncomeServices = monthTransactions
    .filter((t) => t.type === 'income' && ['cabello', 'masaje', 'producto'].includes(t.category))
    .reduce((sum, t) => sum + t.amount, 0)
  const monthIncomeRentals = monthTransactions
    .filter((t) => t.type === 'income' && t.category === 'arriendo')
    .reduce((sum, t) => sum + t.amount, 0)
  const totalIncome = monthIncomeServices + monthIncomeRentals

  // Datos del gráfico (últimos 6 meses)
  const chartData: { month: string; servicios: number; arriendos: number }[] = []
  for (let i = 5; i >= 0; i--) {
    const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)
    const inMonth = transactions.filter((t) => {
      const d = new Date(t.date)
      return d >= monthStart && d < monthEnd && t.type === 'income'
    })
    const servicios = inMonth
      .filter((t) => t.category !== 'arriendo')
      .reduce((s, t) => s + t.amount, 0)
    const arriendos = inMonth
      .filter((t) => t.category === 'arriendo')
      .reduce((s, t) => s + t.amount, 0)
    chartData.push({ month: getMonthLabel(monthStart), servicios, arriendos })
  }

  const activeClients = CLIENTS.length
  const pendingTriggers = triggers.filter((t) => t.status === 'pending')

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <StatCard
          icon={DollarSign}
          label="Ingresos mes"
          value={formatCurrency(totalIncome)}
          hint={`${formatCurrency(monthIncomeServices)} servicios · ${formatCurrency(monthIncomeRentals)} arriendos`}
          trend={{ value: '↑ 18% vs. mes anterior', positive: true }}
          variant="gradient"
        />
        <StatCard
          icon={Users}
          label="Clientas activas"
          value={String(activeClients)}
          hint="En los últimos 90 días"
          trend={{ value: '↑ 6 nuevas este mes', positive: true }}
        />
        <StatCard
          icon={CalendarCheck}
          label="Citas hoy"
          value={String(todayBookings.length)}
          hint={todayBookings.length > 0 ? `Primera ${formatTime(todayBookings[0].startsAt)}` : 'Día libre'}
        />
        <StatCard
          icon={Sparkles}
          label="Alertas IA"
          value={String(pendingTriggers.length)}
          hint="Oportunidades detectadas hoy"
          trend={{ value: 'Revisar ahora', positive: true }}
        />
      </div>

      {/* Gráfico + Alertas IA */}
      <div className="grid lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle>Ingresos · últimos 6 meses</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Servicios propios <span className="inline-block h-2 w-2 rounded-full bg-primary ml-1 align-middle" />
                {'  '}vs Arriendo boxes <span className="inline-block h-2 w-2 rounded-full bg-[hsl(280_60%_60%)] ml-1 align-middle" />
              </p>
            </div>
            <Badge variant="soft" className="gap-1">
              <ArrowUpRight className="h-3 w-3" />
              Tendencia ↑
            </Badge>
          </CardHeader>
          <CardContent>
            <RevenueChart data={chartData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Alertas IA
              </CardTitle>
              <Badge variant="soft">{pendingTriggers.length} pendientes</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Oportunidades automáticas de venta y reactivación
            </p>
          </CardHeader>
          <CardContent className="space-y-3 max-h-[420px] overflow-y-auto scrollbar-thin pr-1">
            {pendingTriggers.slice(0, 4).map((t) => {
              const client = getClient(t.clientId)!
              return <TriggerCard key={t.id} trigger={t} client={client} />
            })}
          </CardContent>
        </Card>
      </div>

      {/* Próximas citas + Mini insights */}
      <div className="grid lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Próximas citas de hoy</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">Servicios atendidos por Lissy</p>
            </div>
            <Badge variant="outline">{todayBookings.length} citas</Badge>
          </CardHeader>
          <CardContent className="divide-y divide-border/60 -mt-2">
            {todayBookings.length === 0 && (
              <p className="text-sm text-muted-foreground py-6 text-center">
                No hay citas agendadas para hoy 🌸
              </p>
            )}
            {todayBookings.map((b) => {
              const client = getClient(b.clientId)!
              const service = getService(b.serviceId)!
              const color = SERVICE_COLORS[service.id]
              return (
                <div key={b.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="flex flex-col items-center w-12 shrink-0">
                    <p className="text-[10px] font-medium text-muted-foreground uppercase">
                      {formatTime(b.startsAt).split(' ')[1]}
                    </p>
                    <p className="font-display text-lg font-bold leading-tight">
                      {formatTime(b.startsAt).split(' ')[0]}
                    </p>
                  </div>
                  <div className="h-9 w-1 rounded-full shrink-0" style={{ background: color }} />
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarFallback style={{ background: `hsl(${client.avatarHue} 70% 70%)` }}>
                      {initials(client.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold truncate">{client.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {service.name} · {service.duration} min
                      {b.notes && ` · ${b.notes}`}
                    </p>
                  </div>
                  <Badge variant={b.status === 'confirmed' ? 'success' : 'warning'} className="shrink-0">
                    {b.status === 'confirmed' ? 'Confirmada' : 'Pendiente'}
                  </Badge>
                </div>
              )
            })}
          </CardContent>
        </Card>

        <div className="space-y-5">
          <Card className="bg-gradient-soft border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Insights del mes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 -mt-2">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">
                  Servicio más solicitado
                </p>
                <p className="font-display text-lg font-bold text-foreground mt-1">Masaje reductivo</p>
                <p className="text-xs text-muted-foreground">12 sesiones · 6 clientas con paquete activo</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">
                  Box mejor pagado
                </p>
                <p className="font-display text-lg font-bold text-foreground mt-1">
                  Box 1 · Manicure
                </p>
                <p className="text-xs text-muted-foreground">$750/mes · pagado al día</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">
                  Cobros pendientes
                </p>
                <p className="font-display text-lg font-bold text-destructive mt-1">$1.120</p>
                <p className="text-xs text-muted-foreground">2 boxes con pago vencido o pendiente</p>
              </div>
            </CardContent>
          </Card>
          <BirthdayWidget />
        </div>
      </div>
    </div>
  )
}
