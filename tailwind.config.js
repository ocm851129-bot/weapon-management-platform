/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        military: {
          dark: '#0a0f1a',
          navy: '#0d1b2e',
          blue: '#1a3a5c',
          accent: '#00d4ff',
          green: '#00ff88',
          red: '#ff4444',
          yellow: '#ffcc00',
          gray: '#8899aa',
        }
      },
      fontFamily: {
        mono: ['Courier New', 'monospace'],
      }
    },
  },
  plugins: [],
}

