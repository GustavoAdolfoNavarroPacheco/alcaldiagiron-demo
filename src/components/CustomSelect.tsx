import { useState, useRef, useEffect } from 'react'

export interface SelectOption {
  value: string
  label: string
}

interface CustomSelectProps {
  value: string
  onChange: (value: string) => void
  options: (string | SelectOption)[]
  placeholder?: string
  id?: string
  className?: string
  disabled?: boolean
}

export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder = 'Seleccionar...',
  id,
  className = '',
  disabled = false,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Normalizar opciones (pueden ser strings o { value, label })
  const normalizedOptions: SelectOption[] = options.map((opt) =>
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  )

  const selectedOption = normalizedOptions.find((opt) => opt.value === value)

  // Manejador para cerrar al hacer clic afuera
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  function handleSelect(val: string) {
    onChange(val)
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Botón desencadenante (Trigger) estilizado al diseño de la página */}
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full rounded-xl border bg-paper-card px-3.5 py-2.5 text-xs sm:text-sm text-ink shadow-sm transition-all duration-200 ease-out flex items-center justify-between cursor-pointer text-left focus:outline-none ${
          isOpen
            ? 'border-vinotinto ring-2 ring-vinotinto/15 shadow-glow-vinotinto'
            : 'border-ink/15 hover:border-vinotinto/40'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span className={`truncate font-medium ${selectedOption ? 'text-ink' : 'text-ink-faint/60'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        <span className="ml-2 flex items-center shrink-0">
          <svg
            className={`h-4 w-4 text-ink-faint transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-vinotinto' : ''
            }`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>

      {/* Popover desplegable con opciones estilizadas */}
      {isOpen && (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-full mt-1.5 z-50 max-h-60 overflow-y-auto rounded-xl border border-ink/10 bg-paper-card p-1 shadow-card animate-fade-in scrollbar-thin"
        >
          {normalizedOptions.map((opt) => {
            const isSelected = opt.value === value

            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(opt.value)}
                className={`w-full flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors text-left ${
                  isSelected
                    ? 'bg-vinotinto-soft text-vinotinto font-semibold border-l-2 border-vinotinto'
                    : 'text-ink-soft hover:bg-vinotinto-soft/60 hover:text-vinotinto'
                }`}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected && (
                  <svg
                    className="h-3.5 w-3.5 text-vinotinto shrink-0 ml-2"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
