import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Escudo from './Escudo'

interface AdminLoginModalProps {
  onClose: () => void
}

export default function AdminLoginModal({ onClose }: AdminLoginModalProps) {
  const [validando, setValidando] = useState(false)
  const navigate = useNavigate()

  const handleIngresar = () => {
    setValidando(true)
    window.setTimeout(() => {
      navigate('/admin')
    }, 700)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div
        onClick={onClose}
        className="absolute inset-0 animate-fade-in bg-ink/60 backdrop-blur-sm"
        aria-hidden="true"
      />

      <div className="relative w-full max-w-sm animate-fade-up rounded-2xl border border-slate-200 bg-white p-7 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          aria-label="Cerrar"
        >
          ✕
        </button>

        <div className="flex flex-col items-center text-center">
          <Escudo className="h-12" />

          <div className="mt-4 flex h-11 w-11 items-center justify-center rounded-full bg-vinotinto/10">
            <svg className="h-5 w-5 text-vinotinto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 10-8 0v2"
              />
            </svg>
          </div>

          <h2 className="mt-3 font-display text-lg font-semibold text-slate-900">
            Acceso Administrador
          </h2>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
            Entorno de demostración. La autenticación institucional está
            simulada: no se requiere usuario ni contraseña para continuar.
          </p>
        </div>

        <button
          type="button"
          onClick={handleIngresar}
          disabled={validando}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-vinotinto px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-vinotinto-dark disabled:opacity-70"
        >
          {validando ? (
            <>
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Validando sesión…
            </>
          ) : (
            'Ingresar al Panel Administrativo'
          )}
        </button>

        <button
          type="button"
          onClick={onClose}
          className="mt-2 w-full rounded-lg px-4 py-2 text-xs font-medium text-slate-400 transition-colors hover:text-slate-600"
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}
