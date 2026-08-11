import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep blacks and dark backgrounds
        midnight: {
          DEFAULT: '#000000',
          50: '#1A1A1A',
          100: '#0D0D0D',
          200: '#0A0A0A',
          300: '#000000',
          400: '#000000',
          500: '#000000',
          600: '#000000',
          700: '#000000',
          800: '#000000',
          900: '#000000',
        },
        // Deep emerald green (from logo)
        emerald: {
          DEFAULT: '#0B4B3D',
          50: '#E6F3F0',
          100: '#B8DDD5',
          200: '#8AC7BA',
          300: '#5CB19F',
          400: '#2E9B84',
          500: '#0B4B3D',
          600: '#094236',
          700: '#07382E',
          800: '#052F27',
          900: '#03251F',
        },
        // Rich gold (from logo)
        gold: {
          DEFAULT: '#C9A961',
          50: '#FCF9F3',
          100: '#F5EDDB',
          200: '#EDD9B3',
          300: '#E5C58B',
          400: '#DDB763',
          500: '#C9A961',
          600: '#B8954D',
          700: '#9A7D3F',
          800: '#7C6532',
          900: '#5E4D26',
        },
        // Light cream/parchment
        cream: {
          DEFAULT: '#F5F1E8',
          50: '#FFFFFF',
          100: '#FDFCFA',
          200: '#F9F7F0',
          300: '#F5F1E8',
          400: '#EEEADD',
          500: '#E7E2D2',
          600: '#DFDAC7',
          700: '#D8D2BC',
          800: '#D0CAB1',
          900: '#C9C2A6',
        },
        // Supporting colors
        bronze: {
          DEFAULT: '#B8954D',
          50: '#F7F3E7',
          100: '#EFE0D3',
          200: '#E4C9AD',
          300: '#D9B187',
          400: '#CE9A61',
          500: '#B8954D',
          600: '#A07D3A',
          700: '#87651D',
          800: '#5D3814',
          900: '#331F0B',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'hero': ['clamp(3rem, 8vw, 7rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display': ['clamp(2.5rem, 6vw, 5rem)', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
        'heading': ['clamp(2rem, 4vw, 3.5rem)', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'fade-up': 'fadeUp 0.8s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.8s ease-out forwards',
        'slide-in-right': 'slideInRight 0.8s ease-out forwards',
        'scale-in': 'scaleIn 0.6s ease-out forwards',
        'draw-line': 'drawLine 1.5s ease-out forwards',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        drawLine: {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(212, 175, 55, 0.6)' },
        },
      },
      backgroundImage: {
        'grain': "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noise\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.9\" numOctaves=\"4\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noise)\" opacity=\"0.05\"/%3E%3C/svg%3E')",
      },
    },
  },
  plugins: [],
};

export default config;
