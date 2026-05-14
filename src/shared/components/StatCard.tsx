import { type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: string
  hint?: string
  trend?: { value: string; positive?: boolean }
  variant?: 'default' | 'gradient'
  className?: string
}

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  trend,
  variant = 'default',
  className,
}: StatCardProps) {
  return (
    <Card
      className={cn(
        'p-5 relative overflow-hidden',
        variant === 'gradient' && 'bg-gradient-rose text-primary-foreground border-transparent shadow-glow',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <p
            className={cn(
              'text-xs font-medium uppercase tracking-wide',
              variant === 'gradient' ? 'text-primary-foreground/80' : 'text-muted-foreground'
            )}
          >
            {label}
          </p>
          <p
            className={cn(
              'font-display text-2xl lg:text-[28px] font-bold leading-tight',
              variant === 'gradient' ? 'text-primary-foreground' : 'text-foreground'
            )}
          >
            {value}
          </p>
          {hint && (
            <p
              className={cn(
                'text-xs',
                variant === 'gradient' ? 'text-primary-foreground/85' : 'text-muted-foreground'
              )}
            >
              {hint}
            </p>
          )}
        </div>
        <div
          className={cn(
            'h-10 w-10 shrink-0 rounded-xl flex items-center justify-center',
            variant === 'gradient'
              ? 'bg-white/20 text-primary-foreground'
              : 'bg-secondary text-primary'
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {trend && (
        <div
          className={cn(
            'mt-3 inline-flex items-center gap-1 text-xs font-semibold',
            variant === 'gradient'
              ? 'text-primary-foreground/95'
              : trend.positive
                ? 'text-success'
                : 'text-destructive'
          )}
        >
          {trend.value}
        </div>
      )}
    </Card>
  )
}
