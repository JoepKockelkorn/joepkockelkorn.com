export default {
	singleQuote: true,
	useTabs: true,
	tabWidth: 2,
	proseWrap: 'always',
	printWidth: 140,
	trailingComma: 'all',
	plugins: ['prettier-plugin-astro'],
	overrides: [
		{
			files: '*.astro',
			options: {
				parser: 'astro',
			},
		},
	],
};
