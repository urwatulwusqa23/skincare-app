/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // ── New primary palette ─────────────────────────────────
        paper:   { DEFAULT: '#f5f0ea', 100: '#faf7f3', 200: '#ede6da', 300: '#dfd3c4' },
        coral:   { DEFAULT: '#f53d1c', light: '#fff2ef', muted: '#ffc5bb', dark: '#c42a0d', deep: '#8a1d08' },
        teal:    { DEFAULT: '#00a877', light: '#e6fff7', muted: '#9de8ce', dark: '#007855', deep: '#004d38' },
        violet:  { DEFAULT: '#7c3aed', light: '#f1eaff', muted: '#c4a6f8', dark: '#5b22c4' },
        ink:     { DEFAULT: '#0e0c0a', soft: '#1e1a16', dim: '#3a2e26', mist: '#4e4038' },
        mid:     { DEFAULT: '#6b5e55', light: '#a09080', dark: '#3a2e26' },
        // ── Legacy tokens (remapped to new palette so className refs still work) ──
        cream:   { DEFAULT: '#f5f0ea', 50: '#faf7f3', 100: '#f5f0ea', 200: '#ede6da', 300: '#dfd3c4' },
        blush:   { DEFAULT: '#ffc5bb', light: '#fff2ef', dark: '#f53d1c', deep: '#c42a0d' },
        rose:    { DEFAULT: '#f87171', light: '#ffd6ce', dark: '#ef4444', deep: '#b91c1c' },
        sage:    { DEFAULT: '#9de8ce', light: '#e6fff7', dark: '#00a877', deep: '#007855' },
        sand:    { DEFAULT: '#dfd3c4', light: '#f5f0ea', dark: '#c4b4a0' },
        stone:   { DEFAULT: '#6b5e55', light: '#a09080', dark: '#0e0c0a' },
        peach:   { DEFAULT: '#c4a6f8', light: '#f1eaff', dark: '#7c3aed' },
        ivory:   { DEFAULT: '#faf7f3', warm: '#f5f0ea' },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body:    ['"DM Sans"', 'sans-serif'],
      },
      animation: {
        'float':      'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'shimmer':    'shimmer 2.5s linear infinite',
        'fade-up':    'fade-up 0.6s ease-out',
        'scale-in':   'scale-in 0.4s cubic-bezier(0.34,1.56,0.64,1)',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%':     { transform: 'translateY(-18px) rotate(1.5deg)' },
          '66%':     { transform: 'translateY(-8px) rotate(-1.5deg)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.92)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
