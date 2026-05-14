'use client'

import { useState } from 'react'
import { Package, AlertTriangle, XCircle, CheckCircle2, ShoppingCart, Building2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  PRODUCT_CATEGORY_LABELS,
  PRODUCT_UNIT_LABELS,
  isLowStock,
  isOutOfStock,
} from '@/shared/mock'
import type { Product } from '@/shared/mock'
import { formatCurrency } from '@/lib/utils'

interface Props {
  product: Product | null
  onClose: () => void
}

export function ProductDetailDialog({ product, onClose }: Props) {
  const [reordered, setReordered] = useState(false)

  function handleOpenChange(open: boolean) {
    if (!open) {
      onClose()
      // Reset reorder state after dialog closes
      setTimeout(() => setReordered(false), 300)
    }
  }

  if (!product) return null

  const out = isOutOfStock(product)
  const low = isLowStock(product)
  const totalValue = product.currentStock * product.costPerUnit

  return (
    <Dialog open={!!product} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 pr-6">
            <Package className="h-5 w-5 text-primary shrink-0" />
            <span className="leading-snug">{product.name}</span>
          </DialogTitle>
          {product.brand && (
            <p className="text-sm text-muted-foreground pl-7">{product.brand}</p>
          )}
        </DialogHeader>

        <div className="space-y-4 pt-1">
          {/* Category + Status badges */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="soft">
              {PRODUCT_CATEGORY_LABELS[product.category]}
            </Badge>
            {out ? (
              <Badge variant="destructive" className="gap-1">
                <XCircle className="h-3 w-3" />
                Sin stock
              </Badge>
            ) : low ? (
              <Badge variant="warning" className="gap-1">
                <AlertTriangle className="h-3 w-3" />
                Stock bajo
              </Badge>
            ) : (
              <Badge variant="success" className="gap-1">
                <CheckCircle2 className="h-3 w-3" />
                En stock
              </Badge>
            )}
          </div>

          {/* Big stock display */}
          <div className="rounded-xl bg-gradient-soft border border-border/60 p-4 text-center">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold mb-1">
              Stock actual
            </p>
            <p className={`font-display text-4xl font-bold ${out ? 'text-destructive' : low ? 'text-amber-600' : 'text-foreground'}`}>
              {product.currentStock}
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">
              {PRODUCT_UNIT_LABELS[product.unit]}
            </p>
          </div>

          <Separator />

          {/* Detail rows */}
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Mínimo requerido</span>
              <span className="font-semibold">
                {product.minStock} {PRODUCT_UNIT_LABELS[product.unit]}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Costo por {PRODUCT_UNIT_LABELS[product.unit]}</span>
              <span className="font-semibold">{formatCurrency(product.costPerUnit)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Valor total en stock</span>
              <span className="font-bold text-primary">{formatCurrency(totalValue)}</span>
            </div>
            {product.lastRestockAt && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Último restock</span>
                <span className="font-semibold">
                  {new Date(product.lastRestockAt).toLocaleDateString('es-US', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
            )}
            {product.supplier && (
              <div className="flex justify-between items-center gap-3">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5" />
                  Proveedor
                </span>
                <span className="font-semibold text-right">{product.supplier}</span>
              </div>
            )}
          </div>

          <Separator />

          {/* Reorder button */}
          {reordered ? (
            <div className="rounded-xl bg-success/10 border border-success/30 px-4 py-3 text-sm text-success font-medium flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
              <span>
                Solicitud de reorden enviada al proveedor. Te avisaremos cuando llegue el stock.
              </span>
            </div>
          ) : (
            <Button
              className="w-full gap-2"
              onClick={() => setReordered(true)}
            >
              <ShoppingCart className="h-4 w-4" />
              Reordenar ahora
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
