import { formatFecha } from '../data/format'

export default function SelloRadicado({
  radicado,
  fecha,
}: {
  radicado: string
  fecha: string
}) {
  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div
        className="relative flex h-48 w-48 -rotate-3 animate-stamp-in select-none flex-col items-center justify-center rounded-full border-[3px] border-dashed border-girverde-deep text-girverde-deep shadow-[0_0_0_6px_rgba(47,74,54,0.06)] sm:h-56 sm:w-56"
        role="img"
        aria-label={`Sello de radicación número ${radicado}, fecha ${formatFecha(fecha)}`}
      >
        <span className="eyebrow text-girverde-deep/80">Alcaldía de Girón</span>
        <span className="mt-1 font-display text-sm font-semibold uppercase tracking-wide">Radicado</span>
        <span className="mt-2 break-all px-4 text-center font-mono text-base font-bold leading-tight sm:text-lg">
          {radicado}
        </span>
        <span className="mt-2 font-mono text-xs">{formatFecha(fecha)}</span>
      </div>
    </div>
  )
}
