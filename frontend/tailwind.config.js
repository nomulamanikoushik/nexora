/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          900: '#0c4a6e',
        },
        nexora: {
          dark: '#070A12',
          surface: '#0B0F19',
          card: '#101726',
          border: 'rgba(255, 255, 255, 0.08)',
          cyan: '#00F0FF',
          emerald: '#10B981',
          indigo: '#6366F1',
          amber: '#F59E0B',
          rose: '#F43F5E',
          purple: '#A855F7'
        }
      },
      animation: {
        'pulse-subtle': 'pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glowPulse 4s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite'
      },
      keyframes: {
        pulseSubtle: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.75 }
        },
        glowPulse: {
          '0%': { filter: 'drop-shadow(0 0 15px rgba(6, 182, 212, 0.2))' },
          '100%': { filter: 'drop-shadow(0 0 30px rgba(99, 102, 241, 0.35))' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        }
      }
    },
  },
  plugins: [],
}
