/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,vue,svelte,md,mdx}'],
  theme: {
    extend: {
      colors: {
        peach: {
          50: '#fff5ec',
          100: '#ffe6d1',
          200: '#ffc89b',
          300: '#ffa867',
          400: '#ff8a3d',
          500: '#f06f1f',
        },
        seafoam: {
          50: '#effaf4',
          100: '#d6f2e1',
          200: '#a9e3c1',
          300: '#7ad4a1',
          400: '#52c084',
          500: '#34a468',
        },
        navy: {
          500: '#1f3a5f',
          600: '#16284a',
          700: '#0e1c34',
          800: '#091324',
        },
        cream: '#fff8ec',
      },
      fontFamily: {
        sans: ['Nunito', 'system-ui', 'sans-serif'],
        hand: ['"Patrick Hand"', '"Comic Sans MS"', 'cursive'],
      },
      borderRadius: {
        squish: '1.75rem',
      },
      boxShadow: {
        sticker: '4px 4px 0 0 rgba(14,28,52,0.9)',
        soft: '0 6px 24px -8px rgba(31,58,95,0.25)',
      },
    },
  },
  plugins: [],
};
