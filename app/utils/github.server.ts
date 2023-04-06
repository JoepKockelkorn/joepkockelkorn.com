import { marked } from 'marked';
import parseMarkdown from 'front-matter';
import { z } from 'zod';

const blogPostFrontMatterSchema = z.object({
  title: z.string(),
  date: z.coerce.date(),
  draft: z.boolean().optional(),
  description: z.string(),
  categories: z.array(z.string()).optional(),
});
type BlogPostFrontMatter = z.infer<typeof blogPostFrontMatterSchema>;

export async function fetchBlogPost(
  slug: string
): Promise<{ html: string; meta: BlogPostFrontMatter } | null> {
  const url = `https://raw.githubusercontent.com/joepkockelkorn/joepkockelkorn.com/main/content/blog/${encodeURIComponent(
    slug
  )}.md`;
  const res = await fetch(url);

  if (res.status === 404) {
    return null;
  }

  const rawMarkdown = await res.text();
  const { body, attributes } = parseMarkdown(rawMarkdown);

  const meta = blogPostFrontMatterSchema.parse(attributes);
  const html = marked(body);

  return { html, meta };
}
