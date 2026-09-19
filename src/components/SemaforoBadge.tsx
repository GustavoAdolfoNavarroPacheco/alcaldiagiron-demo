import type { AuditoriaPQRS, NivelUrgencia } from '../types'

interface EstiloSemaforo {
  dot: string
  ring: string
  text: string
  bg: string
  border: string
}

const CONFIG_ESTILOS: Record<string, EstiloSemaforo> = {
  rojo: {
    dot: 'bg-rose-500',
    ring: 'ring-rose-500/20',
    text: 'text-rose-700',
    bg: 'bg-rose-50/80',
    border: 'border-rose-200/80',
  },
  naranja: {
    dot: 'bg-orange-500',
    ring: 'ring-orange-500/20',
    text: 'text-orange-700',
    bg: 'bg-orange-50/80',
    border: 'border-orange-200/80',
  },
  amarillo: {
    dot: 'bg-amber-500',
    ring: 'ring-amber-500/20',
    text: 'text-amber-700',
    bg: 'bg-amber-50/80',
    border: 'border-amber-200/80',
  },
  verde: {
    dot: 'bg-emerald-500',
    ring: 'ring-emerald-500/20',
    text: 'text-emerald-700',
    bg: 'bg-emerald-50/80',
    border: 'border-emerald-200/80',
  },
  azul: {
    dot: 'bg-sky-500',
    ring: 'ring-sky-500/20',
    text: 'text-sky-700',
    bg: 'bg-sky-50/80',
    border: 'border-sky-200/80',
  },
}

const CONFIG_DEUDOR: Record<NivelUrgencia, string> = {
  rojo: 'Crítica (> $20M)',
  naranja: 'Alta ($10M - $20M)',
  amarillo: 'Moderada ($3M - $10M)',
  verde: 'Menor (< $3M)',
}

const CONFIG_PQRS: Record<AuditoriaPQRS, string> = {
  verde: 'Cumplido a tiempo',
  azul: 'Fuera de términos',
  amarillo: 'En plazo legal',
  rojo: 'Vencido',
}

export function SemaforoDot({
  nivel,
  className = '',
  pulse = false,
}: {
  nivel: string
  className?: string
  pulse?: boolean
}) {
  const c = CONFIG_ESTILOS[nivel] ?? CONFIG_ESTILOS.verde
  return (
    <span className={`relative inline-flex h-2 w-2 items-center justify-center ${className}`}>
      {pulse && (
        <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${c.dot}`} />
      )}
      <span className={`relative inline-block h-1.5 w-1.5 rounded-full ring-2 ${c.ring} ${c.dot}`} />
    </span>
  )
}

export function DeudorUrgenciaBadge({
  nivel,
  compacto = false,
}: {
  nivel: NivelUrgencia
  compacto?: boolean
}) {
  const c = CONFIG_ESTILOS[nivel] ?? CONFIG_ESTILOS.verde
  const label = CONFIG_DEUDOR[nivel]

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors ${c.bg} ${c.border} ${c.text}`}
    >
      <SemaforoDot nivel={nivel} pulse={nivel === 'rojo'} />
      <span>{compacto ? label.split(' ')[0] : label}</span>
    </span>
  )
}

export function PQRSAuditoriaBadge({ nivel }: { nivel: AuditoriaPQRS }) {
  const c = CONFIG_ESTILOS[nivel] ?? CONFIG_ESTILOS.verde
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors ${c.bg} ${c.border} ${c.text}`}
    >
      <SemaforoDot nivel={nivel} pulse={nivel === 'rojo'} />
      <span>{CONFIG_PQRS[nivel]}</span>
    </span>
  )
}
