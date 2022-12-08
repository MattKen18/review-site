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
      }
    },
    fontFamily: {
      display: ["Inter", "Roboto", "sans-serif"],
      body: ["Helvetica", "Arial", "sans-serif" ]
    },
    
  },
  plugins: [
    require('autoprefixer'),
    require('@tailwindcss/line-clamp'),
  ],
}
