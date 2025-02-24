// Don't import any runtime code from 'astro:content' here, as it will cause an issue: https://github.com/withastro/astro/issues/5711
import { z } from 'zod'

export const frontmatterSchema = z.object({
	readingTime: z.string(),
})
export type Frontmatter = z.infer<typeof frontmatterSchema>
