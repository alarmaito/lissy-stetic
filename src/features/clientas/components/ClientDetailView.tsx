'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Phone,
  Mail,
  Calendar,
  ChevronLeft,
  Sparkles,
  Send,
  TrendingUp,
  Award,
  Heart,
  Pencil,
  Tag,
  Check,
  X,
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import {
  getPackage,
  getService,
  seedBookings,
  seedClientPackages,
  seedTriggers,
  TRIGGER_TYPE_LABELS,
} from '@/shared/mock'
import { formatCurrency, formatDate, initials } from '@/lib/utils'
import { useClientsStore } from '../store/clientsStore'
import { PromoDialog } from './PromoDialog'
import { BeforeAfterSection } from './BeforeAfterSection'

interface Props {
  clientId: string
}

export function ClientDetailView({ clientId }: Props) {
  const router = useRouter()
  const client = useClientsStore((s) => s.clients.find((c) => c.id === clientId))
  const updateNotes = useClientsStore((s) => s.updateNotes)
  const sentTriggers = useClientsStore((s) => s.sentTriggers)
  const markTriggerSent = useClientsStore((s) => s.markTriggerSent)

  const [editingNotes, setEditingNotes] = useState(false)
  const [notesValue, setNotesValue] = useState('')
  const [promoOpen, setPromoOpen] = useState(false)

  const now = new Date()
  const allBookings = client ? seedBookings(now).filter((b) => b.clientId === clientId) : []
  const past = allBookings
    .filter((b) => new Date(b.startsAt) <= now)
    .sort((a, b) => new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime())
  const future = allBookings
    .filter((b) => new Date(b.startsAt) > now)
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())
  const pkg = client ? seedClientPackages(now).find((p) => p.clientId === clientId) : undefined
  const pkgData = pkg ? getPackage(pkg.packageId) : null
  const clientTriggers = client ? seedTriggers(now).filter((t) => t.clientId === clientId) : []

  const totalSpent = client
    ? past.reduce((sum, b) => {
        const svc = getService(b.serviceId)
        return sum + (svc?.price ?? 0)
      }, 0) + (pkg ? (pkgData?.price ?? 0) * 0.5 : 0)
    : 0

  if (!client) {
    router.push('/clientas')
    return null
  }

  const memberSince = formatDate(client.joinedAt, { month: 'long', year: 'numeric' })

  // client is guaranteed non-null here (guard above returns null)
  const safeClient = client

  function startEditNotes() {
    setNotesValue(safeClient.notes ?? '')
    setEditingNotes(true)
  }

  function saveNotes() {
    updateNotes(clientId, notesValue)
    setEditingNotes(false)
  }

  function cancelNotes() {
    setEditingNotes(false)
  }

  function handleWhatsAppTrigger(triggerId: string, suggestion: string) {
    const phone = safeClient.phone.replace(/\D/g, '')
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(suggestion)}`
    window.open(url, '_blank', 'noopener,noreferrer')
    markTriggerSent(triggerId)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Link
        href="/clientas"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Volver a clientas
      </Link>

      <Card className="overflow-hidden">
        <div className="h-24 bg-gradient-rose" />
        <CardContent className="pt-0">
          <div className="flex items-end justify-between -mt-12">
            <Avatar className="h-24 w-24 ring-4 ring-card shadow-lift shrink-0">
              <AvatarFallback
                className="text-2xl"
                style={{ background: `hsl(${client.avatarHue} 70% 65%)` }}
              >
                {initials(client.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2 pb-1">
              <Button variant="outline" className="gap-2" onClick={() => setPromoOpen(true)}>
                <Tag className="h-4 w-4" />
                Ofrecer promo
              </Button>
              <Button variant="outline" className="gap-2">
                <Phone className="h-4 w-4" />
                Llamar
              </Button>
              <Button className="gap-2">
                <Calendar className="h-4 w-4" />
                Agendar cita
              </Button>
            </div>
          </div>
          <div className="mt-3">
            <h2 className="font-display text-2xl font-bold">{client.name}</h2>
            <p className="text-sm text-muted-foreground">Clienta desde {memberSince}</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-3 mt-6">
            <div className="flex items-center gap-2.5 rounded-xl bg-secondary/50 px-4 py-3">
              <Phone className="h-4 w-4 text-primary shrink-0" />
              <span className="text-sm font-medium truncate">{client.phone}</span>
            </div>
            <div className="flex items-center gap-2.5 rounded-xl bg-secondary/50 px-4 py-3">
              <Mail className="h-4 w-4 text-primary shrink-0" />
              <span className="text-sm font-medium truncate">{client.email}</span>
            </div>
            <div className="flex items-center gap-2.5 rounded-xl bg-secondary/50 px-4 py-3">
              <TrendingUp className="h-4 w-4 text-primary shrink-0" />
              <span className="text-sm font-medium">
                Total gastado: <span className="text-primary">{formatCurrency(totalSpent)}</span>
              </span>
            </div>
          </div>

          {/* Notas editables */}
          <div className="mt-5 rounded-xl border border-border/60 bg-gradient-soft px-4 py-3">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold flex items-center gap-1.5">
                <Heart className="h-3 w-3 text-primary" />
                Notas
              </p>
              {!editingNotes && (
                <button
                  type="button"
                  onClick={startEditNotes}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Editar notas"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {editingNotes ? (
              <div className="space-y-2">
                <Textarea
                  value={notesValue}
                  onChange={(e) => setNotesValue(e.target.value)}
                  placeholder="Preferencias, alergias, observaciones..."
                  className="min-h-[72px] bg-card"
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button size="sm" className="gap-1.5 h-8" onClick={saveNotes}>
                    <Check className="h-3.5 w-3.5" />
                    Guardar
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1.5 h-8" onClick={cancelNotes}>
                    <X className="h-3.5 w-3.5" />
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm mt-1 text-foreground/80">
                {client.notes || (
                  <span className="text-muted-foreground italic">Sin notas. Haz clic en el lápiz para agregar.</span>
                )}
              </p>
            )}
          </div>

          {/* Fotos antes/después */}
          <BeforeAfterSection clientId={clientId} />
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Historial + Paquete */}
        <div className="lg:col-span-2 space-y-5">
          {pkg && pkgData && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-primary" />
                    Paquete activo
                  </CardTitle>
                  <Badge variant="soft">
                    Sesión {pkg.sessionsUsed} de {pkg.sessionsTotal}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-semibold">{pkgData.name}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                    {pkgData.description}
                  </p>
                </div>
                <Progress value={(pkg.sessionsUsed / pkg.sessionsTotal) * 100} className="h-3" />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Iniciado {formatDate(pkg.startedAt)}</span>
                  <span className="font-semibold text-foreground">
                    {pkg.sessionsTotal - pkg.sessionsUsed} sesiones restantes
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Historial de visitas</CardTitle>
              <p className="text-xs text-muted-foreground">
                {past.length} servicios atendidos · {future.length} citas próximas
              </p>
            </CardHeader>
            <CardContent>
              {past.length === 0 && future.length === 0 && (
                <p className="text-sm text-muted-foreground py-4">Aún no hay visitas registradas.</p>
              )}
              <div className="space-y-3">
                {future.map((b) => {
                  const svc = getService(b.serviceId)!
                  return (
                    <div
                      key={b.id}
                      className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3"
                    >
                      <div className="h-2 w-2 rounded-full bg-primary animate-pulse-soft shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{svc.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(b.startsAt, { weekday: 'long' })} · {formatDate(b.startsAt)}
                        </p>
                      </div>
                      <Badge variant="soft">Próxima</Badge>
                    </div>
                  )
                })}
                {past.slice(0, 6).map((b) => {
                  const svc = getService(b.serviceId)!
                  return (
                    <div key={b.id} className="flex items-center gap-3 py-2">
                      <div className="h-2 w-2 rounded-full bg-muted shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{svc.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(b.startsAt)}
                          {b.notes && ` · ${b.notes}`}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {formatCurrency(svc.price)}
                      </span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Triggers IA */}
        <Card className="bg-gradient-soft border-primary/30 h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Triggers IA
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Sugerencias automáticas de venta cruzada y retención
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {clientTriggers.length === 0 && (
              <p className="text-xs text-muted-foreground py-4">
                Sin alertas activas. Todo en orden 🌸
              </p>
            )}
            {clientTriggers.map((t) => {
              const alreadySent = sentTriggers.has(t.id)
              return (
                <div key={t.id} className="rounded-xl bg-card border border-border/60 p-3">
                  <Badge variant="soft" className="text-[10px] mb-2">
                    {TRIGGER_TYPE_LABELS[t.type]}
                  </Badge>
                  <p className="text-sm font-semibold leading-tight">{t.title}</p>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                    {t.suggestion}
                  </p>
                  <Separator className="my-3" />
                  {alreadySent ? (
                    <Badge variant="success" className="w-full justify-center py-1.5 text-xs">
                      <Check className="h-3 w-3 mr-1" />
                      Enviado ✓
                    </Badge>
                  ) : (
                    <Button
                      size="sm"
                      className="w-full gap-1.5 h-8"
                      onClick={() => handleWhatsAppTrigger(t.id, t.suggestion)}
                    >
                      <Send className="h-3 w-3" />
                      Enviar por WhatsApp
                    </Button>
                  )}
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      <PromoDialog
        open={promoOpen}
        onOpenChange={setPromoOpen}
        clientName={client.name}
        clientPhone={client.phone}
      />
    </div>
  )
}
