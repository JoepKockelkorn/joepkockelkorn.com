import type { RemarkPlugin } from '@astrojs/markdown-remark';
import { toString } from 'mdast-util-to-string';
import getReadingTime from 'reading-time';
import { frontmatterSchema } from './frontmatter';

export const remarkReadingTime: RemarkPlugin = () => {
	return function (tree, { data }) {
		const textOnPage = toString(tree);
		const readingTime = getReadingTime(textOnPage);

		const frontmatter = frontmatterSchema.parse(data.astro?.frontmatter);
		frontmatter.readingTime = readingTime.text;
	};
};
