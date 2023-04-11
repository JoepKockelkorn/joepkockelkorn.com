import { marked } from 'marked';
import parseMarkdown from 'front-matter';
import { z } from 'zod';
import hljs from 'highlight.js/lib/core';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import { isTruthy } from 'remeda';

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

export async function fetchBlogPosts(): Promise<MinimalBlogPost[]> {
  const url = `https://api.github.com/repos/joepkockelkorn/joepkockelkorn.com/contents/content/blog`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'joepkockelkorn.com' },
  });
  const files = (await res.json()) as GithubFile[];
  const posts = await Promise.all(
    files
      .filter((file) => file.name.endsWith('.md'))
      .map((file) => fetchBlogPost(getSlugFromFilename(file.name)))
  );
  return posts
    .filter(isTruthy)
    .filter(
      (post) => process.env.NODE_ENV === 'development' || !post.meta.draft
    );
}

export type MinimalBlogPost = {
  slug: string;
  bodyMarkdown: string;
  meta: BlogPostFrontMatter;
};

export async function fetchBlogPost(
  slug: string,
  ref: string = 'main'
): Promise<MinimalBlogPost | null> {
  const url = `https://raw.githubusercontent.com/joepkockelkorn/joepkockelkorn.com/${ref}/content/blog/${encodeURIComponent(
    slug
  )}.md`;
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
    const localLink = href?.startsWith(
      `${requestUrl.protocol}//${requestUrl.hostname}`
    );
    const html = linkRenderer.call(renderer, href, title, text);
    return localLink
      ? html
      : html.replace(
          /^<a /,
          `<a target="_blank" rel="noreferrer noopener nofollow" `
        );
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
  hljs.getLanguage('typescript') ||
    hljs.registerLanguage('typescript', typescript);
  hljs.getLanguage('xml') || hljs.registerLanguage('xml', xml);
  return marked(markdown, {
    renderer,
    highlight: (code) => hljs.highlightAuto(code).value,
  });
}

function getSlugFromFilename(name: string) {
  return name.replace(/\.md$/, '');
}
