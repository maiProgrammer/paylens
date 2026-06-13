/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      colors: {
        green: { DEFAULT: '#24a366', light: '#e6f5ee', border: '#b6dfc8', dark: '#1c7a4e' },
        surface: { DEFAULT: '#f7f6f2', card: '#ffffff', muted: '#f0efe9' },
        ink: { DEFAULT: '#0e0e0e', 2: '#3a3a3a', 3: '#888888', 4: '#bbbbbb' },
        bdr: { DEFAULT: '#e4e2db', 2: '#d0cec7' },
      },
    },
  },
  plugins: [],
}
