/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#FF3EA5',
        secondary: '#7C3AED',
        accent: '#00E5FF',
        ink: '#07060A',
        surface: '#111018',
        surface2: '#181622',
        paper: '#F8F7FF',
        muted: '#A8A4B7',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 40px -8px rgba(255, 62, 165, 0.45)',
        'glow-cyan': '0 0 40px -8px rgba(0, 229, 255, 0.4)',
      },
      backgroundImage: {
        'leonora-sky':
          'radial-gradient(120% 90% at 50% -10%, rgba(124,58,237,0.35) 0%, rgba(7,6,10,0) 60%), radial-gradient(80% 60% at 85% 10%, rgba(0,229,255,0.18) 0%, rgba(7,6,10,0) 55%), radial-gradient(90% 70% at 10% 100%, rgba(255,62,165,0.22) 0%, rgba(7,6,10,0) 60%)',
      },
      animation: {
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        drift: 'drift 18s ease-in-out infinite',
      },
      keyframes: {
        drift: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(2%, -3%)' },
        },
      },
    },
  },
  plugins: [],
};
