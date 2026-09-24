/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        steam: {
          dark: '#1b2838',
          light: '#2a475e',
          blue: '#66c0f4',
          accent: '#c7d5e0',
        }
      }
    },
  },
  plugins: [],
}