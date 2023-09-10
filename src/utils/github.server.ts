import type { MarkedOptions } from 'marked';
import { marked } from 'marked';
import admonition from 'marked-admonition-extension';
import parseMarkdown from 'front-matter';
import { z } from 'zod';
import hljs from 'highlight.js/lib/core';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import { isTruthy } from 'remeda';

marked.use(admonition);

const blogPostFrontMatterSchema = z.object({
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
});
type BlogPostFrontMatter = z.infer<typeof blogPostFrontMatterSchema>;

type GithubFile = {
	name: string;
	download_url: string;
};

export async function fetchBlogPosts(ref = 'main'): Promise<MinimalBlogPost[]> {
	const url = `https://api.github.com/repos/joepkockelkorn/joepkockelkorn.com/contents/content/blog?ref=${ref}`;
	const res = await fetch(url, {
		headers: { 'User-Agent': 'joepkockelkorn.com' },
	});
	const files = (await res.json()) as GithubFile[];
	const posts = await Promise.all(
		files.filter((file) => file.name.endsWith('.md')).map((file) => fetchBlogPost(getSlugFromFilename(file.name), ref)),
	);
	return posts.filter(isTruthy).filter((post) => process.env.NODE_ENV === 'development' || !post.meta.draft);
}

export type MinimalBlogPost = {
	slug: string;
	bodyMarkdown: string;
	meta: BlogPostFrontMatter;
};

export async function fetchBlogPost(slug: string, ref: string = 'main'): Promise<MinimalBlogPost | null> {
	const url = `https://raw.githubusercontent.com/joepkockelkorn/joepkockelkorn.com/${ref}/content/blog/${encodeURIComponent(slug)}.md`;
	const res = await fetch(url);

	if (res.status === 404) {
		return null;
	}

	const rawMarkdown = await res.text();
	const { body, attributes } = parseMarkdown(rawMarkdown);
	const meta = blogPostFrontMatterSchema.parse(attributes);

	return { slug, bodyMarkdown: body, meta };
}

export function convertMarkdownToHtml(requestUrl: URL, markdown: string) {
	const renderer = new marked.Renderer();

	const linkRenderer = renderer.link;
	renderer.link = (href, title, text) => {
		const localLink = href.startsWith(`${requestUrl.protocol}//${requestUrl.hostname}`);
		const html = linkRenderer.call(renderer, href, title, text);
		return localLink ? html : html.replace(/^<a /, `<a target="_blank" rel="noreferrer noopener nofollow" `);
	};

	const imageRenderer = renderer.image;
	renderer.image = (href, title, text) => {
		const html = imageRenderer.call(renderer, href, title, text);
		return html.replace(/^<img /, `<img loading="lazy" `);
	};

	renderer.heading = (text, level, raw, slugger) => {
		const id = slugger.slug(raw);
		return `<h${level} id="${id}"><a href="#${id}" class="header-link">${text}</a></h${level}>\n`;
	};

	hljs.getLanguage('typescript') || hljs.registerLanguage('typescript', typescript);
	hljs.getLanguage('xml') || hljs.registerLanguage('xml', xml);
	// TODO: remove deprecated highlight option
	const highlight: MarkedOptions['highlight'] = (code, _lang): string => hljs.highlightAuto(code).value;

	renderer.code = (code, infostring, escaped) => {
		const lang = (infostring ?? '').match(/\S*/)![0];
		const lines = code.split('\n');

		// Find diff lines
		const diffLines = lines.reduce<Array<{ rowIndex: number; type: 'addition' | 'deletion' }>>((acc, line, i) => {
			if (line.startsWith('+ ')) acc.push({ rowIndex: i, type: 'addition' });
			if (line.startsWith('- ')) acc.push({ rowIndex: i, type: 'deletion' });
			return acc;
		}, []);

		// Remove diff indications
		if (diffLines.length > 0) {
			code = lines.map((line, i) => (diffLines.find((dl) => dl.rowIndex === i) ? line.slice(2) : line)).join('\n');
		}

		// Apply syntax highlighting
		const out = highlight(code, lang);
		if (out && out !== code) {
			escaped = true;
			code = out;
		}

		// Add back the diff indications
		const splittedCode = code.split('\n');
		const aggregatedCode = splittedCode.map((line, i) => {
			const dl = diffLines.find((dl) => dl.rowIndex === i);
			if (!dl) return `<span class="line">${line}</span>`;
			return `<span class="line ${dl.type === 'addition' ? 'bg-green-900' : 'bg-red-900'}">${
				dl.type === 'addition' ? '+' : '-'
			} ${line}</span>`;
		});
		code = aggregatedCode.join('\n');

		code = code.replace(/\n$/, '') + '\n'; // what is this for?

		const escapedCode = escaped ? code : escape(code, true);
		return `<pre><code${!lang ? '' : ` lang="${escape(lang)}"`}>${escapedCode}</code></pre>\n`;
	};

	return marked.parse(markdown, { renderer, highlight });
}

function getSlugFromFilename(name: string) {
	return name.replace(/\.md$/, '');
}

/** Copied from marked (added types) */
const escapeTest = /[&<>"']/;
const escapeReplace = new RegExp(escapeTest.source, 'g');
const escapeTestNoEncode = /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/;
const escapeReplaceNoEncode = new RegExp(escapeTestNoEncode.source, 'g');
const escapeReplacements: Record<string, string> = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	"'": '&#39;',
};
const getEscapeReplacement = (ch: string) => escapeReplacements[ch];
export function escape(html: string, encode?: boolean) {
	if (encode) {
		if (escapeTest.test(html)) {
			return html.replace(escapeReplace, getEscapeReplacement);
		}
	} else {
		if (escapeTestNoEncode.test(html)) {
			return html.replace(escapeReplaceNoEncode, getEscapeReplacement);
		}
	}

	return html;
}
/** End copied from marked */
