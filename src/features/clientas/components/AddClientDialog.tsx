'use client'

import { useState, useRef } from 'react'
import { UserPlus, Camera, X, Plus } from 'lucide-react'
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
  before: string[]
  after: string[]
}

const EMPTY_FORM = {
  name: '',
  phone: '',
  email: '',
  notes: '',
}

const EMPTY_PHOTOS: PhotoState = { before: [], after: [] }

export function AddClientDialog({ open, onOpenChange }: Props) {
  const addClient = useClientsStore((s) => s.addClient)
  const addPhoto = useClientsStore((s) => s.addPhoto)

  const [form, setForm] = useState(EMPTY_FORM)
  const [photos, setPhotos] = useState<PhotoState>(EMPTY_PHOTOS)
  const [error, setError] = useState('')

  const beforeRef = useRef<HTMLInputElement>(null)
  const afterRef = useRef<HTMLInputElement>(null)

  function reset() {
    setForm(EMPTY_FORM)
    setPhotos(EMPTY_PHOTOS)
    setError('')
  }

  function handleClose(open: boolean) {
    if (!open) reset()
    onOpenChange(open)
  }

  function handleFiles(type: 'before' | 'after', files: FileList | null) {
    if (!files || files.length === 0) return
    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string
        setPhotos((prev) => ({ ...prev, [type]: [...prev[type], dataUrl] }))
      }
      reader.readAsDataURL(file)
    })
  }

  function removePhoto(type: 'before' | 'after', index: number) {
    setPhotos((prev) => ({ ...prev, [type]: prev[type].filter((_, i) => i !== index) }))
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
    photos.before.forEach((url) => addPhoto(id, 'before', url))
    photos.after.forEach((url) => addPhoto(id, 'after', url))
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
              Fotos (puedes subir varias)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <PhotoUploadColumn
                label="Antes"
                photos={photos.before}
                inputRef={beforeRef}
                onAdd={() => beforeRef.current?.click()}
                onRemove={(i) => removePhoto('before', i)}
                onFiles={(files) => handleFiles('before', files)}
              />
              <PhotoUploadColumn
                label="Después"
                photos={photos.after}
                inputRef={afterRef}
                onAdd={() => afterRef.current?.click()}
                onRemove={(i) => removePhoto('after', i)}
                onFiles={(files) => handleFiles('after', files)}
              />
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

function PhotoUploadColumn({
  label,
  photos,
  inputRef,
  onAdd,
  onRemove,
  onFiles,
}: {
  label: string
  photos: string[]
  inputRef: React.RefObject<HTMLInputElement | null>
  onAdd: () => void
  onRemove: (index: number) => void
  onFiles: (files: FileList | null) => void
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs text-muted-foreground font-medium">{label}</p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          onFiles(e.target.files)
          e.target.value = ''
        }}
      />
      <div className="grid grid-cols-3 gap-1.5">
        {photos.map((url, i) => (
          <div key={i} className="relative group aspect-square">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={`${label} ${i + 1}`}
              className="w-full h-full object-cover rounded-lg border border-border/60"
            />
            <button
              type="button"
              onClick={() => onRemove(i)}
              className="absolute top-0.5 right-0.5 rounded-full bg-foreground/70 p-0.5 text-background hover:bg-destructive transition-colors"
            >
              <X className="h-2.5 w-2.5" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={onAdd}
          className="aspect-square rounded-lg border-2 border-dashed border-border/60 flex flex-col items-center justify-center gap-0.5 text-muted-foreground hover:border-primary/50 hover:bg-primary/5 transition-colors"
        >
          {photos.length === 0 ? (
            <>
              <Camera className="h-4 w-4" />
              <span className="text-[9px] font-medium">Subir</span>
            </>
          ) : (
            <Plus className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  )
}
