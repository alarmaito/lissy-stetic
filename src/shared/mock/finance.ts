import type { Transaction } from './types'

interface TransactionSeed {
  id: string
  daysAgo: number
  description: string
  category: Transaction['category']
  type: Transaction['type']
  amount: number
}

const TRANSACTION_SEEDS: TransactionSeed[] = [
  // Mes actual — ingresos servicios propios
  { id: 't001', daysAgo: 0, description: 'Balayage · María José Hernández', category: 'cabello', type: 'income', amount: 220 },
  { id: 't002', daysAgo: 0, description: 'Masaje reductivo · Valentina Salinas', category: 'masaje', type: 'income', amount: 95 },
  { id: 't003', daysAgo: 0, description: 'Corte y peinado · Paola Jiménez', category: 'cabello', type: 'income', amount: 70 },
  { id: 't004', daysAgo: 0, description: 'Queratina · Lucía Aguirre', category: 'cabello', type: 'income', amount: 180 },
  { id: 't005', daysAgo: 1, description: 'Brushing · Catalina Ortiz', category: 'cabello', type: 'income', amount: 55 },
  { id: 't006', daysAgo: 1, description: 'Balayage · Camila Restrepo', category: 'cabello', type: 'income', amount: 220 },
  { id: 't007', daysAgo: 2, description: 'Masaje reductivo · Renata Fuentes', category: 'masaje', type: 'income', amount: 95 },
  { id: 't008', daysAgo: 2, description: 'Drenaje linfático · Josefina Pinto', category: 'masaje', type: 'income', amount: 75 },
  { id: 't009', daysAgo: 3, description: 'Queratina · Daniela Cortés', category: 'cabello', type: 'income', amount: 180 },
  { id: 't010', daysAgo: 3, description: 'Masaje reductivo · Natalia Peralta', category: 'masaje', type: 'income', amount: 95 },
  { id: 't011', daysAgo: 4, description: 'Corte y peinado · Mariana Castillo', category: 'cabello', type: 'income', amount: 70 },
  { id: 't012', daysAgo: 5, description: 'Balayage · Amparo Galindo', category: 'cabello', type: 'income', amount: 220 },
  { id: 't013', daysAgo: 5, description: 'Productos retail · Constanza Rivas', category: 'producto', type: 'income', amount: 85 },
  { id: 't014', daysAgo: 7, description: 'Masaje reductivo · Fernanda Ríos', category: 'masaje', type: 'income', amount: 95 },
  { id: 't015', daysAgo: 8, description: 'Brushing · Bianca Morales', category: 'cabello', type: 'income', amount: 55 },
  { id: 't016', daysAgo: 10, description: 'Paquete 10 sesiones · Trinidad Lagos (anticipo)', category: 'masaje', type: 'income', amount: 425 },
  { id: 't017', daysAgo: 12, description: 'Queratina · Antonia Vega', category: 'cabello', type: 'income', amount: 180 },
  { id: 't018', daysAgo: 14, description: 'Balayage · Sofía Martínez', category: 'cabello', type: 'income', amount: 220 },
  { id: 't019', daysAgo: 16, description: 'Productos retail · Bárbara Núñez', category: 'producto', type: 'income', amount: 65 },
  { id: 't020', daysAgo: 18, description: 'Masaje reductivo · Magdalena Reyes', category: 'masaje', type: 'income', amount: 95 },
  // Arriendos
  { id: 't021', daysAgo: 8, description: 'Arriendo Box 1 · María Fernanda López', category: 'arriendo', type: 'income', amount: 750 },
  { id: 't022', daysAgo: 6, description: 'Arriendo Box 3 · Daniela Páez', category: 'arriendo', type: 'income', amount: 680 },
  // Gastos
  { id: 't023', daysAgo: 4, description: 'Insumos · productos peluquería', category: 'gasto', type: 'expense', amount: 240 },
  { id: 't024', daysAgo: 9, description: 'Servicios (luz + agua)', category: 'gasto', type: 'expense', amount: 185 },
  { id: 't025', daysAgo: 15, description: 'Mantención equipos masaje', category: 'gasto', type: 'expense', amount: 120 },

  // Mes anterior (resumen condensado para gráfico)
  { id: 't101', daysAgo: 32, description: 'Servicios cabello · varios', category: 'cabello', type: 'income', amount: 3420 },
  { id: 't102', daysAgo: 32, description: 'Servicios masaje · varios', category: 'masaje', type: 'income', amount: 2150 },
  { id: 't103', daysAgo: 32, description: 'Arriendos boxes', category: 'arriendo', type: 'income', amount: 2550 },
  { id: 't104', daysAgo: 32, description: 'Productos retail', category: 'producto', type: 'income', amount: 340 },
  { id: 't105', daysAgo: 32, description: 'Gastos operativos', category: 'gasto', type: 'expense', amount: 680 },

  // 2 meses atrás
  { id: 't201', daysAgo: 62, description: 'Servicios cabello · varios', category: 'cabello', type: 'income', amount: 2980 },
  { id: 't202', daysAgo: 62, description: 'Servicios masaje · varios', category: 'masaje', type: 'income', amount: 1840 },
  { id: 't203', daysAgo: 62, description: 'Arriendos boxes', category: 'arriendo', type: 'income', amount: 1900 },

  // 3 meses atrás
  { id: 't301', daysAgo: 92, description: 'Servicios cabello · varios', category: 'cabello', type: 'income', amount: 2620 },
  { id: 't302', daysAgo: 92, description: 'Servicios masaje · varios', category: 'masaje', type: 'income', amount: 1520 },
  { id: 't303', daysAgo: 92, description: 'Arriendos boxes', category: 'arriendo', type: 'income', amount: 1250 },

  // 4 meses atrás
  { id: 't401', daysAgo: 122, description: 'Servicios cabello · varios', category: 'cabello', type: 'income', amount: 2380 },
  { id: 't402', daysAgo: 122, description: 'Servicios masaje · varios', category: 'masaje', type: 'income', amount: 1280 },
  { id: 't403', daysAgo: 122, description: 'Arriendos boxes', category: 'arriendo', type: 'income', amount: 1250 },

  // 5 meses atrás
  { id: 't501', daysAgo: 152, description: 'Servicios cabello · varios', category: 'cabello', type: 'income', amount: 2100 },
  { id: 't502', daysAgo: 152, description: 'Servicios masaje · varios', category: 'masaje', type: 'income', amount: 980 },
  { id: 't503', daysAgo: 152, description: 'Arriendos boxes', category: 'arriendo', type: 'income', amount: 600 },
]

export function seedTransactions(now: Date = new Date()): Transaction[] {
  return TRANSACTION_SEEDS.map((t) => {
    const date = new Date(now)
    date.setDate(date.getDate() - t.daysAgo)
    date.setHours(12, 0, 0, 0)
    return {
      id: t.id,
      date: date.toISOString(),
      description: t.description,
      category: t.category,
      type: t.type,
      amount: t.amount,
    }
  })
}

export const CATEGORY_LABELS: Record<Transaction['category'], string> = {
  cabello: 'Cabello',
  masaje: 'Masajes',
  arriendo: 'Arriendo Boxes',
  producto: 'Productos',
  gasto: 'Gastos',
}

export const CATEGORY_COLORS: Record<Transaction['category'], string> = {
  cabello: 'hsl(340 78% 62%)',
  masaje: 'hsl(195 60% 60%)',
  arriendo: 'hsl(280 60% 70%)',
  producto: 'hsl(35 80% 60%)',
  gasto: 'hsl(0 60% 60%)',
}
