export default function Escudo({ className = 'h-9' }: { className?: string }) {
  return (
    <img
      src="/escudo-giron.svg"
      alt="Escudo del Municipio de Girón"
      className={`w-auto object-contain ${className}`}
    />
  )
}
