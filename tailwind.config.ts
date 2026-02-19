import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Matte Black / Cyber Neon / Gold palette
        maverick: {
          black: '#0a0a0a',
          'dark-1': '#111111',
          'dark-2': '#1a1a1a',
          'dark-3': '#242424',
          neon: '#00ff88',        // Cyber green
          'neon-blue': '#00d4ff', // Cyber blue
          'neon-pink': '#ff00aa', // Cyber pink
          gold: '#ffd700',
          'gold-dim': '#c9a227',
          'gold-bright': '#ffe44d',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'neon-green': '0 0 20px rgba(0,255,136,0.4), 0 0 40px rgba(0,255,136,0.1)',
        'neon-gold': '0 0 20px rgba(255,215,0,0.4), 0 0 40px rgba(255,215,0,0.15)',
        'neon-blue': '0 0 20px rgba(0,212,255,0.4), 0 0 40px rgba(0,212,255,0.1)',
      },
      animation: {
        'pulse-neon': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-scan': 'scan 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
