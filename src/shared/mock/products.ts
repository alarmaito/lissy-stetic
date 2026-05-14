import type { Product, ProductCategory, ProductUnit } from './types'

export const PRODUCTS: Product[] = [
  // Cabello
  { id: 'p01', name: 'Tinte permanente 6.0 Castaño', brand: "L'Oréal Majirel", category: 'cabello', currentStock: 12, minStock: 5, unit: 'unidad', costPerUnit: 18, lastRestockAt: '2026-04-22', supplier: 'Distribuidora Belleza Inc.' },
  { id: 'p02', name: 'Tinte permanente 7.43 Rubio cobrizo', brand: "L'Oréal Majirel", category: 'cabello', currentStock: 3, minStock: 5, unit: 'unidad', costPerUnit: 18, lastRestockAt: '2026-04-22', supplier: 'Distribuidora Belleza Inc.' },
  { id: 'p03', name: 'Decolorante en polvo Platino', brand: 'Schwarzkopf BlondMe', category: 'cabello', currentStock: 800, minStock: 500, unit: 'gramo', costPerUnit: 0.12, lastRestockAt: '2026-03-15' },
  { id: 'p04', name: 'Oxidante 30 vol.', brand: 'Wella Welloxon', category: 'cabello', currentStock: 4.5, minStock: 3, unit: 'litro', costPerUnit: 22, lastRestockAt: '2026-04-10' },
  { id: 'p05', name: 'Tratamiento Olaplex N° 3', brand: 'Olaplex', category: 'cabello', currentStock: 0, minStock: 4, unit: 'unidad', costPerUnit: 38, lastRestockAt: '2026-02-28', supplier: 'Beauty Pro Supply' },
  { id: 'p06', name: 'Queratina Brasileña 1L', brand: 'Inoar G.Hair', category: 'cabello', currentStock: 2, minStock: 3, unit: 'litro', costPerUnit: 55, lastRestockAt: '2026-03-30', supplier: 'Distribuidora Belleza Inc.' },
  { id: 'p07', name: 'Shampoo profesional violeta', brand: 'Redken Color Extend', category: 'cabello', currentStock: 6, minStock: 4, unit: 'unidad', costPerUnit: 24, lastRestockAt: '2026-04-18' },
  { id: 'p08', name: 'Acondicionador hidratante', brand: 'Kerastase Nutritive', category: 'cabello', currentStock: 5, minStock: 4, unit: 'unidad', costPerUnit: 28, lastRestockAt: '2026-04-18' },
  // Masaje
  { id: 'p09', name: 'Aceite reductor de medidas', brand: 'BodyShape Pro', category: 'masaje', currentStock: 1.2, minStock: 2, unit: 'litro', costPerUnit: 32, lastRestockAt: '2026-03-25', supplier: 'MedSpa Distribuciones' },
  { id: 'p10', name: 'Crema anticelulítica intensiva', brand: 'Slimming Lab', category: 'masaje', currentStock: 4, minStock: 3, unit: 'unidad', costPerUnit: 26, lastRestockAt: '2026-04-05' },
  { id: 'p11', name: 'Gel conductor para radiofrecuencia', brand: 'MedSpa', category: 'masaje', currentStock: 0.8, minStock: 1.5, unit: 'litro', costPerUnit: 18, lastRestockAt: '2026-03-12', supplier: 'MedSpa Distribuciones' },
  { id: 'p12', name: 'Vendas frías mentoladas (caja 12u)', brand: 'CoolForm', category: 'masaje', currentStock: 8, minStock: 4, unit: 'unidad', costPerUnit: 14, lastRestockAt: '2026-04-08' },
  // Manicure
  { id: 'p13', name: 'Esmalte semipermanente Rosa nude', brand: 'OPI GelColor', category: 'manicure', currentStock: 2, minStock: 3, unit: 'unidad', costPerUnit: 16, lastRestockAt: '2026-03-20', supplier: 'Nail Pro USA' },
  { id: 'p14', name: 'Esmalte semipermanente Rojo clásico', brand: 'OPI GelColor', category: 'manicure', currentStock: 5, minStock: 3, unit: 'unidad', costPerUnit: 16, lastRestockAt: '2026-04-12' },
  { id: 'p15', name: 'Top coat brillo eterno', brand: 'OPI GelColor', category: 'manicure', currentStock: 3, minStock: 2, unit: 'unidad', costPerUnit: 18, lastRestockAt: '2026-04-12' },
  { id: 'p16', name: 'Acetona profesional', brand: 'Cuccio', category: 'manicure', currentStock: 1.5, minStock: 1, unit: 'litro', costPerUnit: 12, lastRestockAt: '2026-03-28' },
  // Consumibles
  { id: 'p17', name: 'Guantes de látex talla M (caja 100u)', brand: 'MedGlove', category: 'consumibles', currentStock: 7, minStock: 5, unit: 'unidad', costPerUnit: 9, lastRestockAt: '2026-04-15', supplier: 'Medical Supply Co.' },
  { id: 'p18', name: 'Toallas desechables (paquete 50u)', brand: 'SaloSoft', category: 'consumibles', currentStock: 12, minStock: 6, unit: 'unidad', costPerUnit: 6, lastRestockAt: '2026-04-20' },
  { id: 'p19', name: 'Capas de tinte desechables', brand: 'BeautyPro', category: 'consumibles', currentStock: 25, minStock: 30, unit: 'unidad', costPerUnit: 0.8, lastRestockAt: '2026-03-18' },
  { id: 'p20', name: 'Papel aluminio para mechas (rollo)', brand: 'FoilMax', category: 'consumibles', currentStock: 4, minStock: 2, unit: 'unidad', costPerUnit: 8, lastRestockAt: '2026-04-02' },
  { id: 'p21', name: 'Gorros plásticos para tratamiento', brand: 'SaloSoft', category: 'consumibles', currentStock: 0, minStock: 20, unit: 'unidad', costPerUnit: 0.5, lastRestockAt: '2026-02-10', supplier: 'Medical Supply Co.' },
  { id: 'p22', name: 'Algodón hidrófilo (rollo 500g)', brand: 'MedSupply', category: 'consumibles', currentStock: 3, minStock: 2, unit: 'unidad', costPerUnit: 4, lastRestockAt: '2026-04-22' },
]

export function isLowStock(p: Product): boolean {
  return p.currentStock > 0 && p.currentStock < p.minStock
}

export function isOutOfStock(p: Product): boolean {
  return p.currentStock === 0
}

export const PRODUCT_CATEGORY_LABELS: Record<ProductCategory, string> = {
  cabello: 'Cabello',
  masaje: 'Masajes',
  manicure: 'Manicure',
  consumibles: 'Consumibles',
}

export const PRODUCT_UNIT_LABELS: Record<ProductUnit, string> = {
  unidad: 'unidades',
  litro: 'L',
  gramo: 'g',
  ml: 'ml',
}
