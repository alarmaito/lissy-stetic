'use client'

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts'
import { CATEGORY_COLORS, CATEGORY_LABELS } from '@/shared/mock'

interface DataPoint {
  month: string
  cabello: number
  masaje: number
  arriendo: number
  producto: number
}

interface Props {
  data: DataPoint[]
}

const fmt = (v: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(v)

export function CategoryBarChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }} barCategoryGap={18}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(340 25% 92%)" vertical={false} />
        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(340 12% 45%)' }} />
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
          formatter={(v: number, n: string) => [fmt(v), CATEGORY_LABELS[n as keyof typeof CATEGORY_LABELS]]}
        />
        <Legend
          wrapperStyle={{ fontSize: 11, paddingTop: 10 }}
          formatter={(value) => CATEGORY_LABELS[value as keyof typeof CATEGORY_LABELS]}
        />
        <Bar dataKey="cabello" stackId="a" fill={CATEGORY_COLORS.cabello} radius={[0, 0, 0, 0]} />
        <Bar dataKey="masaje" stackId="a" fill={CATEGORY_COLORS.masaje} radius={[0, 0, 0, 0]} />
        <Bar dataKey="arriendo" stackId="a" fill={CATEGORY_COLORS.arriendo} radius={[0, 0, 0, 0]} />
        <Bar dataKey="producto" stackId="a" fill={CATEGORY_COLORS.producto} radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
