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
          dark: '#0B0F19',
          card: '#111827',
          border: '#1F2937',
          cyan: '#06B6D4',
          emerald: '#10B981',
          indigo: '#6366F1',
          amber: '#F59E0B',
          rose: '#F43F5E'
        }
      }
    },
  },
  plugins: [],
}
