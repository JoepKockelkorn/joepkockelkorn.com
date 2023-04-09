---
title: Angular state guards
date: 2023-04-10
draft: true
description:
  'Angular state guards: a simple data fetching mechanism for Angular in the SPA
  world.'
---

## Data fetching in meta frameworks

All frontend javascript meta frameworks have it these days: a mechanism for data
fetching. They come in multiple forms, but mostly as a convention-based named
`export`, for example
[the `loader` export from Remix](https://remix.run/docs/en/1.15.0/route/loader):

```typescript
import { json } from '@remix-run/node';

export const loader = async () => {
  return json({ myData: 'is the best' });
};
```

Loaders are executed on the server and fetch the data for a route, potentially
in parallel, to make it available for the template of the route component. In
Remix you would use the
[`useLoaderData`](https://remix.run/docs/en/1.15.0/hooks/use-loader-data) hook
to get access to the fetched data:

```typescript
import { useLoaderData } from "@remix-run/react";

export default function SomeRoute() {
  const data = useLoaderData<typeof loader>();
  // access myData using data.myData
  ...
}
```

Some other examples of meta frameworks that provide a data fetching mechanism
are:

- [Next.js](https://nextjs.org/docs/basic-features/data-fetching/overview)
- [SvelteKit](https://kit.svelte.dev/docs/load)
- [Nuxt](https://nuxt.com/docs/getting-started/data-fetching)
- [Qwik City](https://qwik.builder.io/docs/route-loader/)
- [SolidStart](https://start.solidjs.com/core-concepts/data-loading)
- and maybe it's coming to Angular with
  [Analogjs](https://github.com/analogjs/analog/issues/197)

For projects that need server-side rendering this feature is a must have. But
not all projects have that need, maybe SEO is not that important. Sometimes a
good old SPA is good enough, i.e. for internal applications. Adding a meta
framework only adds unnecessary complexity since all of a sudden you have a
server to care about and manage.

## Bringing loaders to the SPA

The Remix team brought the `loader` concept to the good old SPA world with React
Router's [loader](https://reactrouter.com/en/main/route/loader). The loader of
Remix is (almost) equivalent to a loader in React Router, except React Router
doesn't use file-based routing but
[a router config](https://reactrouter.com/en/main/routers/create-browser-router):

```typescript
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Root, { rootLoader } from './routes/root';
import Team, { teamLoader } from './routes/team';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    loader: rootLoader,
    children: [
      {
        path: 'team',
        element: <Team />,
        loader: teamLoader,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
```

Another difference between Remix and React Router is that the latter does not
provide a type-safe API (yet) using a generic argument, so a typecast will be
needed to make Typescript happy.
[There is an ongoing discussion about that](https://github.com/remix-run/react-router/discussions/9854).

Using the retrieved data is that same in React Router as in Remix, using the
[`useLoaderData`](https://reactrouter.com/en/main/hooks/use-loader-data) hook:

```typescript
import { useLoaderData } from 'react-router-dom';

export default function Team() {
  const team = useLoaderData();
  // ...
}
```

We shouldn't underestimate how much the `loader` concept does for separation of
concerns (and thus maintainability/readability) and preventing
[those pesky race condition bugs](https://react.dev/learn/you-might-not-need-an-effect#fetching-data)
when you do data fetching in the component itself. We could consider other
alternatives like using
[React Query](https://tanstack.com/query/latest/docs/react/overview) (which
comes with its own additional complexity).

## Angular must be missing a loader

The Angular router ([`@angular/router`](https://angular.io/guide/router))
doesn't have a `loader` concept similar to React Router. Actually, to achieve
the same result (fetch data and use it in the route component) there are no
evident first-party solutions to pick. Let's review some options, starting with
the Hello World tutorial of angular.io:
[Tour of Heroes](https://angular.io/tutorial/tour-of-heroes).

### Tour of Heroes

The setup is pretty simple, it's an application with the goal of
showing/managing some heroes. It has a couple of components.

#### DashboardComponent

This is the homepage of the application. When the user navigates to the root
he'll be redirected here. A subset of the heroes (top heroes) are displayed here
and the user can search.

![DashboardComponent](https://ik.imagekit.io/joepkockelkorn/tr:w-768,f-auto/angular-state-guards/dashboard.png)

#### HeroesComponent

All heroes are shown here. We can navigate to a hero as well.

![HeroesComponent](https://ik.imagekit.io/joepkockelkorn/tr:w-768,f-auto/angular-state-guards/heroes.png)

#### HeroDetailComponent

This shows a single hero. We can update the hero's name as well.

![HeroDetailComponent](https://ik.imagekit.io/joepkockelkorn/tr:w-768,f-auto/angular-state-guards/hero-detail.png)

#### Routing setup

The routing setup is pretty straightforward:

```typescript
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { HeroesComponent } from './heroes/heroes.component';
import { HeroDetailComponent } from './hero-detail/hero-detail.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'heroes', component: HeroesComponent },
  { path: 'detail/:id', component: HeroDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
```

#### Data fetching strategy

The data is fetched in the component themselves. This is similar in all
components. For example, this is the `HeroDetailComponent`:

```typescript
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css'],
})
export class HeroDetailComponent implements OnInit {
  hero: Hero | undefined;

  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService
  ) {}

  ngOnInit(): void {
    this.getHero();
  }

  // 🔽🔽🔽 data fetching done here 🔽🔽🔽
  getHero(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    this.heroService.getHero(id).subscribe((hero) => (this.hero = hero));
  }

  // ...
}
```

#### The broken parts

TODO

- no 404 case handled
- no reactivity
- loading state/UI implemented differently on each page

- resolvers (no route prevention, guards run first)
- loading state in the component itself, dealing with conditional logic
