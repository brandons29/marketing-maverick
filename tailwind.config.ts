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
        // Institutional / Swayze Media Elite palette
        maverick: {
          black: '#000000',
          'dark-1': '#0a0a0a',
          'dark-2': '#111111',
          'dark-3': '#161616',
          // Performance Institutional
          neon: '#00cc66',        // Muted Elite Green
          'neon-blue': '#0066ff', // Pro Blue
          gold: '#c5a059',        // Sophisticated Gold
          'gold-dim': '#8c7340',
          'gold-bright': '#e8d4a5',
          accent: '#ffffff',
          muted: '#444444',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Lexend', 'Inter', 'sans-serif'],
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
