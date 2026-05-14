'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Phone,
  Video,
  Search,
  CheckCheck,
  Send,
  Smile,
  Paperclip,
  Sparkles,
  RotateCcw,
  Pause,
  Play,
  ArrowLeft,
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn, initials } from '@/lib/utils'
import { CONVERSATIONS, type Conversation, type ChatMessage } from '@/shared/mock'

interface DisplayedMessage extends ChatMessage {
  id: string
  timestamp: string
}

const TIME_OFFSETS_MIN = [-92, -85, -75, -70, -60, -55, -45, -38, -25, -18]

function makeTimestamp(minutesAgo: number): string {
  const d = new Date()
  d.setMinutes(d.getMinutes() - minutesAgo)
  return d.toLocaleTimeString('es-US', { hour: '2-digit', minute: '2-digit', hour12: false })
}

export function ChatView() {
  const [activeId, setActiveId] = useState(CONVERSATIONS[0].id)
  const [mobilePane, setMobilePane] = useState<'list' | 'chat'>('list')
  const active = CONVERSATIONS.find((c) => c.id === activeId)!

  return (
    <div className="rounded-2xl border border-border/70 bg-card shadow-soft overflow-hidden h-[calc(100vh-180px)] lg:h-[calc(100vh-200px)] flex">
      {/* Lista de conversaciones */}
      <aside
        className={cn(
          'w-full lg:w-[340px] shrink-0 border-r border-border/60 flex flex-col bg-secondary/20',
          mobilePane === 'chat' && 'hidden lg:flex'
        )}
      >
        <div className="p-4 border-b border-border/60 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-bold">Conversaciones</h3>
            <Badge variant="soft" className="gap-1">
              <Sparkles className="h-3 w-3" />
              {CONVERSATIONS.filter((c) => !c.closed).length} activas
            </Badge>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar..."
              className="w-full h-9 rounded-full bg-card border border-border/60 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {CONVERSATIONS.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setActiveId(c.id)
                setMobilePane('chat')
              }}
              className={cn(
                'w-full text-left flex items-start gap-3 px-4 py-3 border-b border-border/40 hover:bg-secondary/50 transition-colors',
                activeId === c.id && 'bg-card border-l-4 border-l-primary'
              )}
            >
              <Avatar className="h-11 w-11 shrink-0">
                <AvatarFallback style={{ background: `hsl(${c.avatarHue} 70% 70%)` }}>
                  {initials(c.leadName)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold truncate">{c.leadName}</p>
                  <span className="text-[10px] text-muted-foreground shrink-0">11:42</span>
                </div>
                <p className="text-xs text-muted-foreground truncate mt-0.5">{c.lastMessagePreview}</p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  {c.closed ? (
                    <Badge variant="success" className="text-[9px] px-1.5 py-0">
                      ✓ Cerrada
                    </Badge>
                  ) : (
                    <Badge variant="warning" className="text-[9px] px-1.5 py-0">
                      Activa
                    </Badge>
                  )}
                  {c.unread > 0 && (
                    <Badge variant="default" className="text-[9px] px-1.5 py-0">
                      {c.unread} nueva
                    </Badge>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Chat activo */}
      <ChatPanel
        conversation={active}
        onBack={() => setMobilePane('list')}
        hidden={mobilePane === 'list'}
      />
    </div>
  )
}

