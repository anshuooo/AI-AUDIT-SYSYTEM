/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3b82f6", // Modern blue
        dark: "#0f172a", // Sleek dark mode background
      }
    },
  },
  plugins: [],
}
