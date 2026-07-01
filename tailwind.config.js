/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Light mode — 종이/원장(ledger) 느낌
        paper: '#F6F5F0',
        surface: '#FFFFFF',
        ink: '#15231C',
        muted: '#5C6B63',
        line: '#E4E1D6',
        // Dark mode — 금고/야간 은행 느낌
        vault: '#0A0E0D',
        'vault-surface': '#131916',
        'vault-elevated': '#1A211C',
        'vault-ink': '#ECF2EE',
        'vault-muted': '#8FA79A',
        'vault-line': '#232F28',
        // 브랜드 포인트
        bank: {
          green: '#0F9D63',
          'green-soft': '#E8F7EF',
          glow: '#34C784',
          'glow-dark': '#6EE7A8',
          gold: '#B8925A',
          'gold-dark': '#D9B872',
          danger: '#C4453A',
          'danger-dark': '#F0665A',
        },
      },
      fontFamily: {
        display: ['"Spectral"', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(21,35,28,0.04), 0 8px 24px -8px rgba(21,35,28,0.08)',
        'card-dark': '0 1px 2px rgba(0,0,0,0.2), 0 8px 24px -8px rgba(0,0,0,0.5)',
      },
      keyframes: {
        floatUp: {
          '0%': { transform: 'translateY(0)', opacity: '0' },
          '15%': { opacity: '1' },
          '100%': { transform: 'translateY(-40px)', opacity: '0' },
        },
        stampIn: {
          '0%': { transform: 'scale(2) rotate(-12deg)', opacity: '0' },
          '60%': { transform: 'scale(0.95) rotate(-6deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(-6deg)', opacity: '1' },
        },
      },
      animation: {
        floatUp: 'floatUp 1.4s ease-out forwards',
        stampIn: 'stampIn 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
};
