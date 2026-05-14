'use client'

import { useState, useRef } from 'react'
import { UserPlus, Camera, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useClientsStore } from '../store/clientsStore'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface PhotoState {
  before: string | null
  after: string | null
}

const EMPTY_FORM = {
  name: '',
  phone: '',
  email: '',
  notes: '',
}

export function AddClientDialog({ open, onOpenChange }: Props) {
  const addClient = useClientsStore((s) => s.addClient)
  const addPhoto = useClientsStore((s) => s.addPhoto)

  const [form, setForm] = useState(EMPTY_FORM)
  const [photos, setPhotos] = useState<PhotoState>({ before: null, after: null })
  const [error, setError] = useState('')

  const beforeRef = useRef<HTMLInputElement>(null)
  const afterRef = useRef<HTMLInputElement>(null)

  function reset() {
    setForm(EMPTY_FORM)
    setPhotos({ before: null, after: null })
    setError('')
  }

  function handleClose(open: boolean) {
    if (!open) reset()
    onOpenChange(open)
  }

  function handleFileChange(type: 'before' | 'after', file: File | undefined) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      setPhotos((prev) => ({ ...prev, [type]: dataUrl }))
    }
    reader.readAsDataURL(file)
  }

  function handleSubmit() {
    if (!form.name.trim()) {
      setError('El nombre es obligatorio.')
      return
    }
    const id = addClient({
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      notes: form.notes.trim() || undefined,
    })
    if (photos.before) addPhoto(id, 'before', photos.before)
    if (photos.after) addPhoto(id, 'after', photos.after)
    handleClose(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            Nueva clienta
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 pt-1">
          {/* Nombre */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Nombre
            </label>
            <Input
              placeholder="Nombre completo"
              value={form.name}
              onChange={(e) => { setForm((f) => ({ ...f, name: e.target.value })); setError('') }}
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>

          {/* Teléfono */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Teléfono
            </label>
            <Input
              placeholder="+1 (801) 555-0000"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            />
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Email
            </label>
            <Input
              type="email"
              placeholder="correo@ejemplo.com"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
          </div>

          {/* Notas */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Notas
            </label>
            <Textarea
              placeholder="Preferencias, alergias, observaciones..."
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            />
          </div>

          {/* Fotos */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Fotos
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Antes */}
              <div className="space-y-1.5">
                <p className="text-xs text-muted-foreground font-medium">Antes</p>
                <input
                  ref={beforeRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange('before', e.target.files?.[0])}
                />
                {photos.before ? (
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photos.before}
                      alt="Antes"
                      className="w-full h-28 object-cover rounded-xl border border-border/60"
                    />
                    <button
                      type="button"
                      onClick={() => setPhotos((p) => ({ ...p, before: null }))}
                      className="absolute top-1 right-1 rounded-full bg-foreground/60 p-0.5 text-background hover:bg-destructive transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => beforeRef.current?.click()}
                    className="w-full h-28 rounded-xl border-2 border-dashed border-border/60 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary/50 hover:bg-primary/5 transition-colors"
                  >
                    <Camera className="h-5 w-5" />
                    <span className="text-xs font-medium">Subir foto</span>
                  </button>
                )}
              </div>

              {/* Después */}
              <div className="space-y-1.5">
                <p className="text-xs text-muted-foreground font-medium">Después</p>
                <input
                  ref={afterRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange('after', e.target.files?.[0])}
                />
                {photos.after ? (
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photos.after}
                      alt="Después"
                      className="w-full h-28 object-cover rounded-xl border border-border/60"
                    />
                    <button
                      type="button"
                      onClick={() => setPhotos((p) => ({ ...p, after: null }))}
                      className="absolute top-1 right-1 rounded-full bg-foreground/60 p-0.5 text-background hover:bg-destructive transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => afterRef.current?.click()}
                    className="w-full h-28 rounded-xl border-2 border-dashed border-border/60 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary/50 hover:bg-primary/5 transition-colors"
                  >
                    <Camera className="h-5 w-5" />
                    <span className="text-xs font-medium">Subir foto</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => handleClose(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            Agregar clienta
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
