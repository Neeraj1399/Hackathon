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
          primary: '#2563EB',
          secondary: '#64748B',
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
          bg: '#F8FAFC',
          card: '#FFFFFF',
          section: '#F1F5F9',
          'text-primary': '#0F172A',
          'text-secondary': '#475569',
          border: '#E5E7EB',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      transitionDuration: {
        DEFAULT: '150ms',
      }
    },
  },
  plugins: [],
}

