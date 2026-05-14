'use client'

import { useState } from 'react'
import { Tag, Copy, Check, MessageCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  clientName: string
  clientPhone: string
}

interface PromoTemplate {
  id: string
  tag: string
  message: (name: string) => string
}

const TEMPLATES: PromoTemplate[] = [
  {
    id: 'weekend',
    tag: 'Fin de semana especial',
    message: (name) =>
      `¡Hola ${name}! 🌸 Este fin de semana tenemos cupos limitados con 20% de descuento en todos nuestros tratamientos de cabello. Solo hasta el domingo. ¿Te reservamos un espacio? 💕`,
  },
  {
    id: 'reactivar',
    tag: 'Recuperar clienta',
    message: (name) =>
      `¡${name}, te extrañamos en Lissy Stetic! 💖 Como clienta especial, tienes un 15% de descuento exclusivo en tu próxima visita. Válido solo este mes. ¡Te esperamos con los brazos abiertos!`,
  },
  {
    id: 'temporada',
    tag: 'Oferta de temporada',
    message: (name) =>
      `¡Hola ${name}! 🌺 Este mes tenemos una oferta especial en paquetes de masaje reductivo: 25% OFF en tu paquete de 10 sesiones. Cupos muy limitados, ¿lo apartamos juntas? 💆‍♀️✨`,
  },
  {
    id: 'nuevo',
    tag: 'Nuevo tratamiento',
    message: (name) =>
      `¡${name}! 🌟 Acabamos de incorporar el tratamiento de Keratina Premium, ideal para cabello liso y sin frizz por meses. Precio de lanzamiento especial. ¿Quieres ser de las primeras en probarlo? 🙌`,
  },
]

function cleanPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  // Already has country code (11 digits starting with 1) or add +1
  if (digits.length === 11 && digits.startsWith('1')) return digits
  if (digits.length === 10) return `1${digits}`
  return digits
}

export function PromoDialog({ open, onOpenChange, clientName, clientPhone }: Props) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  async function handleCopy(id: string, text: string) {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      // fallback: select text
    }
  }

  function handleWhatsApp(text: string) {
    const phone = cleanPhone(clientPhone)
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const firstName = clientName.split(' ')[0]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-primary" />
            Ofrecer promo a {firstName}
          </DialogTitle>
        </DialogHeader>

        <p className="text-xs text-muted-foreground -mt-1">
          Mensajes listos para enviar por WhatsApp. Personalízalos antes si quieres.
        </p>

        <div className="space-y-4 pt-1">
          {TEMPLATES.map((tpl) => {
            const msg = tpl.message(firstName)
            const isCopied = copiedId === tpl.id
            return (
              <div
                key={tpl.id}
                className="rounded-xl border border-border/60 bg-secondary/20 p-4 space-y-3"
              >
                <Badge variant="soft" className="text-[11px]">
                  {tpl.tag}
                </Badge>
                <p className="text-sm leading-relaxed text-foreground">{msg}</p>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 h-8"
                    onClick={() => handleCopy(tpl.id, msg)}
                  >
                    {isCopied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-success" />
                        <span className="text-success">¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        Copiar texto
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    className="gap-1.5 h-8"
                    onClick={() => handleWhatsApp(msg)}
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    Enviar por WhatsApp
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}
