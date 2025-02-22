import getReadingTime from 'reading-time';
import { toString } from 'mdast-util-to-string';
import type { RemarkPlugin } from '@astrojs/markdown-remark';

export const readingTimeKey = 'readingTime';

export const remarkReadingTime: RemarkPlugin = () => {
	return function (tree, { data }) {
		const textOnPage = toString(tree);
		const readingTime = getReadingTime(textOnPage);

		if (!data.astro?.frontmatter) {
			return;
		}
		data.astro.frontmatter[readingTimeKey] = readingTime.text;
	};
};
