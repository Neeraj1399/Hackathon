/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: '#0B0B0F',
          lighter: '#16161D',
          border: '#23232D',
        },
        brand: {
          light: '#9E7AFF',
          DEFAULT: '#7C3AED', // Main Purple
          dark: '#5B21B6',
        },
        accent: {
          blue: '#3B82F6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
}
