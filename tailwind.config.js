/** @type {import('tailwindcss').Config} */
const { nextui } = require('@nextui-org/react');

module.exports = {
  content: [
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{tsx,ts}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#F97315'
        }
      }
    }
  },
  darkMode: 'class',
  plugins: [require('@tailwindcss/typography'), nextui()]
};
