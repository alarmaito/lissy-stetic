'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  DoorOpen,
  Package,
  Wallet,
  Sparkles,
  Sparkle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/clientas', label: 'Clientas', icon: Users },
  { href: '/calendario', label: 'Calendario', icon: CalendarDays },
  { href: '/boxes', label: 'Boxes', icon: DoorOpen },
  { href: '/inventario', label: 'Inventario', icon: Package },
  { href: '/finanzas', label: 'Finanzas', icon: Wallet },
  { href: '/asistente-ia', label: 'Asistente IA', icon: Sparkles },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 glass-panel border-r border-border/60">
      <div className="px-6 py-7 border-b border-border/50">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-rose rounded-xl blur-md opacity-50 group-hover:opacity-70 transition-opacity" />
            <div className="relative h-10 w-10 rounded-xl bg-gradient-rose flex items-center justify-center shadow-glow">
              <Sparkle className="h-5 w-5 text-white" fill="white" />
            </div>
          </div>
          <div>
            <p className="font-display text-base font-bold leading-none">Lissy Stetic</p>
            <p className="text-[11px] text-muted-foreground mt-1">Lehi · Utah</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                active
                  ? 'bg-gradient-rose text-primary-foreground shadow-glow'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              )}
            >
              <Icon className={cn('h-4 w-4 shrink-0', active && 'text-primary-foreground')} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="px-3 py-4 border-t border-border/50">
        <div className="rounded-xl bg-gradient-soft p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <p className="font-display text-xs font-semibold text-secondary-foreground">Modo demo</p>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Vista previa de Cercai IA · Datos de ejemplo
          </p>
        </div>
      </div>
    </aside>
  )
}

export function MobileNav() {
  const pathname = usePathname()
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 glass-panel border-t border-border/60 flex items-center justify-around px-2 py-2 safe-area-bottom">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon
        const active = pathname === item.href || pathname.startsWith(item.href + '/')
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 text-[10px] font-medium transition-all min-w-0',
              active ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            <Icon className={cn('h-5 w-5', active && 'text-primary')} />
            <span className="truncate">{item.label === 'Asistente IA' ? 'IA' : item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
