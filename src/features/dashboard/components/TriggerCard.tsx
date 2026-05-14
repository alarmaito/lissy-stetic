'use client'

import { Sparkles, Send, X } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { initials } from '@/lib/utils'
import { TRIGGER_TYPE_LABELS, type AITrigger, type Client } from '@/shared/mock'

interface Props {
  trigger: AITrigger
  client: Client
}

export function TriggerCard({ trigger, client }: Props) {
  return (
    <div className="group rounded-xl border border-border/60 bg-card hover:bg-secondary/40 hover:border-primary/40 p-4 transition-all">
      <div className="flex items-start gap-3">
        <Avatar className="h-9 w-9">
          <AvatarFallback style={{ background: `hsl(${client.avatarHue} 70% 70%)` }}>
            {initials(client.name)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="soft" className="text-[10px] gap-1 px-2">
              <Sparkles className="h-2.5 w-2.5" />
              {TRIGGER_TYPE_LABELS[trigger.type]}
            </Badge>
            {trigger.status === 'sent' && (
              <Badge variant="success" className="text-[10px]">
                Enviado
              </Badge>
            )}
          </div>
          <p className="text-sm font-semibold text-foreground leading-tight">{trigger.title}</p>
          <p className="text-xs text-muted-foreground leading-relaxed mt-1.5">{trigger.suggestion}</p>

          {trigger.status === 'pending' && (
            <div className="flex items-center gap-2 mt-3">
              <Button size="sm" className="h-7 text-xs gap-1.5">
                <Send className="h-3 w-3" />
                Enviar mensaje
              </Button>
              <Button size="sm" variant="ghost" className="h-7 text-xs gap-1.5 text-muted-foreground">
                <X className="h-3 w-3" />
                Descartar
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
