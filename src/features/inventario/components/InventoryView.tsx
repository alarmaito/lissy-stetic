'use client'

import { useState, useMemo } from 'react'
import { Package, Search, AlertTriangle, XCircle, DollarSign, Box } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { StatCard } from '@/shared/components/StatCard'
import {
  PRODUCTS,
  PRODUCT_CATEGORY_LABELS,
  PRODUCT_UNIT_LABELS,
  isLowStock,
  isOutOfStock,
} from '@/shared/mock'
import type { Product, ProductCategory } from '@/shared/mock'
import { ProductDetailDialog } from './ProductDetailDialog'
import { formatCurrency } from '@/lib/utils'

const CATEGORY_COLORS: Record<ProductCategory, string> = {
  cabello: '#e879a0',
  masaje: '#a78bfa',
  manicure: '#fbbf24',
  consumibles: '#94a3b8',
}

type CategoryFilter = 'todos' | ProductCategory

export function InventoryView() {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('todos')
  const [onlyAlerts, setOnlyAlerts] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const stats = useMemo(() => {
    const total = PRODUCTS.length
    const totalValue = PRODUCTS.reduce((sum, p) => sum + p.currentStock * p.costPerUnit, 0)
    const lowStock = PRODUCTS.filter(isLowStock).length
    const outOfStock = PRODUCTS.filter(isOutOfStock).length
    return { total, totalValue, lowStock, outOfStock }
  }, [])

  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchSearch =
        search === '' ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.brand ?? '').toLowerCase().includes(search.toLowerCase())
      const matchCategory = categoryFilter === 'todos' || p.category === categoryFilter
      const matchAlert = !onlyAlerts || isLowStock(p) || isOutOfStock(p)
      return matchSearch && matchCategory && matchAlert
    })
  }, [search, categoryFilter, onlyAlerts])

  const CATEGORIES: { value: CategoryFilter; label: string }[] = [
    { value: 'todos', label: 'Todos' },
    { value: 'cabello', label: 'Cabello' },
    { value: 'masaje', label: 'Masajes' },
    { value: 'manicure', label: 'Manicure' },
    { value: 'consumibles', label: 'Consumibles' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold flex items-center gap-2">
          <Package className="h-6 w-6 text-primary" />
          Inventario
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Control de productos y alertas de stock
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <StatCard
          icon={Box}
          label="Total productos"
          value={String(stats.total)}
          hint="En todas las categorías"
        />
        <StatCard
          icon={DollarSign}
          label="Valor en stock"
          value={formatCurrency(stats.totalValue)}
          hint="Costo total inventario"
          variant="gradient"
        />
        <StatCard
          icon={AlertTriangle}
          label="Stock bajo"
          value={String(stats.lowStock)}
          hint="Bajo el mínimo requerido"
          trend={stats.lowStock > 0 ? { value: 'Requiere reorden', positive: false } : undefined}
        />
        <StatCard
          icon={XCircle}
          label="Sin stock"
          value={String(stats.outOfStock)}
          hint="Productos agotados"
          trend={stats.outOfStock > 0 ? { value: 'Urgente', positive: false } : undefined}
        />
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Buscar por nombre o marca..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setCategoryFilter(cat.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                categoryFilter === cat.value
                  ? 'bg-primary text-primary-foreground border-primary shadow-glow'
                  : 'bg-card border-border/60 text-muted-foreground hover:border-primary/50 hover:text-foreground'
              }`}
            >
              {cat.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setOnlyAlerts((v) => !v)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border flex items-center gap-1.5 ${
              onlyAlerts
                ? 'bg-destructive text-destructive-foreground border-destructive'
                : 'bg-card border-border/60 text-muted-foreground hover:border-destructive/50 hover:text-foreground'
            }`}
          >
            <AlertTriangle className="h-3 w-3" />
            Solo alertas
          </button>
        </div>
      </div>

      {/* Product Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Package className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No se encontraron productos con ese filtro.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => setSelectedProduct(product)}
            />
          ))}
        </div>
      )}

      {/* Detail Dialog */}
      <ProductDetailDialog
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  )
}

function ProductCard({ product, onClick }: { product: Product; onClick: () => void }) {
  const out = isOutOfStock(product)
  const low = isLowStock(product)
  const color = CATEGORY_COLORS[product.category]

  // Progress: minStock = 50% of bar. Cap at 100.
  const progressValue = Math.min((product.currentStock / product.minStock) * 50, 100)

  const progressColor = out
    ? 'bg-destructive'
    : low
      ? 'bg-amber-500'
      : 'bg-primary'

  return (
    <Card
      className="relative cursor-pointer hover:shadow-lift transition-all hover:-translate-y-0.5 overflow-hidden"
      onClick={onClick}
    >
      {/* Status badge top-right */}
      <div className="absolute top-3 right-3 z-10">
        {out ? (
          <Badge variant="destructive" className="text-[10px] gap-1">
            <XCircle className="h-2.5 w-2.5" />
            Sin stock
          </Badge>
        ) : low ? (
          <Badge variant="warning" className="text-[10px] gap-1">
            <AlertTriangle className="h-2.5 w-2.5" />
            Stock bajo
          </Badge>
        ) : (
          <Badge variant="success" className="text-[10px]">
            OK
          </Badge>
        )}
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Category + name */}
        <div className="pr-16">
          <div className="flex items-center gap-1.5 mb-1">
            <span
              className="inline-block h-2 w-2 rounded-full shrink-0"
              style={{ background: color }}
            />
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
              {PRODUCT_CATEGORY_LABELS[product.category]}
            </span>
          </div>
          <p className="font-display font-bold text-sm leading-snug">{product.name}</p>
          {product.brand && (
            <p className="text-xs text-muted-foreground mt-0.5">{product.brand}</p>
          )}
        </div>

        {/* Stock bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Stock actual</span>
            <span className="font-semibold text-foreground">
              {product.currentStock} {PRODUCT_UNIT_LABELS[product.unit]}
            </span>
          </div>
          <div className="relative h-2 rounded-full bg-secondary overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${progressColor}`}
              style={{ width: `${progressValue}%` }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground">
            Mínimo: {product.minStock} {PRODUCT_UNIT_LABELS[product.unit]}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-1 border-t border-border/60">
          <span className="text-[10px] text-muted-foreground">
            {product.lastRestockAt
              ? `Restock: ${new Date(product.lastRestockAt).toLocaleDateString('es-US', { month: 'short', day: 'numeric' })}`
              : 'Sin restock registrado'}
          </span>
          <span className="text-xs font-semibold text-primary">
            {formatCurrency(product.costPerUnit)}/{PRODUCT_UNIT_LABELS[product.unit]}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
