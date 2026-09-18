/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // --- Paleta Oficial Alcaldía de Girón ---
        vinotinto: {
          DEFAULT: '#6F1413', // Rojo colonial / Primario institucional Girón
          deep: '#4D0E0D',
          dark: '#5A1010',
          light: '#8C2220',
          soft: '#FAF0F0',
        },
        dorado: {
          DEFAULT: '#FBBB05', // Amarillo oro de acento institucional
          deep: '#D6A20E',
          light: '#FCD34D',
        },
        govco: {
          DEFAULT: '#3366CC', // Azul institucional Gov.co
          dark: '#244CA3',
        },
        a11y: {
          DEFAULT: '#00673D', // Verde botón de accesibilidad
        },
        tramiapp: {
          DEFAULT: '#092AA1', // Azul Trámi App
        },
        superficie: {
          card: '#DCDCDB',     // Fondo tarjetas secretarías
          pizarra: '#1F2937',  // Círculo oscuro para íconos
        },
        // --- Tokens existentes ---
        ink: {
          DEFAULT: '#1C1B17',
          soft: '#2A2822',
          faint: '#4A473E',
        },
        paper: {
          DEFAULT: '#FAF7EF',
          dim: '#F1ECDD',
          card: '#FFFFFF',
        },
        ocre: {
          DEFAULT: '#C98A1E',
          deep: '#8C5A0F',
          light: '#E8B764',
        },
        girverde: {
          DEFAULT: '#2F6B4F',
          deep: '#1F4A36',
          light: '#5C9A7D',
        },
        semaforo: {
          rojo: '#C0392B',
          naranja: '#D9762B',
          amarillo: '#D4A017',
          verde: '#3F8F5F',
          azul: '#3B6FA0',
        },
      },
      fontFamily: {
        display: ['"Poppins"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"Poppins"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(28,27,23,0.05), 0 8px 24px -4px rgba(28,27,23,0.10)',
        'card-hover': '0 4px 10px rgba(28,27,23,0.08), 0 20px 40px -8px rgba(28,27,23,0.18)',
        stamp: '0 2px 0 rgba(28,27,23,0.15)',
        glow: '0 8px 30px -6px rgba(201,138,30,0.45)',
        'glow-verde': '0 8px 30px -6px rgba(47,107,79,0.4)',
        'glow-vinotinto': '0 8px 30px -6px rgba(111,20,19,0.45)',
        'glow-dorado': '0 8px 30px -6px rgba(251,187,5,0.45)',
      },
      backgroundImage: {
        grain: "radial-gradient(circle at 1px 1px, rgba(28,27,23,0.05) 1px, transparent 0)",
        'gradient-ocre': 'linear-gradient(135deg, #DCA13F 0%, #C98A1E 45%, #8C5A0F 100%)',
        'gradient-ink': 'radial-gradient(120% 140% at 15% 0%, #2A2822 0%, #1C1B17 55%, #100F0C 100%)',
        'gradient-paper': 'radial-gradient(160% 120% at 100% 0%, #F7F1E1 0%, #FAF7EF 45%, #F1ECDD 100%)',
        'gradient-vinotinto': 'linear-gradient(135deg, #8C2220 0%, #6F1413 50%, #4D0E0D 100%)',
        'gradient-dorado': 'linear-gradient(135deg, #FCD34D 0%, #FBBB05 50%, #D6A20E 100%)',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        stampIn: {
          '0%': { opacity: '0', transform: 'rotate(-3deg) scale(1.35)' },
          '60%': { opacity: '1', transform: 'rotate(-3deg) scale(0.96)' },
          '100%': { opacity: '1', transform: 'rotate(-3deg) scale(1)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulseRing: {
          '0%': { boxShadow: '0 0 0 0 rgba(192,57,43,0.45)' },
          '100%': { boxShadow: '0 0 0 7px rgba(192,57,43,0)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) both',
        'stamp-in': 'stampIn 0.6s cubic-bezier(0.34,1.56,0.64,1) both',
        'slide-in-right': 'slideInRight 0.35s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in': 'fadeIn 0.25s ease-out both',
        'pulse-ring': 'pulseRing 1.8s cubic-bezier(0.4,0,0.6,1) infinite',
        'float-slow': 'floatSlow 7s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
