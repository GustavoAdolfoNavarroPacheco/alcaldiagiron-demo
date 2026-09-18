export default function Escudo({ className = 'h-9 w-9' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <circle cx="32" cy="32" r="30" fill="#1C1B17" />
      <circle cx="32" cy="32" r="30" fill="none" stroke="#C98A1E" strokeWidth="2" />
      <path d="M32 14l12 7v11c0 9-5.5 15-12 18-6.5-3-12-9-12-18V21l12-7z" fill="#C98A1E" />
      <path d="M32 20l7 4v7c0 5.5-3.3 9.3-7 11-3.7-1.7-7-5.5-7-11v-7l7-4z" fill="#1C1B17" />
    </svg>
  )
}
