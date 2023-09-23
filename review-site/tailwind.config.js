/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", 
  ],
  theme: {
    extend: {
      colors: {
        'body': '#475569',
        'papaya': '#3F51B5',//'#3F51B5', '#D96846',
        'moss': '#596235',
        'primary': '#3F51B5',
        'secondary': '#6b7280',
        'tertiary': '#0D1125',
        'dark-bg': '#0f172a',
        'success': '#4CAF50',
        'light-text': '#e2e8f0',
        'fail': '#F44336',
        'highlight': '#FFEB3B',
        'error': '#C62828',
      },
      lineClamp: {
        7: '7',
        8: '8',
        9: '9',
        10: '10',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        }
      }
    },
    fontFamily: {
      display: ["Inter", "Roboto", "sans-serif"],
      body: ["Rubik", "Arial", "sans-serif" ]
    },
    fontSize: {
      '2xs': '0.55rem',
      'xs': '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
    }
    
  },
  plugins: [
    require('autoprefixer'),
    require('@tailwindcss/line-clamp'),
    require('tailwind-scrollbar'),
  ],
}
