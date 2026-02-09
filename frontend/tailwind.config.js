/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#E42313',
        'gray-dark': '#0D0D0D',
        'gray-secondary': '#7A7A7A',
        'gray-muted': '#B0B0B0',
        'gray-border': '#E8E8E8',
        'gray-bg': '#FAFAFA',
        success: '#22C55E',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
