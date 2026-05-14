import type { Booking, ClientPackage, PackageSession } from './types'

// Offsets de días desde HOY. Negativo = pasado, positivo = futuro.
interface BookingSeed {
  id: string
  clientId: string
  serviceId: string
  dayOffset: number
  hour: number
  minute: number
  status: Booking['status']
  notes?: string
}

const BOOKING_SEEDS: BookingSeed[] = [
  // HOY
  { id: 'b001', clientId: 'c01', serviceId: 'svc-balayage', dayOffset: 0, hour: 9, minute: 30, status: 'confirmed' },
  { id: 'b002', clientId: 'c03', serviceId: 'svc-masaje-reductivo', dayOffset: 0, hour: 11, minute: 0, status: 'confirmed', notes: 'Sesión 4 del paquete' },
  { id: 'b003', clientId: 'c08', serviceId: 'svc-corte', dayOffset: 0, hour: 13, minute: 30, status: 'confirmed' },
  { id: 'b004', clientId: 'c12', serviceId: 'svc-queratina', dayOffset: 0, hour: 15, minute: 0, status: 'confirmed' },
  { id: 'b005', clientId: 'c19', serviceId: 'svc-brushing', dayOffset: 0, hour: 17, minute: 30, status: 'pending' },
  // MAÑANA
  { id: 'b006', clientId: 'c02', serviceId: 'svc-balayage', dayOffset: 1, hour: 10, minute: 0, status: 'confirmed' },
  { id: 'b007', clientId: 'c14', serviceId: 'svc-masaje-reductivo', dayOffset: 1, hour: 12, minute: 0, status: 'confirmed', notes: 'Sesión 6 del paquete' },
  { id: 'b008', clientId: 'c25', serviceId: 'svc-drenaje', dayOffset: 1, hour: 14, minute: 30, status: 'confirmed' },
  { id: 'b009', clientId: 'c05', serviceId: 'svc-corte', dayOffset: 1, hour: 16, minute: 0, status: 'confirmed' },
  // PASADO MAÑANA
  { id: 'b010', clientId: 'c07', serviceId: 'svc-queratina', dayOffset: 2, hour: 10, minute: 0, status: 'confirmed' },
  { id: 'b011', clientId: 'c11', serviceId: 'svc-masaje-reductivo', dayOffset: 2, hour: 12, minute: 30, status: 'confirmed' },
  { id: 'b012', clientId: 'c21', serviceId: 'svc-balayage', dayOffset: 2, hour: 15, minute: 0, status: 'confirmed' },
  // RESTO DE LA SEMANA
  { id: 'b013', clientId: 'c04', serviceId: 'svc-brushing', dayOffset: 3, hour: 11, minute: 0, status: 'confirmed' },
  { id: 'b014', clientId: 'c17', serviceId: 'svc-masaje-reductivo', dayOffset: 3, hour: 14, minute: 0, status: 'confirmed' },
  { id: 'b015', clientId: 'c09', serviceId: 'svc-corte', dayOffset: 3, hour: 16, minute: 30, status: 'pending' },
  { id: 'b016', clientId: 'c16', serviceId: 'svc-queratina', dayOffset: 4, hour: 10, minute: 0, status: 'confirmed' },
  { id: 'b017', clientId: 'c23', serviceId: 'svc-drenaje', dayOffset: 4, hour: 13, minute: 0, status: 'confirmed' },
  { id: 'b018', clientId: 'c30', serviceId: 'svc-balayage', dayOffset: 5, hour: 11, minute: 0, status: 'confirmed' },
  { id: 'b019', clientId: 'c26', serviceId: 'svc-masaje-reductivo', dayOffset: 5, hour: 14, minute: 30, status: 'confirmed' },
  { id: 'b020', clientId: 'c13', serviceId: 'svc-corte', dayOffset: 6, hour: 9, minute: 30, status: 'confirmed' },
  // PRÓXIMA SEMANA
  { id: 'b021', clientId: 'c01', serviceId: 'svc-brushing', dayOffset: 8, hour: 11, minute: 0, status: 'confirmed' },
  { id: 'b022', clientId: 'c20', serviceId: 'svc-masaje-reductivo', dayOffset: 9, hour: 12, minute: 0, status: 'confirmed' },
  { id: 'b023', clientId: 'c28', serviceId: 'svc-queratina', dayOffset: 10, hour: 14, minute: 0, status: 'confirmed' },
  // PASADAS
  { id: 'b024', clientId: 'c02', serviceId: 'svc-balayage', dayOffset: -32, hour: 10, minute: 0, status: 'completed' },
  { id: 'b025', clientId: 'c03', serviceId: 'svc-masaje-reductivo', dayOffset: -14, hour: 11, minute: 0, status: 'completed', notes: 'Sesión 3' },
  { id: 'b026', clientId: 'c03', serviceId: 'svc-masaje-reductivo', dayOffset: -7, hour: 11, minute: 0, status: 'completed', notes: 'Sesión 4' },
  { id: 'b027', clientId: 'c05', serviceId: 'svc-corte', dayOffset: -21, hour: 9, minute: 30, status: 'completed' },
  { id: 'b028', clientId: 'c14', serviceId: 'svc-masaje-reductivo', dayOffset: -10, hour: 12, minute: 0, status: 'completed' },
  { id: 'b029', clientId: 'c19', serviceId: 'svc-balayage', dayOffset: -45, hour: 10, minute: 0, status: 'completed' },
  { id: 'b030', clientId: 'c10', serviceId: 'svc-queratina', dayOffset: -28, hour: 14, minute: 0, status: 'completed' },
  { id: 'b031', clientId: 'c22', serviceId: 'svc-brushing', dayOffset: -3, hour: 16, minute: 0, status: 'completed' },
  { id: 'b032', clientId: 'c01', serviceId: 'svc-corte', dayOffset: -2, hour: 15, minute: 0, status: 'completed' },
]

