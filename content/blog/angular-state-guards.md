---
title: Angular state guards
date: 2023-04-10
draft: true
description: 'Angular state guards: a better simple data loading mechanism.'
---

## Data fetching in meta frameworks

All frontend javascript meta frameworks have it these days: a mechanism for data fetching. They come in multiple forms, but mostly as a convention-based named `export`, for example the `loader` export from Remix:

```typescript
import { json } from "@remix-run/node";

export const loader = async () => {
  return json({ myData: 'is the best ' });
};
```

Loaders are executed on the server and fetch the data for a route, potentially in parallel, to make it available for the template of the route component. In Remix you would use the `useLoaderData` hook to get access to the fetched data:

```typescript
import { useLoaderData } from "@remix-run/react";

export default function SomeRoute() {
  const data = useLoaderData<typeof loader>();
  // access myData using data.myData
  ...
}
```

Some examples of frameworks that have this mechanism are:
- [Remix](https://remix.run/docs/en/1.15.0/route/loader)
- [Next.js](https://nextjs.org/docs/basic-features/data-fetching/overview)
- [SvelteKit](https://kit.svelte.dev/docs/load)
- [Nuxt](https://nuxt.com/docs/getting-started/data-fetching)
- [Qwik City](https://qwik.builder.io/docs/route-loader/)
- and maybe it's coming to Angular with [Analogjs](https://github.com/analogjs/analog/issues/197)

For projects that have a need for serverside rendering this is a wonderful feature to have. But not all projects have that need. Sometimes a good old SPA is good enough, and adding a meta framework only adds unnecessary complexity since all of a sudden you have a server to care about.

## Bringing loaders to the SPA

The Remix team brought the loader concept to the good old SPA world with [React Router's loader](https://reactrouter.com/en/main/route/loader). A loader in React Router is the same concept as it is in Remix, except that React Router doesn't use file-based routing but [a router config](https://reactrouter.com/en/main/routers/create-browser-router).

## And now Angular

Angular doesn't have a 'loader' concept similar to React. Actually, to achieve the same result (use fetched data in a route) there are a dozen or more solutions to pick from.

TODO

Explain the downsides of
- resolvers (no route prevention, guards run first)
- loading state in the component itself, dealing with conditional logic