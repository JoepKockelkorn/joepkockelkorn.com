import type { EntryContext } from '@vercel/remix';
import { equals, isTruthy } from 'remeda';
import { getDomainUrl } from './domain.server';

export type SitemapEntry = {
  route: string;
  lastmod?: string;
  changefreq?:
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never';
  priority?: 0.0 | 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1.0;
};
export type SitemapHandle = {
  /** this just allows us to identify routes more directly rather than relying on pathnames */
  id?: string;
  getSitemapEntries?: (
    request: Request
  ) =>
    | Promise<Array<SitemapEntry | null> | null>
    | Array<SitemapEntry | null>
    | null;
};

export async function getSitemapXml(
  request: Request,
  remixContext: EntryContext
) {
  const domainUrl = getDomainUrl(request);

  function getEntry({ route, lastmod, changefreq, priority }: SitemapEntry) {
    return `
        <url>
            <loc>${domainUrl}${route}</loc>
            ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}
            ${changefreq ? `<changefreq>${changefreq}</changefreq>` : ''}
            ${priority ? `<priority>${priority}</priority>` : ''}
        </url>
  `.trim();
  }

  const rawSitemapEntries = (
    await Promise.all(
      Object.entries(remixContext.routeModules).map(async ([id, mod]) => {
        if (id === 'root') return;
        if (id.startsWith('__test_routes__')) return;

        const handle = mod.handle as SitemapHandle | undefined;
        if (handle?.getSitemapEntries) {
          return handle.getSitemapEntries(request);
        }

        // exclude resource routes
        if (!('default' in mod)) return;

        const manifestEntry = remixContext.manifest.routes[id];
        if (!manifestEntry) {
          console.warn(`Could not find a manifest entry for ${id}`);
          return;
        }
        let parentId = manifestEntry.parentId;
        let parent = parentId ? remixContext.manifest.routes[parentId] : null;

        let path;
        if (manifestEntry.path) {
          path = removeTrailingSlash(manifestEntry.path);
        } else if (manifestEntry.index) {
          path = '';
        } else {
          return;
        }

        while (parent) {
          // the root path is '/', so it messes things up if we add another '/'
          const parentPath = parent.path
            ? removeTrailingSlash(parent.path)
            : '';
          path = `${parentPath}/${path}`;
          parentId = parent.parentId;
          parent = parentId ? remixContext.manifest.routes[parentId] : null;
        }

        console.log('path', path);

        if (path.includes(':')) return;
        if (path.endsWith('*')) return;

        const entry: SitemapEntry = { route: removeTrailingSlash(path) };
        return entry;
      })
    )
  )
    .flatMap((z) => z)
    .filter(isTruthy);

  const sitemapEntries: Array<SitemapEntry> = [];
  for (const entry of rawSitemapEntries) {
    const existingEntryForRoute = sitemapEntries.find(
      (e) => e.route === entry.route
    );
    if (existingEntryForRoute) {
      if (!equals(existingEntryForRoute, entry)) {
        console.warn(
          `Duplicate route for ${entry.route} with different sitemap data`,
          { entry, existingEntryForRoute }
        );
      }
    } else {
      sitemapEntries.push(entry);
    }
  }

  return `
    <?xml version="1.0" encoding="UTF-8"?>
        <urlset
            xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
            xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
        >
        ${sitemapEntries.map((entry) => getEntry(entry)).join('')}
    </urlset>
  `.trim();
}

function removeTrailingSlash(s: string) {
  return s.endsWith('/') ? s.slice(0, -1) : s;
}