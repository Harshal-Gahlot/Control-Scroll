/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.{html,js}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        'ctm-white': 'hsl(0 0% 100%)',
        'ctm-light-gray': 'hsl(0 0% 80%)',
        'ctm-black': 'hsl(0 0% 3.9%)',
        'ctm-charcoal': 'hsl(0 0% 9%)',
        'ctm-medium-gray': 'hsl(0 0% 45.1%)',
        'ctm-green':'#1DCD9F'
      }
    },
  },
  plugins: [],
};