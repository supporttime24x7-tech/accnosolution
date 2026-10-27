import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#5ED29C',
          glow: '#16FFC6',
        },
        dark: {
          DEFAULT: '#070B0A',
          card: 'rgba(255, 255, 255, 0.03)',
          border: 'rgba(255, 255, 255, 0.10)',
        },
        secondary: {
          DEFAULT: '#0D1117',
        },
        accent: {
          DEFAULT: '#16FFC6',
        },
        textSec: 'rgba(255, 255, 255, 0.70)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
        jakarta: ['var(--font-jakarta)', 'Plus Jakarta Sans', 'sans-serif'],
        serifItalic: ['var(--font-serif-italic)', 'Instrument Serif', 'serif'],
      },
      backgroundImage: {
        'liquid-gradient': 'linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.02) 100%)',
        'hero-overlay': 'linear-gradient(90deg, #070b0a 0%, rgba(7, 11, 10, 0.65) 40%, transparent 100%)',
        'bottom-glow': 'linear-gradient(180deg, transparent 0%, #070b0a 100%)',
      },
      boxShadow: {
        'liquid': 'inset 0 1px 1px rgba(255, 255, 255, 0.15), 0 20px 40px -15px rgba(0, 0, 0, 0.5)',
        'glow-primary': '0 0 30px rgba(94, 210, 156, 0.35)',
        'glow-accent': '0 0 35px rgba(22, 255, 198, 0.30)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
