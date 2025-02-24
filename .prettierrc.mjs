export default {
	singleQuote: true,
	semi: false,
	bracketSpacing: true,
	bracketSameLine: false,
	trailingComma: 'all',
	endOfLine: 'auto',
	experimentalTernaries: true,
	plugins: [
		'prettier-plugin-astro',
		'prettier-plugin-organize-imports',
		'prettier-plugin-tailwindcss',
	],
	overrides: [{ files: '*.astro', options: { parser: 'astro' } }],
	tailwindStylesheet: './src/styles/tailwind.css',
}
