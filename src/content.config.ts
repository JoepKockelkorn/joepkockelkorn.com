import { glob } from 'astro/loaders'
import { defineCollection, z } from 'astro:content'

const blog = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './content/blog' }),
	schema: z.object({
		title: z.string(),
		date: z.coerce.date().transform((date) => ({
			formatted: Intl.DateTimeFormat('en-US', {
				dateStyle: 'long',
				timeZone: 'UTC',
			}).format(date),
			raw: date.toISOString(),
		})),
		draft: z.boolean().optional(),
		description: z.string(),
		categories: z.array(z.string()).optional(),
	}),
})

export const collections = { blog }
