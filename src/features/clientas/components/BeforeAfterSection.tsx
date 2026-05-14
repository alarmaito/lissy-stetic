'use client'

import { useRef, useState } from 'react'
import { Camera, X, Plus, ImageIcon } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useClientsStore } from '../store/clientsStore'

interface Props {
  clientId: string
}

export function BeforeAfterSection({ clientId }: Props) {
  const photos = useClientsStore((s) => s.photos[clientId])
  const addPhoto = useClientsStore((s) => s.addPhoto)
  const removePhoto = useClientsStore((s) => s.removePhoto)

  const beforeRef = useRef<HTMLInputElement>(null)
  const afterRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const before = photos?.before ?? []
  const after = photos?.after ?? []

  function handleFiles(type: 'before' | 'after', files: FileList | null) {
    if (!files || files.length === 0) return
    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string
        addPhoto(clientId, type, dataUrl)
      }
      reader.readAsDataURL(file)
    })
  }

  return (
    <div className="mt-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold flex items-center gap-1.5">
          <ImageIcon className="h-3 w-3 text-primary" />
          Fotos antes / después
        </p>
        <p className="text-[10px] text-muted-foreground">
          {before.length + after.length} fotos guardadas
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <PhotoColumn
          label="Antes"
          photos={before}
          inputRef={beforeRef}
          onAdd={() => beforeRef.current?.click()}
          onRemove={(i) => removePhoto(clientId, 'before', i)}
          onPreview={setPreview}
          onFiles={(files) => handleFiles('before', files)}
        />
        <PhotoColumn
          label="Después"
          photos={after}
          inputRef={afterRef}
          onAdd={() => afterRef.current?.click()}
          onRemove={(i) => removePhoto(clientId, 'after', i)}
          onPreview={setPreview}
          onFiles={(files) => handleFiles('after', files)}
        />
      </div>

      {/* Preview modal */}
      <Dialog open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
        <DialogContent className="max-w-2xl p-2">
          {preview && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Vista previa" className="w-full h-auto rounded-lg" />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function PhotoColumn({
  label,
  photos,
  inputRef,
  onAdd,
  onRemove,
  onPreview,
  onFiles,
}: {
  label: string
  photos: string[]
  inputRef: React.RefObject<HTMLInputElement | null>
  onAdd: () => void
  onRemove: (index: number) => void
  onPreview: (url: string) => void
  onFiles: (files: FileList | null) => void
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
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
      <div className="grid grid-cols-3 gap-2">
        {photos.map((url, i) => (
          <div key={i} className="relative group aspect-square">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={`${label} ${i + 1}`}
              className="w-full h-full object-cover rounded-lg border border-border/60 shadow-soft cursor-pointer"
              onClick={() => onPreview(url)}
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onRemove(i)
              }}
              className="absolute top-1 right-1 rounded-full bg-foreground/70 p-0.5 text-background opacity-0 group-hover:opacity-100 hover:bg-destructive transition-all"
              aria-label="Eliminar foto"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={onAdd}
          className="aspect-square rounded-lg border-2 border-dashed border-border/60 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-primary/50 hover:bg-primary/5 transition-colors"
          aria-label={`Agregar foto ${label.toLowerCase()}`}
        >
          {photos.length === 0 ? (
            <>
              <Camera className="h-5 w-5" />
              <span className="text-[10px] font-medium">Subir</span>
            </>
          ) : (
            <Plus className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  )
}
