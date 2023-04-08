---
title: Angular state guards
date: 2023-04-10
draft: true
description: 'Angular state guards: a better simple data loading mechanism.'
---

## Metaframework data loading

Let's face it, all frontend javascript meta-frameworks have it these days: loaders. Convention-based `export`s living on the server to load the data needed for a route (or its child routes). [Remix](https://remix.run/docs/en/1.15.0/route/loader), [Next.js](https://nextjs.org/docs/basic-features/data-fetching/overview), [SvelteKit](https://kit.svelte.dev/docs/load), [Nuxt](https://nuxt.com/docs/getting-started/data-fetching), [Qwik City](https://qwik.builder.io/docs/route-loader/) and maybe it's coming for Angular with [Analogjs](https://github.com/analogjs/analog/issues/197).

## Bringing it to the SPA

It's admirable how the Remix team brought the loader concept to the good-old SPA world with [React Router's loader](https://reactrouter.com/en/main/route/loader). A loader in React Router is the same concept as it is in Remix, except that React Router doesn't use file-based routing but [a router config](https://reactrouter.com/en/main/routers/create-browser-router). And let's be real, sometimes there's no need for a meta-framework and a SPA works just fine.

## And now Angular

TODO

Explain the downsides of
- resolvers (no route prevention, guards run first)
- loading state in the component itself, dealing with conditional logic