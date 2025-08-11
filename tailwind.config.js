/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.{html,js}",
  ],
  theme: {
    extend: {
      colors: {
        'ctm-brick': '#390517',
        'ctm-golden': '#A38560',
        'ctm-dark-green': '#16302B',
        'ctm-black': '#03110D',
        'ctm-white': '#E0E0E0',
        'ctm-orange': '#A44529',
      }
    },
  },
  plugins: [],
};