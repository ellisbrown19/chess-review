/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Chess.com-inspired move classification colors
        brilliant: '#1baca6',
        great: '#5c9',
        best: '#96bc4b',
        good: '#96af8b',
        inaccuracy: '#f0c15c',
        mistake: '#e58f2a',
        blunder: '#ca3431',
        // Chess board colors
        board: {
          light: '#f0d9b5',
          dark: '#b58863',
        }
      }
    },
  },
  plugins: [],
}
