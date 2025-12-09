/** @type {import('tailwindcss').Config} */
module.exports = {
  // This line ensures Tailwind scans ALL your files for classes
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        // This defines 'bg-nigeria-green' and 'text-nigeria-green'
        nigeria: {
          green: '#008751', 
          dark: '#000000',
          white: '#FFFFFF'
        }
      }
    },
  },
  plugins: [],
}