⚠️ WIP ⚠️

# joepkockelkorn.com

Welcome to the repo of my personal website.

## Contributing

### Getting started

- install node using `.nvmrc`
- `npm i`
- [install deno](https://deno.land)

### Development

`npm run dev`

This starts your app in development mode, rebuilding assets on file changes.

### Managing dependencies

Read about
[how we recommend to manage dependencies for Remix projects using Deno](https://github.com/remix-run/remix/blob/main/decisions/0001-use-npm-to-manage-npm-dependencies-for-deno-projects.md).

- ✅ You should use `npm` to install NPM packages
  ```sh
  npm install react
  ```
  ```ts
  import { useState } from 'react';
  ```
- ✅ You may use inlined URL imports or [deps.ts](https://deno.land/manual/examples/manage_dependencies#managing-dependencies) for Deno
  modules.
  ```ts
  import { copy } from 'https://deno.land/std@0.138.0/streams/conversion.ts';
  ```
- ❌ Do not use [import maps](https://deno.land/manual/linking_to_external_code/import_maps).

### Deployment

The website will automatically deployed on deno deploy in case of a pull request or commit to main. When a pull request is created, a
preview deployment is done. When merged to main, a production release is done.
