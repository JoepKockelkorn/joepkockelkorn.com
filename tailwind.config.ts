import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';
import typographyPlugin from '@tailwindcss/typography';

export default {
	content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
	safelist: [
		'admonition',
		{
			pattern: /admonition-(title|info)/,
		},
	],
	theme: {
		extend: {
			colors: {
				primary: {
					200: 'rgb(var(--color-primary-200) / <alpha-value>)',
					400: 'rgb(var(--color-primary-400) / <alpha-value>)',
					700: 'rgb(var(--color-primary-700) / <alpha-value>)',
				},
				code: 'var(--color-code)',
				background: {
					DEFAULT: 'rgb(var(--color-background) / <alpha-value>)',
				},
				'admonition-title-background': {
					DEFAULT: 'rgb(var(--color-admonition-title-background) / <alpha-value>)',
				},
				text: {
					DEFAULT: 'rgb(var(--color-text) / <alpha-value>)',
				},
			},
			fontFamily: {
				sans: ['Mukta', 'Adjusted Arial Fallback', 'sans-serif'],
				mono: ['DankMono', 'Adjusted Courier New Fallback', 'monospace'],
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
		plugin(function ({ matchUtilities, addUtilities, theme }) {
			matchUtilities({ 'text-fill': (value) => ({ '-webkit-text-fill-color': value }) }, { values: theme('colors') });
			addUtilities({
				'.hyphens': { hyphens: 'auto' },
				'.word-break': { 'word-break': 'break-word' },
				'.text-gradient': {
					'@apply from-primary-700 to-primary-400 dark:to-primary-200 bg-gradient-to-r bg-clip-text text-fill-transparent': {},
				},
			});
		}),
		typographyPlugin,
	],
} satisfies Config;
