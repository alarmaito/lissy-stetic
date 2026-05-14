'use client'

import { usePathname } from 'next/navigation'
import { Bell, Search, Sparkles } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

const TITLES: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': { title: 'Hola, Lissy 💕', subtitle: 'Aquí tienes el resumen de tu salón hoy' },
  '/clientas': { title: 'Clientas', subtitle: 'CRM con historial, paquetes y triggers IA' },
  '/calendario': { title: 'Calendario', subtitle: 'Citas propias de Lissy' },
  '/boxes': { title: 'Gestión de Boxes', subtitle: 'Arriendos y cobros del centro' },
  '/finanzas': { title: 'Finanzas', subtitle: 'Flujo de caja e ingresos por categoría' },
  '/asistente-ia': { title: 'Asistente IA · WhatsApp', subtitle: 'Conversaciones automatizadas 24/7' },
}

export function TopBar() {
  const pathname = usePathname()
  const meta = Object.entries(TITLES).find(([key]) => pathname.startsWith(key))?.[1] ?? {
    title: 'Lissy Stetic',
    subtitle: '',
  }

  return (
    <header className="sticky top-0 z-30 glass-panel border-b border-border/60 px-5 lg:px-8 py-4 flex items-center justify-between gap-4">
      <div className="min-w-0">
        <h1 className="font-display text-xl lg:text-2xl font-bold text-foreground truncate">
          {meta.title}
        </h1>
        {meta.subtitle && (
          <p className="text-xs lg:text-sm text-muted-foreground truncate">{meta.subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-2 lg:gap-3">
        <button
          type="button"
          className="hidden md:flex items-center gap-2 rounded-full bg-secondary/50 px-3 py-2 text-sm text-muted-foreground hover:bg-secondary transition-colors min-w-[200px]"
        >
          <Search className="h-4 w-4" />
          <span>Buscar clienta, cita...</span>
        </button>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary animate-pulse-soft" />
        </Button>

        <div className="hidden sm:flex items-center gap-2 rounded-full bg-card border border-border/60 pl-1 pr-3 py-1 shadow-soft">
          <Avatar className="h-8 w-8">
            <AvatarFallback>LS</AvatarFallback>
          </Avatar>
          <div className="text-left">
            <p className="text-xs font-semibold leading-tight">Lissy</p>
            <p className="text-[10px] text-muted-foreground leading-tight">Dueña</p>
          </div>
        </div>
        <Avatar className="sm:hidden h-9 w-9">
          <AvatarFallback>LS</AvatarFallback>
        </Avatar>

        <div className="hidden lg:flex items-center gap-1.5 rounded-full bg-gradient-rose px-3 py-1.5 text-[11px] font-semibold text-primary-foreground shadow-glow">
          <Sparkles className="h-3 w-3" />
          <span>Cercai IA</span>
        </div>
      </div>
    </header>
  )
}
