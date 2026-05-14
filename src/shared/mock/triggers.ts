import type { AITrigger } from './types'

interface TriggerSeed {
  id: string
  clientId: string
  type: AITrigger['type']
  title: string
  suggestion: string
  daysAgo: number
  status: AITrigger['status']
}

const TRIGGER_SEEDS: TriggerSeed[] = [
  {
    id: 'ai01',
    clientId: 'c02',
    type: 'retoque-balayage',
    title: 'Camila cumple 32 días desde su balayage',
    suggestion:
      'Enviar mensaje: "Hola Camila, vi que ya pasó un mes desde tu balayage. Te aparté un cupo el sábado para el retoque, ¿lo tomamos?"',
    daysAgo: 0,
    status: 'pending',
  },
  {
    id: 'ai02',
    clientId: 'c19',
    type: 'cross-sell',
    title: 'Ximena pidió balayage — ofrecerle paquete de masaje',
    suggestion:
      'Después de su balayage, mandar mensaje sugiriendo el paquete de 10 sesiones de masaje reductivo con 10% off por ser cliente recurrente.',
    daysAgo: 0,
    status: 'pending',
  },
  {
    id: 'ai03',
    clientId: 'c20',
    type: 'sesion-pendiente',
    title: 'Paulina completó su paquete de 10 sesiones',
    suggestion:
      'Felicitarla, pedirle review en Google y ofrecerle paquete de mantención de 4 sesiones a precio preferencial.',
    daysAgo: 1,
    status: 'pending',
  },
  {
    id: 'ai04',
    clientId: 'c10',
    type: 'cliente-inactivo',
    title: 'Carolina lleva 28 días sin agendar',
    suggestion:
      'Reactivar con descuento blando: "Te extrañamos, Carolina. Tenemos cupos esta semana — 15% off en tu próximo servicio."',
    daysAgo: 1,
    status: 'pending',
  },
  {
    id: 'ai05',
    clientId: 'c01',
    type: 'retoque-balayage',
    title: 'María José: queratina hace 30 días',
    suggestion:
      'Recordarle que el próximo brushing en casa rendirá menos. Sugerir brushing profesional el viernes.',
    daysAgo: 0,
    status: 'pending',
  },
  {
    id: 'ai06',
    clientId: 'c26',
    type: 'cross-sell',
    title: 'Trinidad empezó paquete masaje — ofrecer drenaje complementario',
    suggestion:
      'Las primeras sesiones rinden más con drenaje semanal. Ofrecer 4 drenajes a precio paquete (-20%).',
    daysAgo: 2,
    status: 'sent',
  },
  {
    id: 'ai07',
    clientId: 'c08',
    type: 'cumpleanos',
    title: 'Paola cumple años en 3 días',
    suggestion: 'Mandar saludo + gift card de $30 para usar en cualquier servicio este mes.',
    daysAgo: 0,
    status: 'pending',
  },
]

export function seedTriggers(now: Date = new Date()): AITrigger[] {
  return TRIGGER_SEEDS.map((t) => {
    const d = new Date(now)
    d.setDate(d.getDate() - t.daysAgo)
    return {
      id: t.id,
      clientId: t.clientId,
      type: t.type,
      title: t.title,
      suggestion: t.suggestion,
      createdAt: d.toISOString(),
      status: t.status,
    }
  })
}

export const TRIGGER_TYPE_LABELS: Record<AITrigger['type'], string> = {
  'retoque-balayage': 'Retoque',
  'sesion-pendiente': 'Sesiones',
  'cliente-inactivo': 'Reactivación',
  cumpleanos: 'Cumpleaños',
  'cross-sell': 'Venta cruzada',
}
