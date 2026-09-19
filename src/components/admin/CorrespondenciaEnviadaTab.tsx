import type { PQRS } from '../../types'
import { formatFecha } from '../../data/format'

interface CorrespondenciaEnviadaTabProps {
  items: PQRS[]
}

export default function CorrespondenciaEnviadaTab({ items }: CorrespondenciaEnviadaTabProps) {
  const enviadas = items
    .filter((p) => p.estado === 'Resuelta' && p.fechaRespuesta)
    .sort((a, b) => (b.fechaRespuesta ?? '').localeCompare(a.fechaRespuesta ?? ''))

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <p className="text-xs text-slate-500">
          Registro de las notificaciones y respuestas oficiales despachadas por la administración hacia los
          ciudadanos y entidades remitentes. Cada salida queda vinculada al radicado de origen.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              <th className="px-5 py-3.5">Radicado</th>
              <th className="px-5 py-3.5">Destinatario</th>
              <th className="px-5 py-3.5">Correo de Notificación</th>
              <th className="px-5 py-3.5">Fecha de Envío</th>
              <th className="px-5 py-3.5">Asunto Respondido</th>
              <th className="px-5 py-3.5">Funcionario Firmante</th>
              <th className="px-5 py-3.5">Soporte</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {enviadas.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-5 py-3.5 font-semibold text-slate-900">{p.radicado}</td>
                <td className="px-5 py-3.5 text-slate-800">
                  {p.solicitante}
                  <p className="text-[11px] text-slate-400 font-mono">CC: {p.documentoSolicitante}</p>
                </td>
                <td className="px-5 py-3.5 font-mono text-slate-600">{p.correo || '—'}</td>
                <td className="px-5 py-3.5 font-mono text-slate-600">
                  {p.fechaRespuesta ? formatFecha(p.fechaRespuesta) : '—'}
                </td>
                <td className="px-5 py-3.5 text-slate-700 max-w-xs">
                  <p className="line-clamp-1">{p.asunto}</p>
                </td>
                <td className="px-5 py-3.5 text-slate-600">
                  {p.funcionarioDestino ?? `Despacho de ${p.dependencia}`}
                </td>
                <td className="px-5 py-3.5 text-slate-600 font-mono">
                  {p.archivoAdjunto ?? 'RespuestaOficial_Firmada.pdf'}
                </td>
              </tr>
            ))}

            {enviadas.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-slate-500">
                  <p className="text-sm font-semibold text-slate-900">Aún no se ha despachado correspondencia de salida</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Cuando resuelva un radicado desde la bandeja, aparecerá aquí como comunicación enviada.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