interface ClientPackageSeed {
  id: string
  clientId: string
  packageId: string
  startedDayOffset: number
  sessionsUsed: number
  sessionsTotal: number
}

const CLIENT_PACKAGE_SEEDS: ClientPackageSeed[] = [
  { id: 'cp01', clientId: 'c03', packageId: 'pkg-masaje-10', startedDayOffset: -35, sessionsUsed: 4, sessionsTotal: 10 },
  { id: 'cp02', clientId: 'c14', packageId: 'pkg-masaje-10', startedDayOffset: -50, sessionsUsed: 6, sessionsTotal: 10 },
  { id: 'cp03', clientId: 'c17', packageId: 'pkg-masaje-10', startedDayOffset: -20, sessionsUsed: 2, sessionsTotal: 10 },
  { id: 'cp04', clientId: 'c11', packageId: 'pkg-masaje-10', startedDayOffset: -65, sessionsUsed: 8, sessionsTotal: 10 },
  { id: 'cp05', clientId: 'c26', packageId: 'pkg-masaje-10', startedDayOffset: -10, sessionsUsed: 1, sessionsTotal: 10 },
  { id: 'cp06', clientId: 'c20', packageId: 'pkg-masaje-10', startedDayOffset: -78, sessionsUsed: 10, sessionsTotal: 10 },
]

function offsetDate(now: Date, offsetDays: number, hour = 0, minute = 0): Date {
  const d = new Date(now)
  d.setDate(d.getDate() + offsetDays)
  d.setHours(hour, minute, 0, 0)
  return d
}

export function seedBookings(now: Date = new Date()): Booking[] {
  return BOOKING_SEEDS.map((b) => {
    const start = offsetDate(now, b.dayOffset, b.hour, b.minute)
    const end = new Date(start)
    end.setMinutes(end.getMinutes() + 60) // default 1h, ajustar después
    return {
      id: b.id,
      clientId: b.clientId,
      serviceId: b.serviceId,
      startsAt: start.toISOString(),
      endsAt: end.toISOString(),
      status: b.status,
      notes: b.notes,
    }
  })
}

export function seedClientPackages(now: Date = new Date()): ClientPackage[] {
  return CLIENT_PACKAGE_SEEDS.map((cp) => {
    const start = offsetDate(now, cp.startedDayOffset)
    return {
      id: cp.id,
      clientId: cp.clientId,
      packageId: cp.packageId,
      startedAt: start.toISOString(),
      sessionsUsed: cp.sessionsUsed,
      sessionsTotal: cp.sessionsTotal,
    }
  })
}

export function seedPackageSessions(now: Date = new Date()): PackageSession[] {
  // Para cliente c03 (Valentina) — 4 sesiones, espaciadas semanalmente
  const sessions: PackageSession[] = []
  const cp01Sessions = [-28, -21, -14, -7]
  cp01Sessions.forEach((offset, i) => {
    sessions.push({
      id: `ps01-${i + 1}`,
      clientPackageId: 'cp01',
      date: offsetDate(now, offset).toISOString(),
      sessionNumber: i + 1,
    })
  })
  return sessions
}
