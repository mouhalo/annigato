/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Couleurs personnalisées pour Annigato
        'annigato-pink': '#FFB6C1',
        'annigato-orange': '#FF8E53',
        'annigato-yellow': '#FFC947',
        'annigato-purple': '#DDA0DD',
        'annigato-blue': '#4169E1',
        'annigato-green': '#90EE90',
        'annigato-turquoise': '#00CED1',
      },
      fontFamily: {
        'comic': ['Comic Sans MS', 'cursive'],
        'kid': ['Quicksand', 'sans-serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'bounce-slow': 'bounce 3s infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(255, 107, 107, 0.5)',
        'glow-lg': '0 0 40px rgba(255, 107, 107, 0.8)',
      }
    },
  },
  plugins: [],
}
