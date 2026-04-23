/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f3f7ff',
          100: '#e4edff',
          200: '#c8dbff',
          300: '#9bbfff',
          400: '#6a98ff',
          500: '#3f72ff',
          600: '#214fe6',
          700: '#193dbc',
          800: '#1a3698',
          900: '#1c3478'
        }
      }
    },
  },
  plugins: [],
};
