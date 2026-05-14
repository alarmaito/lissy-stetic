import type { Service, ServicePackage } from './types'

export const SERVICES: Service[] = [
  {
    id: 'svc-queratina',
    name: 'Queratina',
    category: 'cabello',
    duration: 120,
    price: 180,
    description: 'Tratamiento de alisado y nutrición profunda con queratina pura.',
  },
  {
    id: 'svc-balayage',
    name: 'Balayage',
    category: 'cabello',
    duration: 180,
    price: 220,
    description: 'Mechas degradadas pintadas a mano para un look natural y luminoso.',
  },
  {
    id: 'svc-brushing',
    name: 'Brushing',
    category: 'cabello',
    duration: 45,
    price: 55,
    description: 'Peinado profesional con cepillo y secador.',
  },
  {
    id: 'svc-corte',
    name: 'Corte y Peinado',
    category: 'cabello',
    duration: 60,
    price: 70,
    description: 'Corte personalizado con asesoría de estilo.',
  },
  {
    id: 'svc-masaje-reductivo',
    name: 'Masaje Reductivo',
    category: 'masaje',
    duration: 75,
    price: 95,
    description:
      'Ultrasonido, cavitación, vacuum, radiofrecuencia, lipoláser, maniobras, drenaje linfático y criogel.',
  },
  {
    id: 'svc-drenaje',
    name: 'Drenaje Linfático',
    category: 'masaje',
    duration: 60,
    price: 75,
    description: 'Masaje suave que estimula el sistema linfático y reduce retención.',
  },
]

export const SERVICE_PACKAGES: ServicePackage[] = [
  {
    id: 'pkg-masaje-10',
    serviceId: 'svc-masaje-reductivo',
    name: 'Masaje Reductivo · Paquete 10 sesiones',
    totalSessions: 10,
    price: 850,
    description:
      'Programa completo de 10 sesiones de masaje reductivo. Incluye ultrasonido, cavitación, vacuum, radiofrecuencia, lipoláser, maniobras, drenaje linfático y criogel.',
  },
]

export const SERVICE_COLORS: Record<string, string> = {
  'svc-queratina': 'hsl(280 60% 70%)',
  'svc-balayage': 'hsl(340 80% 65%)',
  'svc-brushing': 'hsl(340 50% 80%)',
  'svc-corte': 'hsl(15 70% 70%)',
  'svc-masaje-reductivo': 'hsl(195 60% 60%)',
  'svc-drenaje': 'hsl(160 50% 60%)',
}

export function getService(id: string): Service | undefined {
  return SERVICES.find((s) => s.id === id)
}

export function getPackage(id: string): ServicePackage | undefined {
  return SERVICE_PACKAGES.find((p) => p.id === id)
}
