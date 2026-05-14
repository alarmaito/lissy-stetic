import type { Box, BoxRental, RentalPayment, Tenant } from './types'

export const BOXES: Box[] = [
  { id: 'box-1', name: 'Box 1', status: 'active', description: 'Sala principal — área de manicure' },
  { id: 'box-2', name: 'Box 2', status: 'active', description: 'Sala spa — masajes y faciales' },
  { id: 'box-3', name: 'Box 3', status: 'active', description: 'Sala de pestañas' },
  { id: 'box-4', name: 'Box 4', status: 'active', description: 'Sala de depilación' },
  { id: 'box-5', name: 'Box 5', status: 'available', description: 'Sala disponible para arriendo' },
  { id: 'box-6', name: 'Box 6', status: 'maintenance', description: 'En remodelación — disponible en 2 semanas' },
]

export const TENANTS: Tenant[] = [
  { id: 't01', name: 'María Fernanda López', specialty: 'Manicurista profesional', phone: '+1 (801) 555-1101', avatarHue: 340, joinedAt: '2025-01-15' },
  { id: 't02', name: 'Karla Beltrán', specialty: 'Masoterapeuta', phone: '+1 (801) 555-1123', avatarHue: 200, joinedAt: '2025-02-08' },
  { id: 't03', name: 'Daniela Páez', specialty: 'Lashista certificada', phone: '+1 (801) 555-1145', avatarHue: 280, joinedAt: '2024-11-22' },
  { id: 't04', name: 'Verónica Aldana', specialty: 'Depiladora — cera y laser', phone: '+1 (801) 555-1167', avatarHue: 25, joinedAt: '2025-03-01' },
]

export const BOX_RENTALS: BoxRental[] = [
  { id: 'r01', boxId: 'box-1', tenantId: 't01', daysOfWeek: [1, 2, 3, 4, 5, 6], startTime: '10:00', endTime: '19:00', monthlyRate: 750, active: true },
  { id: 'r02', boxId: 'box-2', tenantId: 't02', daysOfWeek: [2, 4, 6], startTime: '11:00', endTime: '18:00', monthlyRate: 600, active: true },
  { id: 'r03', boxId: 'box-3', tenantId: 't03', daysOfWeek: [1, 3, 5, 6], startTime: '09:00', endTime: '17:00', monthlyRate: 680, active: true },
  { id: 'r04', boxId: 'box-4', tenantId: 't04', daysOfWeek: [2, 4], startTime: '14:00', endTime: '20:00', monthlyRate: 520, active: true },
]

interface PaymentSeed {
  id: string
  rentalId: string
  monthsAgo: number
  status: RentalPayment['status']
}

const PAYMENT_SEEDS: PaymentSeed[] = [
  // Mes actual
  { id: 'p01', rentalId: 'r01', monthsAgo: 0, status: 'paid' },
  { id: 'p02', rentalId: 'r02', monthsAgo: 0, status: 'pending' },
  { id: 'p03', rentalId: 'r03', monthsAgo: 0, status: 'paid' },
  { id: 'p04', rentalId: 'r04', monthsAgo: 0, status: 'overdue' },
  // Mes anterior
  { id: 'p05', rentalId: 'r01', monthsAgo: 1, status: 'paid' },
  { id: 'p06', rentalId: 'r02', monthsAgo: 1, status: 'paid' },
  { id: 'p07', rentalId: 'r03', monthsAgo: 1, status: 'paid' },
  { id: 'p08', rentalId: 'r04', monthsAgo: 1, status: 'paid' },
  // 2 meses atrás
  { id: 'p09', rentalId: 'r01', monthsAgo: 2, status: 'paid' },
  { id: 'p10', rentalId: 'r02', monthsAgo: 2, status: 'paid' },
  { id: 'p11', rentalId: 'r03', monthsAgo: 2, status: 'paid' },
  { id: 'p12', rentalId: 'r04', monthsAgo: 2, status: 'paid' },
]

export function seedRentalPayments(now: Date = new Date()): RentalPayment[] {
  return PAYMENT_SEEDS.map((p) => {
    const rental = BOX_RENTALS.find((r) => r.id === p.rentalId)!
    const monthDate = new Date(now)
    monthDate.setMonth(monthDate.getMonth() - p.monthsAgo)
    const month = `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, '0')}`
    const dueDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), 5).toISOString()
    const paidAt =
      p.status === 'paid'
        ? new Date(monthDate.getFullYear(), monthDate.getMonth(), Math.min(p.monthsAgo === 0 ? 3 : 4, 28)).toISOString()
        : undefined
    return {
      id: p.id,
      rentalId: p.rentalId,
      month,
      amount: rental.monthlyRate,
      dueDate,
      paidAt,
      status: p.status,
    }
  })
}

export function getBox(id: string): Box | undefined {
  return BOXES.find((b) => b.id === id)
}

export function getTenant(id: string): Tenant | undefined {
  return TENANTS.find((t) => t.id === id)
}

export function getRental(id: string): BoxRental | undefined {
  return BOX_RENTALS.find((r) => r.id === id)
}

export const DAY_LABELS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
