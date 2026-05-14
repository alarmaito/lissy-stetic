import { CalendarView } from '@/features/calendario/components/CalendarView'
import { CLIENTS, SERVICES, seedBookings } from '@/shared/mock'

export default function CalendarioPage() {
  const now = new Date()
  const bookings = seedBookings(now)

  return (
    <div className="animate-fade-in">
      <CalendarView bookings={bookings} clients={CLIENTS} services={SERVICES} />
    </div>
  )
}
