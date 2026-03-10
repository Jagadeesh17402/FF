/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Wine color palette based on the provided image
        wine: {
          50: '#fdf2f8',
          100: '#fce7f3', 
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899', // Base wine
          600: '#db2777', // Medium wine
          700: '#be185d', // Darker wine
          800: '#9d174d', // Dark wine
          900: '#831843', // Darkest wine
        },
        burgundy: {
          50: '#fef7f7',
          100: '#fef2f2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#76113b', // Deep burgundy from palette
        },
        // Complement colors
        accent: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Lexend', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'wine': '0 4px 14px 0 rgba(190, 24, 93, 0.2)',
        'wine-lg': '0 10px 25px -3px rgba(190, 24, 93, 0.3), 0 4px 6px -2px rgba(190, 24, 93, 0.1)',
        'inner-wine': 'inset 0 2px 4px 0 rgba(190, 24, 93, 0.1)',
        'glow': '0 0 20px rgba(190, 24, 93, 0.3)',
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-in-up': 'fadeInUp 0.5s ease-in-out',
        'fade-in-down': 'fadeInDown 0.5s ease-in-out',
        'slide-in-right': 'slideInRight 0.3s ease-in-out',
        'slide-in-left': 'slideInLeft 0.3s ease-in-out',
        'bounce-gentle': 'bounceGentle 1s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 1.5s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(20px)' 
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)' 
          },
        },
        fadeInDown: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(-20px)' 
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)' 
          },
        },
        slideInRight: {
          '0%': { 
            opacity: '0',
            transform: 'translateX(20px)' 
          },
          '100%': { 
            opacity: '1',
            transform: 'translateX(0)' 
          },
        },
        slideInLeft: {
          '0%': { 
            opacity: '0',
            transform: 'translateX(-20px)' 
          },
          '100%': { 
            opacity: '1',
            transform: 'translateX(0)' 
          },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200px 0' },
          '100%': { backgroundPosition: 'calc(200px + 100%) 0' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(190, 24, 93, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(190, 24, 93, 0.5)' },
        },
      },
      backdropBlur: {
        xs: '2px',
        '4xl': '72px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'wine-gradient': 'linear-gradient(135deg, #881337 0%, #be185d 100%)',
        'wine-light-gradient': 'linear-gradient(135deg, #fce7f3 0%, #f3e8ff 100%)',
      },
      screens: {
        'xs': '475px',
        '3xl': '1600px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}