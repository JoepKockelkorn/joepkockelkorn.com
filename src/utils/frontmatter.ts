// Don't import any real code from 'astro:content' here, as it will cause an issue: https://github.com/withastro/astro/issues/5711
import type { RenderedContent } from 'astro:content';
import { z } from 'zod';

export const frontmatterSchema = z.object({
	readingTime: z.string().optional().default('0 min'),
});
export type Frontmatter = z.infer<typeof frontmatterSchema>;

export function getFrontmatter(renderedContent?: RenderedContent): z.infer<typeof frontmatterSchema> {
	return frontmatterSchema.parse(renderedContent?.metadata?.frontmatter);
}
