export type ServiceCategory = 'cabello' | 'masaje' | 'manicure' | 'otros'

export interface Service {
  id: string
  name: string
  category: ServiceCategory
  duration: number // minutos
  price: number // USD
  description?: string
}

export interface ServicePackage {
  id: string
  serviceId: string
  name: string
  totalSessions: number
  price: number
  description: string
}

export interface Client {
  id: string
  name: string
  phone: string
  email: string
  avatarHue: number
  joinedAt: string
  notes?: string
}

export type BookingStatus = 'confirmed' | 'pending' | 'completed' | 'cancelled'

export interface Booking {
  id: string
  clientId: string
  serviceId: string
  startsAt: string
  endsAt: string
  status: BookingStatus
  notes?: string
}

export interface ClientPackage {
  id: string
  clientId: string
  packageId: string
  startedAt: string
  sessionsUsed: number
  sessionsTotal: number
}

export interface PackageSession {
  id: string
  clientPackageId: string
  date: string
  sessionNumber: number
  notes?: string
}

export type BoxStatus = 'active' | 'available' | 'maintenance'

export interface Box {
  id: string
  name: string
  status: BoxStatus
  description: string
}

export interface Tenant {
  id: string
  name: string
  specialty: string
  phone: string
  avatarHue: number
  joinedAt: string
}

export interface BoxRental {
  id: string
  boxId: string
  tenantId: string
  daysOfWeek: number[] // 0=Dom, 6=Sáb
  startTime: string
  endTime: string
  monthlyRate: number
  active: boolean
}

export type PaymentStatus = 'paid' | 'pending' | 'overdue'

export interface RentalPayment {
  id: string
  rentalId: string
  month: string // 'YYYY-MM'
  amount: number
  dueDate: string
  paidAt?: string
  status: PaymentStatus
}

export type TransactionType = 'income' | 'expense'
export type TransactionCategory = 'cabello' | 'masaje' | 'arriendo' | 'producto' | 'gasto'

export interface Transaction {
  id: string
  date: string
  description: string
  category: TransactionCategory
  type: TransactionType
  amount: number
}

export type TriggerType =
  | 'retoque-balayage'
  | 'sesion-pendiente'
  | 'cliente-inactivo'
  | 'cumpleanos'
  | 'cross-sell'

export interface AITrigger {
  id: string
  clientId: string
  type: TriggerType
  title: string
  suggestion: string
  createdAt: string
  status: 'pending' | 'sent' | 'dismissed'
}

export type MessageRole = 'lead' | 'bot'

export interface ChatMessage {
  role: MessageRole
  content: string
  delay: number // ms antes de mostrar
}

export interface Conversation {
  id: string
  leadName: string
  leadPhone: string
  topic: string
  avatarHue: number
  lastMessagePreview: string
  unread: number
  closed: boolean
  closedDeal?: string
  script: ChatMessage[]
}
