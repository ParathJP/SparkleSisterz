import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        terracotta: {
          50:  '#fdf6f0',
          100: '#f9e8d8',
          200: '#f2cba9',
          300: '#e9a87a',
          400: '#df834d',
          500: '#c4622d',
          600: '#a84e24',
          700: '#8b3d1e',
          800: '#6e3018',
          900: '#5a2614',
        },
        gold: {
          400: '#e8be6a',
          500: '#d4a853',
          600: '#b8903e',
        },
        cream: '#fdf8f3',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
