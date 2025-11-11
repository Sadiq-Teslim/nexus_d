/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // This line is crucial
  ],
  theme: {
    extend: {
      colors: {
        // Add your custom Zenith Bank color for easy reuse
        zenithRed: '#d71e28',
      },
      fontFamily: {
        // Updated typography pairings for elevated aesthetic
        sans: ['Manrope', 'Inter', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      }
    },
  },
  plugins: [],
}