/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63'
        },
        accent: {
          50: '#fff8eb',
          100: '#ffefcc',
          200: '#ffe19c',
          300: '#ffd065',
          400: '#f7b634',
          500: '#e49c18',
          600: '#c57b0f',
          700: '#9d5b0f',
          800: '#824913',
          900: '#6f3d14'
        },
        ink: {
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155'
        },
      }
    },
  },
  plugins: [],
};
