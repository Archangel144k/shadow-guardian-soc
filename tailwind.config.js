/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'mono': ['JetBrains Mono', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      },
      animation: {
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan': 'scan 2s linear infinite',
        'glitch': 'glitch 0.3s linear infinite',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        scan: {
          '0%': { top: '0' },
          '100%': { top: '100%' }
        },
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' }
        },
        'pulse-glow': {
          '0%, 100%': { 
            opacity: '1',
            boxShadow: '0 0 20px rgba(239, 68, 68, 0.3)'
          },
          '50%': { 
            opacity: '0.7',
            boxShadow: '0 0 30px rgba(239, 68, 68, 0.6)'
          }
        }
      },
      colors: {
        'cyber': {
          'green': '#00ff00',
          'red': '#ff0040',
          'blue': '#0080ff',
          'purple': '#8000ff',
          'orange': '#ff8000',
          'yellow': '#ffff00',
          'cyan': '#00ffff',
          'pink': '#ff0080',
        }
      }
    },
  },
  plugins: [],
}
