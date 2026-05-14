'use client'

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

interface DataPoint {
  month: string
  servicios: number
  arriendos: number
}

interface Props {
  data: DataPoint[]
}

export function RevenueChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="gradServicios" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(340 78% 62%)" stopOpacity={0.55} />
            <stop offset="100%" stopColor="hsl(340 78% 62%)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gradArriendos" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(280 60% 70%)" stopOpacity={0.5} />
            <stop offset="100%" stopColor="hsl(280 60% 70%)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(340 25% 92%)" vertical={false} />
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fill: 'hsl(340 12% 45%)' }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fill: 'hsl(340 12% 45%)' }}
          tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`}
        />
        <Tooltip
          contentStyle={{
            background: 'white',
            border: '1px solid hsl(340 25% 92%)',
            borderRadius: 12,
            fontSize: 12,
            boxShadow: '0 8px 24px -8px hsl(340 30% 60% / 0.2)',
          }}
          formatter={(value: number, name: string) => [
            new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value),
            name === 'servicios' ? 'Servicios propios' : 'Arriendo boxes',
          ]}
        />
        <Area
          type="monotone"
          dataKey="servicios"
          stroke="hsl(340 78% 55%)"
          strokeWidth={2.5}
          fill="url(#gradServicios)"
        />
        <Area
          type="monotone"
          dataKey="arriendos"
          stroke="hsl(280 60% 60%)"
          strokeWidth={2.5}
          fill="url(#gradArriendos)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
