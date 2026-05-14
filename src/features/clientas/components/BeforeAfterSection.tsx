'use client'

import { useRef } from 'react'
import { Camera } from 'lucide-react'
import { useClientsStore } from '../store/clientsStore'

interface Props {
  clientId: string
}

export function BeforeAfterSection({ clientId }: Props) {
  const photos = useClientsStore((s) => s.photos[clientId])
  const addPhoto = useClientsStore((s) => s.addPhoto)

  const beforeRef = useRef<HTMLInputElement>(null)
  const afterRef = useRef<HTMLInputElement>(null)

  function handleFileChange(type: 'before' | 'after', file: File | undefined) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      addPhoto(clientId, type, dataUrl)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="mt-5">
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold mb-3">
        Fotos antes / después
      </p>
      <div className="grid grid-cols-2 gap-4">
        {/* Antes */}
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">Antes</p>
          <input
            ref={beforeRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileChange('before', e.target.files?.[0])}
          />
          {photos?.before ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photos.before}
              alt="Antes"
              className="w-full h-40 object-cover rounded-xl border border-border/60 shadow-soft"
            />
          ) : (
            <button
              type="button"
              onClick={() => beforeRef.current?.click()}
              className="w-full h-40 rounded-xl border-2 border-dashed border-border/60 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary/50 hover:bg-primary/5 transition-colors"
            >
              <Camera className="h-6 w-6" />
              <span className="text-xs font-medium">Subir foto</span>
            </button>
          )}
        </div>

        {/* Después */}
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">Después</p>
          <input
            ref={afterRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileChange('after', e.target.files?.[0])}
          />
          {photos?.after ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photos.after}
              alt="Después"
              className="w-full h-40 object-cover rounded-xl border border-border/60 shadow-soft"
            />
          ) : (
            <button
              type="button"
              onClick={() => afterRef.current?.click()}
              className="w-full h-40 rounded-xl border-2 border-dashed border-border/60 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary/50 hover:bg-primary/5 transition-colors"
            >
              <Camera className="h-6 w-6" />
              <span className="text-xs font-medium">Subir foto</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
