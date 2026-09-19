import { useEffect, useState } from 'react'

interface CaptchaSeguridadProps {
  onValidate: (valido: boolean) => void
}

const CARACTERES = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function generarCodigo(): string {
  let codigo = ''
  for (let i = 0; i < 6; i++) {
    codigo += CARACTERES[Math.floor(Math.random() * CARACTERES.length)]
  }
  return codigo
}

export default function CaptchaSeguridad({ onValidate }: CaptchaSeguridadProps) {
  const [codigo, setCodigo] = useState(generarCodigo)
  const [valor, setValor] = useState('')

  useEffect(() => {
    onValidate(valor.trim().toUpperCase() === codigo && valor.trim().length > 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valor, codigo])

  const refrescar = () => {
    setCodigo(generarCodigo())
    setValor('')
  }

  return (
    <div>
      <span className="block text-xs font-medium text-slate-700 mb-1.5">
        Digite los caracteres de seguridad *
      </span>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <div className="relative flex shrink-0 select-none items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-100 px-4 py-2.5">
          <div
            className="pointer-events-none absolute inset-0 opacity-25"
            style={{
              backgroundImage:
                'repeating-linear-gradient(115deg, #64748b 0, #64748b 1px, transparent 1px, transparent 7px)',
            }}
          />
          <span className="relative flex gap-1 font-mono text-base font-bold italic tracking-widest text-slate-600">
            {codigo.split('').map((c, i) => (
              <span
                key={`${c}-${i}`}
                className="inline-block"
                style={{
                  transform: `rotate(${(i % 2 === 0 ? 1 : -1) * (8 + ((i * 5) % 12))}deg) translateY(${(i % 3) - 1}px)`,
                }}
              >
                {c}
              </span>
            ))}
          </span>
          <button
            type="button"
            onClick={refrescar}
            className="relative ml-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-slate-500 hover:bg-white hover:text-vinotinto transition-colors"
            aria-label="Generar nuevo código de seguridad"
            title="Generar nuevo código"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
        <input
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          required
          placeholder="Ingrese el código mostrado"
          className="w-full flex-1 rounded-lg border border-slate-200 bg-white px-3.5 py-2 font-mono text-xs uppercase tracking-wide text-slate-900 placeholder:text-slate-400 placeholder:normal-case focus:border-slate-400 focus:ring-1 focus:ring-slate-400 focus:outline-none transition-all"
        />
      </div>
    </div>
  )
}
