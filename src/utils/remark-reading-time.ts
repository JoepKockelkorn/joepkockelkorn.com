import getReadingTime from 'reading-time';
import { toString } from 'mdast-util-to-string';
import type { RemarkPlugin } from '@astrojs/markdown-remark';

// Don't import any real code from 'astro:content' here, as it will cause an issue: https://github.com/withastro/astro/issues/5711
import type { RenderedContent } from 'astro:content';
import { z } from 'zod';

const frontmatterSchema = z.object({
	readingTime: z.string(),
});

export const remarkReadingTime: RemarkPlugin = () => {
	return function (tree, { data }) {
		const textOnPage = toString(tree);
		const readingTime = getReadingTime(textOnPage);

		const { success: isValidFrontmatter, data: frontmatter } = frontmatterSchema.safeParse(data.astro?.frontmatter);
		if (!isValidFrontmatter) {
			return;
		}
		frontmatter.readingTime = readingTime.text;
	};
};

export function getReadingTimeFromRenderedContent(renderedContent?: RenderedContent): string {
	const { success: isValidFrontmatter, data: frontmatter } = frontmatterSchema.safeParse(renderedContent?.metadata?.frontmatter);
	if (!isValidFrontmatter) {
		throw new Error('Frontmatter is not valid');
	}
	return frontmatter.readingTime;
}
