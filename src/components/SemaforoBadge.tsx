import type { AuditoriaPQRS, NivelUrgencia } from '../types'

const CONFIG: Record<string, { dot: string; text: string; bg: string }> = {
  rojo: { dot: 'dot-rojo', text: 'text-semaforo-rojo', bg: 'bg-semaforo-rojo/10' },
  naranja: { dot: 'dot-naranja', text: 'text-semaforo-naranja', bg: 'bg-semaforo-naranja/10' },
  amarillo: { dot: 'dot-amarillo', text: 'text-semaforo-amarillo', bg: 'bg-semaforo-amarillo/10' },
  verde: { dot: 'dot-verde', text: 'text-semaforo-verde', bg: 'bg-semaforo-verde/10' },
  azul: { dot: 'dot-azul', text: 'text-semaforo-azul', bg: 'bg-semaforo-azul/10' },
}

const CONFIG_DEUDOR: Record<NivelUrgencia, string> = {
  rojo: 'Cuantía crítica',
  naranja: 'Cuantía alta',
  amarillo: 'Cuantía moderada',
  verde: 'Cuantía menor',
}

const CONFIG_PQRS: Record<AuditoriaPQRS, string> = {
  verde: 'Cumplido a tiempo',
  azul: 'Cumplido fuera de términos',
  amarillo: 'Pendiente, dentro del plazo',
  rojo: 'Vencido, no cumplido',
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
  return (
    <span className="relative inline-flex h-2.5 w-2.5">
      {pulse && (
        <span className={`absolute inline-flex h-full w-full animate-pulse-ring rounded-full ${CONFIG[nivel]?.dot ?? 'dot-verde'}`} />
      )}
      <span className={`relative inline-block h-2.5 w-2.5 rounded-full ${CONFIG[nivel]?.dot ?? 'dot-verde'} ${className}`} />
    </span>
  )
}

export function DeudorUrgenciaBadge({ nivel }: { nivel: NivelUrgencia }) {
  const c = CONFIG[nivel]
  return (
    <span className={`inline-flex items-center gap-2 rounded-full ${c.bg} px-2.5 py-1 font-mono text-xs font-semibold uppercase tracking-wide ${c.text}`}>
      <SemaforoDot nivel={nivel} pulse={nivel === 'rojo'} />
      {CONFIG_DEUDOR[nivel]}
    </span>
  )
}

export function PQRSAuditoriaBadge({ nivel }: { nivel: AuditoriaPQRS }) {
  const c = CONFIG[nivel]
  return (
    <span className={`inline-flex items-center gap-2 rounded-full ${c.bg} px-2.5 py-1 font-mono text-xs font-semibold uppercase tracking-wide ${c.text}`}>
      <SemaforoDot nivel={nivel} pulse={nivel === 'rojo'} />
      {CONFIG_PQRS[nivel]}
    </span>
  )
}
