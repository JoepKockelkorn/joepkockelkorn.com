import type { RemarkPlugin } from '@astrojs/markdown-remark';
import { toString } from 'mdast-util-to-string';
import getReadingTime from 'reading-time';
import { z } from 'zod';
import { frontmatterSchema } from './frontmatter';

const rawFrontmatterSchema = frontmatterSchema.partial();
type Frontmatter = z.infer<typeof rawFrontmatterSchema>;

export const remarkReadingTime: RemarkPlugin = () => {
	return function (tree, { data }) {
		const textOnPage = toString(tree);
		const readingTime = getReadingTime(textOnPage);

		(data.astro?.frontmatter as Frontmatter).readingTime = readingTime.text;
	};
};
