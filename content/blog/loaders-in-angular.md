---
title: Loaders in Angular
date: 2023-04-15
draft: true
description:
  'Loaders in Angular: Exploring the concept of Remix loaders in the world of SPA Angular.'
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

## Bringing loaders to the SPA 🛀

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

## Angular must be missing a loader 👼

The Angular router ([`@angular/router`](https://angular.io/guide/router))
doesn't have a `loader` concept similar to React Router. Actually, to achieve
the same result (fetch data and use it in the route component) there are no
evident first-party solutions to pick. Let's review some options, using the 'Hello World' tutorial of angular.io as a showcase:
[Tour of Heroes](https://angular.io/tutorial/tour-of-heroes).

## Tour of Heroes

The setup is pretty simple, it's an application with the goal of
showing/managing some heroes. It has a couple of components, let's go over them.

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

No lazy loading, just one route config for the whole application. Can't get much simpler.

### Data fetching strategy

The data is fetched in the component themselves. This is dome similarly in all
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

## Tour of Heroes in review

For most experienced Angular developers it might not be a shock that the Tour of Heroes is not exactly world class code that should be used in production. But it can still be useful for this blog post, to see how we would improve and potentially use the concept of loaders in Angular. Let's take a detailed look at the `HeroDetailComponent`.

### HeroDetailComponent

A couple of things come to mind when looking at both the code and the UX. From a
**UX** perspective, we have:

- A jumpy experience. When the user navigates to this route, the UI changes twice. This happens because the
  old route component is being destroyed, then the new one is being rendered (partly), and
  then the UI is updated again after the hero has loaded.
- A missing 404 experience. When the user navigates to URL for a hero that does
  not exist, there is no redirect or 'whoops not found' experience shown.

From a **code** perspective we have:

- No separation of concerns. Data fetching logic is mixed with navigation and form logic.
- Conditional logic. It could be the case the hero it not loaded yet. Or the fetching could be
  done but the hero does not exist. This also leads to code duplication for any 'loading' logic, every component needs it, **again**.

## Bringing loaders to Angular

So it's obvious there's a lot to improve. Let's explore potential solutions and
see what might be the closest thing to a `loader` in Angular.

Well, let me just call it out: it's **Guards**. It might seem a bit hidden in plain sight, but on the [Common Routing Tasks](https://angular.io/guide/router) page of angular.io, there's a section devoted to guards. You can find it under the heading [Preventing unauthorized access](https://angular.io/guide/router#preventing-unauthorized-access), which is a heavy understatement: guards can be used for much more than just authorization checks.

### Guards introduction

At the end of the section mentioned above is [a link to the Tour of Heroes router tutorial](https://angular.io/guide/router-tutorial-toh#milestone-5-route-guards), called: **Route guards**. I'm just going to borrow their explanation of route guards:

> At the moment, any user can navigate anywhere in the application any time, but sometimes you need to control access to different parts of your application for various reasons, some of which might include the following:
> - Perhaps the user is not authorized to navigate to the target component
> - Maybe the user must login (authenticate) first
> - Maybe you should fetch some data before you display the target component
> - You might want to save pending changes before leaving a component
> - You might ask the user if it's okay to discard pending changes rather than save them
>
> You add guards to the route configuration to handle these scenarios.

From this list it becomes clear: guards are not only useful for authorization. For the sake of this blog post, bullet point #3 sounds very interesting.

> Maybe you should **fetch** some data **before** you display the target component

Actually, it sounds precisely like a loader. That's what we're looking for!

## Guard types

Now, which one to pick... These are the possible guard types:

- canActivate
- canActivateChild
- canDeactivate
- canLoad
- canMatch
- resolve

Let's explain some of them:

- [CanDeactivateFn](https://angular.io/api/router/CanDeactivateFn) is called whenever a user exits a route, so is unfit for data fetching before navigation.
- [CanLoadFn](https://angular.io/api/router/CanLoadFn) is called before a lazy loaded route component or module is loaded.
- [CanActivateFn](https://angular.io/api/router/CanActivateFn) is called before a route is going to be activated.
- [CanActivateChildFn](https://angular.io/api/router/CanActivateChildFn) does the same as CanActivateFn but for any of the route's children.

Since the newer [CanMatchFn](https://angular.io/api/router/CanMatchFn) was added, the CanLoadFn, CanActivateFn and CanActivateChildFn make less sense to be used for data fetching, because with CanMatchFn you can prevent a route from being matched. And routes that are not going to be matched **will not be loaded or activated** so it can do the same kind of trick, but sooner.

Let's look at the remaining options resolve and canMatch more in detail and how they could be used for data fetching.

### canMatch

TODO: explain how in code

### resolve

Last on the list, but not least is the resolve guard. A resolve guard comes in two forms. The first is the deprecated [`Resolve`](https://angular.io/api/router/Resolve) interface. The second is it's newer
equivalent, the [`ResolveFn`](https://angular.io/api/router/ResolveFn). Resolve guards are a little different in usage and API than the other guards. Let's review how a resolve might solve our data fetching issues in the Tour of Heroes. Looking at some code:

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

- get some data from the route (the `id` param value)
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
    // 🔽🔽🔽 resolve config added here 🔽🔽🔽
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

Note we still have to pluck the hero from the route data. The plucking requires a
type annotation or a typecast because by default any property on `Data` resolves to `any`:

```typescript
type Data = {
  [key: string | symbol]: any;
};
```

This typecasting issue is also there in Remix. In Remix we also have to help
typescript to infer the type of the loader using
`useLoaderData<typeof loader>()`.

Now that the hero in an `Observable<Hero>` instead of `Hero | undefined` we have
to change the template a bit:

```html
<!-- need to use async pipe 🔽 -->
<div *ngIf="hero$ | async as hero">
  <h2>{{hero.name | uppercase}} Details</h2>
  <div><span>id: </span>{{hero.id}}</div>
  <div>
    <label for="hero-name">Hero name: </label>
    <input id="hero-name" [(ngModel)]="hero.name" placeholder="Hero name" />
  </div>
  <button type="button" (click)="goBack()">go back</button>
  <!--          and pass the hero here 🔽 -->
  <button type="button" (click)="save(hero)">save</button>
</div>
```

## Guards in review

### General guard data fetching experience

After applying the resolve guard there's a change in UX:

- When we click on a hero from the dashboard we stay on the same page.
- In the background the hero is fetched.
- When fetching is done, we see the `HeroDetailComponent` instantly.

This actually is the same when using `CanMatchFn`. To improve that experience we could introduce a global loading indicator using the logic explained [in this tutorial by Todd Motto](https://ultimatecourses.com/blog/angular-loading-spinners-with-router-events). This brings additional benefits, because we only have to build the loading logic once instead into each template of several other components!

### resolve guard issues

But unfortunately, a resolve guard also has downsides compared to canMatch. In case the user navigates to a
hero that can't be found, the edge case logic kicks in, leading to a `router.navigate`. Doing that from a resolve guard triggers a `NavigationCancel` event. There's [a long-running open github issue](https://github.com/angular/angular/issues/29089) about this, but in a nutshell a `NavigationCancel` event confuses the router. It also messes up the loading indicator logic mentioned above, leading to a slight flicker of the loader (depending on how it's implemented).

<!-- TODO: find out more downsides of resolvers?
[Rearchitect Router so it's more modular](https://github.com/angular/angular/issues/42953) -->

### canMatch guard issues

TODO: find out

### Other gotchas

Guards run in parallel, so there'no guarantee the first guard in a route config array is finished before the second one. But when used as a loader this shouldn't be an issue because they're highly route-bound and thus you should only have one.
