/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        display: ['"Outfit"', 'sans-serif'],
      },
      colors: {
        surface: {
          0: '#0a0b0f',
          1: '#10121a',
          2: '#161924',
          3: '#1e2130',
          4: '#252a3a',
          5: '#2e3448',
        },
        accent: {
          DEFAULT: '#5b7cf6',
          hover: '#7090ff',
          muted: '#5b7cf620',
        },
        node: {
          start: '#22c55e',
          task: '#5b7cf6',
          approval: '#f59e0b',
          auto: '#a855f7',
          end: '#ef4444',
        },
        border: {
          DEFAULT: '#ffffff0f',
          subtle: '#ffffff06',
          strong: '#ffffff1a',
        },
      },
      boxShadow: {
        node: '0 0 0 1px rgba(255,255,255,0.08), 0 4px 24px rgba(0,0,0,0.4)',
        'node-selected': '0 0 0 2px #5b7cf6, 0 4px 32px rgba(91,124,246,0.2)',
        panel: '0 0 0 1px rgba(255,255,255,0.06), -8px 0 32px rgba(0,0,0,0.3)',
        glow: '0 0 20px rgba(91,124,246,0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-in-right': 'slideInRight 0.25s ease-out',
        'slide-in-left': 'slideInLeft 0.25s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          from: { opacity: '0', transform: 'translateX(16px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          from: { opacity: '0', transform: 'translateX(-16px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
    },
  },
  plugins: [],
}
