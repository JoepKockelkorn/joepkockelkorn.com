/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.tsx'],
  theme: {
    extend: {
      colors: {
        primary: {
          200: 'rgb(var(--color-primary-200) / <alpha-value>)',
          400: 'rgb(var(--color-primary-400) / <alpha-value>)',
          700: 'rgb(var(--color-primary-700) / <alpha-value>)',
        },
        background: {
          DEFAULT: 'rgb(var(--color-background) / <alpha-value>)',
        },
        text: {
          DEFAULT: 'rgb(var(--color-text) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['Mukta', 'sans-serif'],
        mono: ['DankMono', 'monospace'],
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-10deg)' },
          '50%': { transform: 'rotate(10deg)' },
        },
      },
      animation: {
        wiggle: 'wiggle 1s ease-in-out infinite',
      },
    },
  },
  plugins: [
    /** @type {import('tailwindcss/types/config').PluginCreator} */
    ({ matchUtilities, addUtilities, theme }) => {
      matchUtilities(
        { 'text-fill': (value) => ({ '-webkit-text-fill-color': value }) },
        { values: theme('colors') }
      );
      addUtilities({
        '.hyphens': { hyphens: 'auto' },
        '.word-break': { 'word-break': 'break-word' },
      });
    },
    require('@tailwindcss/typography'),
  ],
};