function ChatPanel({
  conversation,
  onBack,
  hidden,
}: {
  conversation: Conversation
  onBack: () => void
  hidden: boolean
}) {
  const [displayed, setDisplayed] = useState<DisplayedMessage[]>([])
  const [typing, setTyping] = useState(false)
  const [playing, setPlaying] = useState(true)
  const [step, setStep] = useState(0)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  const script = conversation.script

  // Reiniciar cuando cambia la conversación
  useEffect(() => {
    timersRef.current.forEach((t) => clearTimeout(t))
    timersRef.current = []
    setDisplayed([])
    setStep(0)
    setTyping(false)
    setPlaying(true)
  }, [conversation.id])

  // Reproducir scripts
  useEffect(() => {
    if (!playing || step >= script.length) return
    const msg = script[step]
    const isBot = msg.role === 'bot'

    const typingTimer = setTimeout(() => {
      if (isBot) setTyping(true)
    }, 200)

    const showTimer = setTimeout(
      () => {
        setTyping(false)
        setDisplayed((prev) => [
          ...prev,
          {
            ...msg,
            id: `${conversation.id}-${step}`,
            timestamp: makeTimestamp(TIME_OFFSETS_MIN[step] ?? -10),
          },
        ])
        setStep((s) => s + 1)
      },
      msg.delay + (isBot ? 900 : 0)
    )

    timersRef.current.push(typingTimer, showTimer)

    return () => {
      clearTimeout(typingTimer)
      clearTimeout(showTimer)
    }
  }, [playing, step, script, conversation.id])

  // Auto-scroll
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [displayed, typing])

  const restart = () => {
    timersRef.current.forEach((t) => clearTimeout(t))
    timersRef.current = []
    setDisplayed([])
    setStep(0)
    setTyping(false)
    setPlaying(true)
  }

  return (
    <section className={cn('flex-1 flex flex-col min-w-0 bg-[#ECE5DD]/30', hidden && 'hidden lg:flex')}>
      {/* Header */}
      <header className="px-4 lg:px-5 py-3 border-b border-border/60 bg-card flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={onBack} className="lg:hidden text-muted-foreground">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarFallback style={{ background: `hsl(${conversation.avatarHue} 70% 70%)` }}>
              {initials(conversation.leadName)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">{conversation.leadName}</p>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-soft" />
              en línea · {conversation.topic}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button variant="ghost" size="icon" onClick={() => setPlaying((p) => !p)}>
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={restart}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden md:inline-flex">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden md:inline-flex">
            <Video className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Aviso demo */}
      <div className="px-5 py-2 bg-gradient-soft border-b border-border/60 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2 text-xs text-secondary-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" />
          <span>
            <strong>Modo demo:</strong> conversación scripted del bot Cercai IA. En producción responde con LLM en
            tiempo real.
          </span>
        </div>
        {conversation.closed && conversation.closedDeal && (
          <Badge variant="success" className="hidden md:inline-flex shrink-0">
            ✓ {conversation.closedDeal}
          </Badge>
        )}
      </div>

      {/* Messages */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto scrollbar-thin px-4 lg:px-8 py-5 space-y-3"
      >
        {displayed.map((m) => (
          <Message key={m.id} message={m} />
        ))}
        {typing && <TypingIndicator />}
      </div>

      {/* Input (decorativo) */}
      <footer className="px-3 py-3 border-t border-border/60 bg-card flex items-center gap-2 shrink-0">
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Smile className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Paperclip className="h-5 w-5" />
        </Button>
        <input
          type="text"
          disabled
          placeholder={step < script.length ? 'El bot está respondiendo...' : 'Escribe un mensaje'}
          className="flex-1 h-10 rounded-full bg-secondary/60 px-4 text-sm placeholder:text-muted-foreground/70 focus:outline-none"
        />
        <Button size="icon" className="rounded-full">
          <Send className="h-4 w-4" />
        </Button>
      </footer>
    </section>
  )
}

function Message({ message }: { message: DisplayedMessage }) {
  const isBot = message.role === 'bot'
  return (
    <div className={cn('flex animate-fade-in', isBot ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[78%] md:max-w-[65%] rounded-2xl px-3.5 py-2.5 shadow-soft relative',
          isBot
            ? 'bg-gradient-to-br from-[#DCF8C6] to-[#C8F0B5] text-foreground rounded-tr-md'
            : 'bg-card text-foreground rounded-tl-md'
        )}
      >
        {isBot && (
          <p className="text-[10px] font-bold text-success mb-1 flex items-center gap-1">
            <Sparkles className="h-2.5 w-2.5" />
            Cercai Bot
          </p>
        )}
        <p className="text-sm whitespace-pre-line leading-relaxed">{message.content}</p>
        <div
          className={cn(
            'flex items-center justify-end gap-1 mt-1 text-[10px]',
            isBot ? 'text-success/80' : 'text-muted-foreground'
          )}
        >
          <span>{message.timestamp}</span>
          {isBot && <CheckCheck className="h-3 w-3" />}
        </div>
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex justify-end animate-fade-in">
      <div className="bg-gradient-to-br from-[#DCF8C6] to-[#C8F0B5] rounded-2xl rounded-tr-md px-4 py-3 shadow-soft">
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-success/60 animate-typing-dot" style={{ animationDelay: '0ms' }} />
          <span className="h-2 w-2 rounded-full bg-success/60 animate-typing-dot" style={{ animationDelay: '200ms' }} />
          <span className="h-2 w-2 rounded-full bg-success/60 animate-typing-dot" style={{ animationDelay: '400ms' }} />
        </div>
      </div>
    </div>
  )
}
