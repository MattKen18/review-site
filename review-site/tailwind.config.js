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
      }
    },
    fontFamily: {
      display: ["Inter", "Roboto", "sans-serif"],
      body: ["Helvetica", "Arial", "sans-serif" ]
    },
    
  },
  plugins: [
    require('autoprefixer'),
  ],
}
