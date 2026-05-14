'use client'

import { useMemo } from 'react'
import { Cake, Send, Gift } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useClientsStore } from '@/features/clientas/store/clientsStore'
import { initials } from '@/lib/utils'

function parseBirthday(bd: string, year: number): Date {
  const [m, d] = bd.split('-').map(Number)
  return new Date(year, m - 1, d)
}

const MONTH_LABELS = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
]

function formatBdShort(bd: string): string {
  const [m, d] = bd.split('-').map(Number)
  return `${d} ${MONTH_LABELS[m - 1].slice(0, 3)}`
}

function buildBirthdayMessage(name: string): string {
  return `¡Feliz cumpleaños ${name.split(' ')[0]}! 🎉🌸 De parte de todo el equipo de Lissy Stetic te deseamos un día hermoso. Como regalo especial, tienes un 20% de descuento en cualquier tratamiento durante todo el mes de tu cumpleaños. ¡Te esperamos para mimarte! 💕`
}

export function BirthdayWidget() {
  const clients = useClientsStore((s) => s.clients)

  const upcoming = useMemo(() => {
    const now = new Date()
    const todayYM = now.getFullYear() * 12 + now.getMonth()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    return clients
      .filter((c) => c.birthday != null)
      .map((c) => {
        const bd = parseBirthday(c.birthday!, now.getFullYear())
        const effective =
          bd < todayStart
            ? new Date(now.getFullYear() + 1, bd.getMonth(), bd.getDate())
            : bd
        return {
          client: c,
          date: effective,
          month: effective.getMonth(),
          day: effective.getDate(),
          monthsAhead: effective.getFullYear() * 12 + effective.getMonth() - todayYM,
        }
      })
      .filter((x) => x.monthsAhead <= 1)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 6)
  }, [clients])

  function sendGreeting(name: string, phone: string) {
    const cleaned = phone.replace(/\D/g, '')
    const msg = encodeURIComponent(buildBirthdayMessage(name))
    window.open(`https://wa.me/${cleaned}?text=${msg}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <Card className="bg-gradient-to-br from-amber-50 via-rose-50 to-pink-50 border-amber-200/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cake className="h-4 w-4 text-amber-600" />
          Cumpleaños del mes
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Envía un saludo con descuento de regalo 🎁
        </p>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {upcoming.length === 0 && (
          <p className="text-xs text-muted-foreground py-3">
            Sin cumpleaños próximos en los siguientes 2 meses.
          </p>
        )}
        {upcoming.map(({ client, month }) => {
          const now = new Date()
          const isThisMonth = month === now.getMonth()
          return (
            <div
              key={client.id}
              className="flex items-center gap-3 rounded-xl bg-card/80 border border-border/60 p-2.5"
            >
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarFallback style={{ background: `hsl(${client.avatarHue} 70% 65%)` }}>
                  {initials(client.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{client.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Badge
                    variant={isThisMonth ? 'warning' : 'soft'}
                    className="text-[10px] gap-1"
                  >
                    <Gift className="h-2.5 w-2.5" />
                    {formatBdShort(client.birthday!)}
                  </Badge>
                  {isThisMonth && (
                    <span className="text-[10px] text-amber-700 font-medium">¡Este mes!</span>
                  )}
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 h-8 text-xs shrink-0"
                onClick={() => sendGreeting(client.name, client.phone)}
              >
                <Send className="h-3 w-3" />
                Saludar
              </Button>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
