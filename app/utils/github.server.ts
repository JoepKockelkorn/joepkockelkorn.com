import { marked } from 'marked';
import parseMarkdown from 'front-matter';

export async function fetchBlogPost(slug: string) {
  const url = `https://raw.githubusercontent.com/joepkockelkorn/joepkockelkorn.com/main/content/blog/${encodeURIComponent(
    slug
  )}.md`;
  const res = await fetch(url);

  if (res.status === 404) {
    return null;
  }

  const rawMarkdown = await res.text();
  const { body, attributes } = parseMarkdown(rawMarkdown);

  console.log({ attributes });

  const html = marked(body);

  return html;
}
