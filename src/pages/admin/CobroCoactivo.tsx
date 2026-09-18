import { useMemo, useState } from 'react'
import { getDeudores } from '../../data/storage'
import { nivelUrgenciaDeudor, type Deudor, type NivelUrgencia } from '../../types'
import { formatCOP, formatFecha } from '../../data/format'
import { DeudorUrgenciaBadge } from '../../components/SemaforoBadge'

const ORDEN: Record<NivelUrgencia, number> = { rojo: 0, naranja: 1, amarillo: 2, verde: 3 }

export default function CobroCoactivo() {
  const [deudores] = useState<Deudor[]>(() => getDeudores())
  const [seleccionadoId, setSeleccionadoId] = useState<string | null>(null)

  const ordenados = useMemo(
    () =>
      [...deudores].sort((a, b) => {
        const nivelDiff = ORDEN[nivelUrgenciaDeudor(a)] - ORDEN[nivelUrgenciaDeudor(b)]
        if (nivelDiff !== 0) return nivelDiff
        return b.valorCapital + b.valorIntereses - (a.valorCapital + a.valorIntereses)
      }),
    [deudores],
  )

  const seleccionado = ordenados.find((d) => d.id === seleccionadoId) ?? null

  return (
    <div>
      <p className="eyebrow animate-fade-up text-ocre-deep">Cobro coactivo</p>
      <h1 className="delay-1 mt-3 animate-fade-up font-display text-3xl font-medium text-ink">
        Deudores en proceso de cobro
      </h1>
      <p className="delay-2 mt-2 max-w-2xl animate-fade-up text-sm leading-relaxed text-ink-faint">
        Clasificación por semáforo de cuantía: rojo indica la deuda más crítica.
        Seleccione un deudor para ver su ficha consolidada.
      </p>

      <div className="delay-3 mt-8 animate-fade-up overflow-hidden rounded-2xl border border-ink/8 bg-paper-card shadow-card">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-xs uppercase tracking-wide text-ink-faint">
              <th className="px-5 py-3 font-medium">Deudor</th>
              <th className="px-5 py-3 font-medium">Concepto</th>
              <th className="px-5 py-3 font-medium">Vigencia</th>
              <th className="px-5 py-3 text-right font-medium">Capital + intereses</th>
              <th className="px-5 py-3 font-medium">Semáforo</th>
            </tr>
          </thead>
          <tbody>
            {ordenados.map((d, i) => {
              const nivel = nivelUrgenciaDeudor(d)
              return (
                <tr
                  key={d.id}
                  onClick={() => setSeleccionadoId(d.id)}
                  style={{ animationDelay: `${i * 60}ms` }}
                  className={`animate-fade-in cursor-pointer border-b border-ink/5 border-l-[3px] rail-${nivel} transition-all duration-200 last:border-b-0 hover:bg-ocre/[0.04]`}
                >
                  <td className="px-5 py-4">
                    <p className="font-medium text-ink">{d.nombre}</p>
                    <p className="font-mono text-xs text-ink-faint">{d.documento}</p>
                  </td>
                  <td className="px-5 py-4 text-ink-faint">{d.concepto}</td>
                  <td className="px-5 py-4 text-ink-faint">{d.vigenciaAdeudada}</td>
                  <td className="px-5 py-4 text-right font-mono text-ink">
                    {formatCOP(d.valorCapital + d.valorIntereses)}
                  </td>
                  <td className="px-5 py-4">
                    <DeudorUrgenciaBadge nivel={nivel} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {seleccionado && (
        <FichaDeudor key={seleccionado.id} deudor={seleccionado} onClose={() => setSeleccionadoId(null)} />
      )}
    </div>
  )
}

function FichaDeudor({ deudor, onClose }: { deudor: Deudor; onClose: () => void }) {
  const nivel = nivelUrgenciaDeudor(deudor)
  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <button
        aria-label="Cerrar ficha del deudor"
        onClick={onClose}
        className="absolute inset-0 animate-fade-in bg-ink/50 backdrop-blur-[2px]"
      />
      <div className="relative flex h-full w-full max-w-lg animate-slide-in-right flex-col overflow-y-auto rounded-l-3xl bg-paper-card shadow-2xl">
        <div className={`rounded-tl-3xl border-b border-ink/10 border-l-[3px] rail-${nivel} bg-gradient-paper p-6`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="eyebrow">Ficha del deudor</p>
              <h2 className="mt-1 font-display text-2xl font-medium text-ink">{deudor.nombre}</h2>
              <p className="mt-1 font-mono text-xs text-ink-faint">{deudor.documento}</p>
            </div>
            <button onClick={onClose} className="btn-ghost shrink-0 !px-3 !py-1.5">
              Cerrar
            </button>
          </div>
          <div className="mt-4">
            <DeudorUrgenciaBadge nivel={nivel} />
          </div>
        </div>

        <div className="space-y-8 p-6">
          <section>
            <h3 className="eyebrow">Estado de cuenta</h3>
            <dl className="mt-3 grid grid-cols-2 gap-y-2 rounded-xl border border-ink/8 bg-paper-dim/50 p-4 text-sm">
              <dt className="text-ink-faint">Concepto</dt>
              <dd className="text-ink">{deudor.concepto}</dd>
              <dt className="text-ink-faint">Vigencia adeudada</dt>
              <dd className="text-ink">{deudor.vigenciaAdeudada}</dd>
              <dt className="text-ink-faint">Capital</dt>
              <dd className="font-mono text-ink">{formatCOP(deudor.valorCapital)}</dd>
              <dt className="text-ink-faint">Intereses de mora</dt>
              <dd className="font-mono text-ink">{formatCOP(deudor.valorIntereses)}</dd>
              <dt className="font-medium text-ink">Total adeudado</dt>
              <dd className="font-mono font-semibold text-ink">
                {formatCOP(deudor.valorCapital + deudor.valorIntereses)}
              </dd>
              <dt className="text-ink-faint">Estado del proceso</dt>
              <dd className="text-ink">{deudor.estadoProceso}</dd>
            </dl>
          </section>

          <section>
            <h3 className="eyebrow">Predios asociados</h3>
            <ul className="mt-3 space-y-3">
              {deudor.predios.map((p) => (
                <li key={p.matricula} className="rounded-xl border border-ink/8 p-3.5 text-sm transition-colors hover:border-ocre/30">
                  <p className="font-mono text-xs text-ink-faint">Matrícula {p.matricula}</p>
                  <p className="mt-1 text-ink">{p.direccion}</p>
                  <p className="mt-1 text-ink-faint">Avalúo catastral: {formatCOP(p.avaluoCatastral)}</p>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="eyebrow">Historial de oficios</h3>
            <ol className="mt-3 space-y-4 border-l-2 border-ocre/20 pl-4">
              {deudor.historialOficios.map((o, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[19px] top-1 h-2.5 w-2.5 rounded-full bg-ocre ring-4 ring-ocre/15" />
                  <p className="font-mono text-xs text-ink-faint">{formatFecha(o.fecha)}</p>
                  <p className="text-sm font-medium text-ink">{o.tipo}</p>
                  <p className="text-sm text-ink-faint">{o.descripcion}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </div>
  )
}
