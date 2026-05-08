/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        truck: { orange: '#EF9F27', dark: '#2C2C2A', green: '#1D9E75' }
      },
      fontFamily: { bebas: ['Bebas Neue', 'sans-serif'] }
    },
  },
  plugins: [],
};
