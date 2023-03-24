/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", 
  ],
  theme: {
    extend: {
      colors: {
        'papaya': '#D96846',
        'moss': '#596235',
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
    
  },
  plugins: [
    require('autoprefixer'),
    require('@tailwindcss/line-clamp'),
  ],
}
