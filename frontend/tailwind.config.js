/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mint: {
          50: '#f2fcf9',
          100: '#d0f6ec',
          200: '#a1ebd9',
          300: '#6ddbc3',
          400: '#3bc2a8',
          500: '#1ea68d',
          600: '#148571',
          700: '#126b5c',
          800: '#13554b',
          900: '#13463f',
          950: '#062825',
        },
      },
    },
  },
  plugins: [],
}
