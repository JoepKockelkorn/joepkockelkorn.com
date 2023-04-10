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

Using the retrieved data is the same in React Router as in Remix, using the
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
compared to when you do data fetching in the component itself. For React we
could consider other alternatives like
[React Query](https://tanstack.com/query/latest/docs/react/overview) (which
comes with its own additional complexity).

## Angular must be missing a loader

The Angular router ([`@angular/router`](https://angular.io/guide/router))
doesn't have a `loader` concept similar to React Router. Actually, to achieve
the same result (fetch data and use it in the route component) there are no
evident first-party solutions to pick. Let's review some options, starting with
the Hello World tutorial of angular.io:
[Tour of Heroes](https://angular.io/tutorial/tour-of-heroes).

## Tour of Heroes

The setup is pretty simple, it's an application with the goal of
showing/managing some heroes. It has a couple of components.

### DashboardComponent

This is the homepage of the application. When the user navigates to the root
he'll be redirected here. A subset of the heroes (top heroes) are displayed here
and the user can search.

![DashboardComponent](https://ik.imagekit.io/joepkockelkorn/tr:w-768,f-auto/angular-state-guards/dashboard.png)

### HeroesComponent

All heroes are shown here. We can navigate to a hero as well.

![HeroesComponent](https://ik.imagekit.io/joepkockelkorn/tr:w-768,f-auto/angular-state-guards/heroes.png)

### HeroDetailComponent

This shows a single hero. We can update the hero's name as well.

![HeroDetailComponent](https://ik.imagekit.io/joepkockelkorn/tr:w-768,f-auto/angular-state-guards/hero-detail.png)

### Routing setup

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

### Data fetching strategy

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

### Tour of Heroes HeroDetailComponent review

A couple of things come to mind when looking at both the code and the UX. From a
UX perspective, we have:

- A jumpy experience: when the user navigates the UI changes twice because the
  old component is being destroyed and the new one is being partly rendered, and
  then the UI is updated again because the hero is loaded (and the form is
  rendered).
- A missing 404 experience. When the user navigates to URL for a hero that does
  not exist, there is no redirect or 'whoops not found' experience shown.

From a code perspective we have:

- Data fetching logic mixed with other logic in the component.
- Conditional logic: the hero could not be loaded yet, or the fetching could be
  done but the hero does not exist.
- Loading logic in the template. While there is no 'loading' UI shown currently,
  if there was any, then it would have been duplicated or reimplemented in each
  component.

### Bringing loaders to Angular

So it's obvious there's a lot to improve. Let's explore potential solutions and
see what might be the closes thing to a `loader` in Angular.

#### Resolvers

In the developer guide for 'Routing and Navigation' there's
[an extra tutorial](https://angular.io/guide/router-tutorial-toh#resolve-pre-fetching-component-data)
which expands on the Tour of Heroes with more advanced routing concepts. One of
those concepts is the deprecated
[`Resolve`](https://angular.io/api/router/Resolve) interface or its newer
equivalent, the [`ResolveFn`](https://angular.io/api/router/ResolveFn). I'll
call these in general 'resolvers'. A 'resolve' is actually a type of guard, but
they're a little different in usage and API than the other guards. So let's
review how a resolver might solve our problems. Let's see what applying a
resolver looks like:

```typescript
// hero-resolver.ts
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import { EMPTY, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { Hero } from './hero';
import { HeroService } from './hero.service';

export const heroResolver: ResolveFn<Hero> = (
  route: ActivatedRouteSnapshot
) => {
  const router = inject(Router);
  const heroService = inject(HeroService);
  const id = Number(route.paramMap.get('id')!);

  return heroService.getHero(id).pipe(
    mergeMap((hero) => {
      if (hero) {
        return of(hero);
      } else {
        // hero not found
        router.navigate(['/not-found']);
        return EMPTY;
      }
    })
  );
};
```

Here we define a function which implement the `ResolveFn` interface. It mainly
comprises of three parts:

- get some data from the route (like the `id` param)
- use it to fetch the hero and return it
- handle the edge case (i.e. navigation to a 'Not found' page in case the hero
  can't be found)

Then, we use this function in the router config:

```diff
+ import { heroResolver } from './hero-resolver';

const routes: Routes = [
  // ...
  {
    path: 'detail/:id',
    component: HeroDetailComponent,
    // 🔽🔽🔽 resolver config added here 🔽🔽🔽
+    resolve: { hero: heroResolver },
  },
  // ...
];
```

And remove the data fetching logic from the `HeroDetailComponent`:

```typescript
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable, map } from 'rxjs';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css'],
})
export class HeroDetailComponent {
  hero$: Observable<Hero> = this.route.data.pipe(map((data) => data['hero']));

  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location
  ) {}

  goBack(): void {
    this.location.back();
  }

  save(hero: Hero): void {
    this.heroService.updateHero(hero).subscribe(() => this.goBack());
  }
}
```

Note we still have to pluck the hero from the route data, and this requires a
type annotation or a typecast because by default it resolves to an `any`:

```typescript
type Data = {
  [key: string | symbol]: any;
};
```

This isn't any different from using Remix. In Remix we also have to help
typescript to infer the type of the loader using
`useLoaderData<typeof loader>()`.

Now that the hero in an `Observable<Hero>` instead of `Hero | undefined` we have
to change the template a bit:

```html
// need to use async pipe 🔽
<div *ngIf="hero$ | async as hero">
  <h2>{{hero.name | uppercase}} Details</h2>
  <div><span>id: </span>{{hero.id}}</div>
  <div>
    <label for="hero-name">Hero name: </label>
    <input id="hero-name" [(ngModel)]="hero.name" placeholder="Hero name" />
  </div>
  <button type="button" (click)="goBack()">go back</button>
  // and pass the hero here 🔽
  <button type="button" (click)="save(hero)">save</button>
</div>
```

#### What resolvers seem to resolve but don't

After applying the resolver there's a change in UX:

- When we click on a hero from the dashboard we stay on the same page.
- In the background the hero is fetched.
- When fetching is done, we see the `HeroDetailComponent` instantly.

To improve that experience we could introduce a global loading indicator using
the logic explained
[in this tutorial by Todd Motto](https://ultimatecourses.com/blog/angular-loading-spinners-with-router-events).
This brings additional benefits, because we only have to build the loading logic
once instead into each template of several other components!

But unfortunately resolvers also have downsides. In case the user navigates to a
hero that can't be found, the edge case logic kicks in, leading to a
`router.navigate`. Doing that from a resolver triggers a `NavigationCancel`
event. There's
[a long-running open github issue](https://github.com/angular/angular/issues/29089)
about this, but in a nutshell it confuses the router. It also messes up the
loading indicator logic mentioned above, leading to a slight flicker of the
loader (depending on how it's implemented).

<!-- TODO: find out more downsides of resolvers?
[Rearchitect Router so it's more modular](https://github.com/angular/angular/issues/42953) -->

### Guards

TODO: should I move this up?

These are the possible guard types:

- canActivate
- canActivateChild
- canDeactivate
- canMatch
- resolve (👋 hey I'm a guard too!)
- canLoad

TODO: Figure out how best to implement the 'save and retrieve state from the
guard' part. BehaviourSubject? Something else?

gotcha: guards run in parallel but when used as a loader this shouldn't be an
issue because they're highly route-bound
