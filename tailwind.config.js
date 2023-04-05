/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.tsx'],
  theme: {
    extend: {
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
    ({ matchUtilities, theme }) => {
      matchUtilities(
        { 'text-fill': (value) => ({ '-webkit-text-fill-color': value }) },
        { values: theme('colors') }
      );
    },
    require('@tailwindcss/typography'),
  ],
};
