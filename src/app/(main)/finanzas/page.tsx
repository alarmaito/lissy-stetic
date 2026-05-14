import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Receipt,
  Download,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatCard } from '@/shared/components/StatCard'
import { CategoryBarChart } from '@/features/finanzas/components/CategoryBarChart'
import { CATEGORY_COLORS, CATEGORY_LABELS, seedTransactions } from '@/shared/mock'
import { cn, formatCurrency, formatDate } from '@/lib/utils'

export default function FinanzasPage() {
  const now = new Date()
  const transactions = seedTransactions(now)

  // Período actual: últimos 30 días
  const thirtyDaysAgo = new Date(now)
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const monthTx = transactions.filter((t) => new Date(t.date) >= thirtyDaysAgo)
  const totalIncome = monthTx.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const totalExpense = monthTx.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const netProfit = totalIncome - totalExpense

  // Ticket promedio: ingresos servicios propios / nº de transacciones de servicios propios
  const serviceTx = monthTx.filter(
    (t) => t.type === 'income' && ['cabello', 'masaje', 'producto'].includes(t.category)
  )
  const avgTicket = serviceTx.length > 0 ? serviceTx.reduce((s, t) => s + t.amount, 0) / serviceTx.length : 0

  // Datos chart (últimos 6 meses por categoría)
  const monthsData: { month: string; cabello: number; masaje: number; arriendo: number; producto: number }[] = []
  for (let i = 5; i >= 0; i--) {
    const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)
    const inMonth = transactions.filter((t) => {
      const d = new Date(t.date)
      return d >= monthStart && d < monthEnd && t.type === 'income'
    })
    monthsData.push({
      month: monthStart.toLocaleDateString('es-US', { month: 'short' }),
      cabello: inMonth.filter((t) => t.category === 'cabello').reduce((s, t) => s + t.amount, 0),
      masaje: inMonth.filter((t) => t.category === 'masaje').reduce((s, t) => s + t.amount, 0),
      arriendo: inMonth.filter((t) => t.category === 'arriendo').reduce((s, t) => s + t.amount, 0),
      producto: inMonth.filter((t) => t.category === 'producto').reduce((s, t) => s + t.amount, 0),
    })
  }

  const recentTx = [...monthTx].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 14)

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Período: <span className="font-semibold text-foreground">últimos 30 días</span>
        </p>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Exportar
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <StatCard
          icon={DollarSign}
          label="Ingreso bruto"
          value={formatCurrency(totalIncome)}
          hint="Servicios + arriendos + productos"
          trend={{ value: '↑ 18% vs mes anterior', positive: true }}
          variant="gradient"
        />
        <StatCard
          icon={TrendingUp}
          label="Utilidad neta"
          value={formatCurrency(netProfit)}
          hint={`Margen ${((netProfit / totalIncome) * 100).toFixed(0)}%`}
          trend={{ value: '↑ healthy', positive: true }}
        />
        <StatCard
          icon={Receipt}
          label="Gastos del mes"
          value={formatCurrency(totalExpense)}
          hint="Insumos, servicios, mantención"
        />
        <StatCard
          icon={CreditCard}
          label="Ticket promedio"
          value={formatCurrency(avgTicket)}
          hint={`${serviceTx.length} servicios atendidos`}
        />
      </div>

      {/* Chart + breakdown */}
      <div className="grid lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle>Ingresos por categoría · 6 meses</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">Stacked por tipo de servicio</p>
            </div>
            <Badge variant="soft" className="gap-1">
              <ArrowUpRight className="h-3 w-3" />
              Crecimiento
            </Badge>
          </CardHeader>
          <CardContent>
            <CategoryBarChart data={monthsData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribución del mes</CardTitle>
            <p className="text-xs text-muted-foreground">Por categoría de ingreso</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {(['cabello', 'masaje', 'arriendo', 'producto'] as const).map((cat) => {
              const value = monthTx
                .filter((t) => t.type === 'income' && t.category === cat)
                .reduce((s, t) => s + t.amount, 0)
              const pct = totalIncome > 0 ? (value / totalIncome) * 100 : 0
              return (
                <div key={cat}>
                  <div className="flex items-center justify-between mb-1.5 text-sm">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ background: CATEGORY_COLORS[cat] }}
                      />
                      <span className="font-medium">{CATEGORY_LABELS[cat]}</span>
                    </div>
                    <span className="font-semibold text-foreground">{formatCurrency(value)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, background: CATEGORY_COLORS[cat] }}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">{pct.toFixed(0)}% del total</p>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* Flujo de caja */}
      <Card>
        <CardHeader>
          <CardTitle>Flujo de caja reciente</CardTitle>
          <p className="text-xs text-muted-foreground">Últimos movimientos del período actual</p>
        </CardHeader>
        <CardContent>
          <div className="hidden md:grid grid-cols-12 gap-3 px-1 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground border-b border-border/60">
            <div className="col-span-2">Fecha</div>
            <div className="col-span-6">Concepto</div>
            <div className="col-span-2">Categoría</div>
            <div className="col-span-2 text-right">Monto</div>
          </div>
          <div className="divide-y divide-border/60">
            {recentTx.map((t) => (
              <div
                key={t.id}
                className="grid grid-cols-12 gap-3 py-3 items-center text-sm"
              >
                <div className="col-span-3 md:col-span-2 text-xs text-muted-foreground">
                  {formatDate(t.date)}
                </div>
                <div className="col-span-9 md:col-span-6 flex items-center gap-2.5 min-w-0">
                  <div
                    className={cn(
                      'h-7 w-7 rounded-lg shrink-0 flex items-center justify-center',
                      t.type === 'income' ? 'bg-success/15 text-success' : 'bg-destructive/15 text-destructive'
                    )}
                  >
                    {t.type === 'income' ? (
                      <ArrowDownRight className="h-3.5 w-3.5" />
                    ) : (
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    )}
                  </div>
                  <p className="font-medium truncate">{t.description}</p>
                </div>
                <div className="col-span-6 md:col-span-2">
                  <Badge variant="soft" className="text-[10px]">
                    {CATEGORY_LABELS[t.category]}
                  </Badge>
                </div>
                <div
                  className={cn(
                    'col-span-6 md:col-span-2 text-right font-semibold',
                    t.type === 'income' ? 'text-success' : 'text-destructive'
                  )}
                >
                  {t.type === 'income' ? '+' : '−'} {formatCurrency(t.amount)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
