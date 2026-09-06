/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts,scss}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        theme: {
          bg: 'var(--bg-page)',
          card: 'var(--bg-card)',
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          accent: 'var(--accent-color)',
          glow: 'var(--glow-color)',
          border: 'var(--border-color)',
        }
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 12s linear infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glowPulse: {
          '0%': { boxShadow: '0 0 15px var(--glow-color)' },
          '100%': { boxShadow: '0 0 35px var(--glow-color), 0 0 10px var(--accent-color)' },
        }
      }
    },
  },
  plugins: [],
}
