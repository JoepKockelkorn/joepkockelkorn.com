---
title: Loaders in Angular
date: 2023-04-15
draft: true
description:
  'Loaders in Angular: Exploring the concept of Remix loaders in the world of
  SPA Angular.'
---

## Data fetching in meta frameworks

All frontend javascript meta frameworks have it these days: a mechanism for data
fetching. They come in many forms, but mostly as a convention-based named
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

A data fetching feature is a must have for projects that need server-side
rendering. Not all projects have that need though, so maybe SEO is not that
important for you. Sometimes a good old SPA is good enough, i.e. for internal
applications. Adding a meta framework only adds unnecessary complexity since all
of a sudden you have a server to care about and manage.

## Bringing loaders to the SPA 🛀

The Remix team brought the `loader` concept to the Single Page Application with
React Router's [loader](https://reactrouter.com/en/main/route/loader). A loader
in Remix is (almost) equivalent to a loader in React Router. In comparison,
React Router doesn't use file-based routing but
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

Another difference is that React Router does not provide a type-safe API (yet)
using a generic argument, so a typecast will be needed to make Typescript happy.
[There is an ongoing discussion about that](https://github.com/remix-run/react-router/discussions/9854).

React Router uses the same mechanism for **using** the data as Remix, via the
[`useLoaderData`](https://reactrouter.com/en/main/hooks/use-loader-data) hook:

```typescript
import { useLoaderData } from 'react-router-dom';

export default function Team() {
  const team = useLoaderData();
  // ...
}
```

The `loader` concept brings a big win in terms of separation of concerns,
maintainability, readability and preventing
[those pesky race condition bugs when using `useEffect` in the component itself](https://react.dev/learn/you-might-not-need-an-effect#fetching-data).

There are other alternatives to do data fetching like
[React Query](https://tanstack.com/query/latest/docs/react/overview) or Redux
(which each come with their own additional complexity). But the `loader` concept
is simple and easy to understand.

## Angular must be missing a loader 👼

At first sight the Angular router
([`@angular/router`](https://angular.io/guide/router)) doesn't promote a
`loader` concept similar to React Router. There is no evident 'data fetching'
section in the docs. That doesn't mean it can't be done using the tools at hand.
Let's use the 'Hello World' tutorial of angular.io
[Tour of Heroes](https://angular.io/tutorial/tour-of-heroes) as a showcase
application to apply solutions on.

## Tour of Heroes

The setup is pretty simple, it's an application with the goal of
showing/managing some heroes. It has a couple of components, let's go over them
shortly.

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

No lazy loading, just one route config for the whole application. Can't get much
simpler.

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

For the rest of this blog post I'll focus on this component to apply possible
solutions on.

## Tour of Heroes in review

For experienced Angular developers it might not be a shock that the Tour of
Heroes is not exactly world class code that should be used in production. It is
not promoted as such. But it can still be useful for this blog post, to see how
we would improve and potentially use the concept of loaders in Angular. Let's
take a detailed look at the `HeroDetailComponent`.

### HeroDetailComponent

A couple of things come to mind when looking at both the code and the UX. From a
**UX** perspective, we have:

- A jumpy experience. When the user navigates to this route, the UI changes
  twice. This happens because the old route component is being destroyed, then
  the new one is being rendered (partly), and then the UI is updated again after
  the hero has loaded.
- A missing 404 experience. When the user navigates to URL for a hero that does
  not exist, there is no redirect or 'whoops not found' experience shown.

From a **code** perspective we have:

- No separation of concerns. Data fetching logic is mixed with navigation and
  form logic.
- Conditional logic. It could be the case the hero it not loaded yet. Or the
  fetching could be done but the hero does not exist. This also leads to code
  duplication for any 'loading' logic, every component needs it, **again**.

## Bringing loaders to Angular

So it's obvious there's a lot to improve. Let's explore potential solutions and
see what might be the closest thing to a `loader` in Angular.

Well, let me just call it out: it's **Guards**. It might seem a bit hidden in
plain sight, but on the [Common Routing Tasks](https://angular.io/guide/router)
page of angular.io, there's a section devoted to guards. You can find it under
the heading
[Preventing unauthorized access](https://angular.io/guide/router#preventing-unauthorized-access),
which is a heavy understatement: guards can be used for much more than just
authorization checks.

### Guards introduction

At the end of the section mentioned above is
[a link to the Tour of Heroes router tutorial](https://angular.io/guide/router-tutorial-toh#milestone-5-route-guards),
called: **Route guards**. I'm just going to borrow their explanation of route
guards:

> At the moment, any user can navigate anywhere in the application any time, but
> sometimes you need to control access to different parts of your application
> for various reasons, some of which might include the following:
>
> - Perhaps the user is not authorized to navigate to the target component
> - Maybe the user must login (authenticate) first
> - Maybe you should fetch some data before you display the target component
> - You might want to save pending changes before leaving a component
> - You might ask the user if it's okay to discard pending changes rather than
>   save them
>
> You add guards to the route configuration to handle these scenarios.

From this list it becomes clear: guards are not only useful for authorization.
For the sake of this blog post, bullet point #3 sounds very interesting.

> Maybe you should **fetch** some data **before** you display the target
> component

Actually, it sounds precisely like a loader. That's what we're looking for!

## Guard types

Now, which one to pick... These are the possible guard types:

- canActivate
- canActivateChild
- canDeactivate
- canLoad
- canMatch
- resolve

Let's explain them:

- [CanActivateFn](https://angular.io/api/router/CanActivateFn) is called before
  a route is activated.
- [CanActivateChildFn](https://angular.io/api/router/CanActivateChildFn) does
  the same as CanActivateFn but for any of the route's children.
- [CanDeactivateFn](https://angular.io/api/router/CanDeactivateFn) is called
  whenever a user exits a route, so is unfit for data fetching before
  navigation.
- [CanLoadFn](https://angular.io/api/router/CanLoadFn) is called before a lazy
  loaded route component or module is loaded.
- [CanMatchFn](https://angular.io/api/router/CanMatchFn) is called before a
  route is matched.
- [ResolveFn](https://angular.io/api/router/ResolveFn) is called before a route
  is activated. But this one is different than `CanActivateFn`, because it's
  purpose is exclusively for data fetching.

Since in Angular version 14.1 the
[CanMatchFn](https://angular.io/api/router/CanMatchFn) was added, the
`CanLoadFn`, `CanActivateFn` and `CanActivateChildFn` seems to be less useful
for data fetching, because with `CanMatchFn` you can prevent a route from being
matched at all. And routes that are not going to be matched **will not be loaded
or activated**. So `CanMatchFn` is more powerful than the `CanLoadFn` and
`CanActivate(Child)Fn` because it's evaluated sooner. But its downside is that
the `route` parameter is not yet a fully qualified `ActivatedRouteSnapshot`, so
getting url params is not easy
([see explanation](https://github.com/angular/angular/issues/49309#issuecomment-1453863052)).

Let's look at the canActivate and resolve guards more in detail and how they
could be used for data fetching.

### canActivate

A canActivate guard comes in two forms. The first is the deprecated
[`CanActivate`](https://angular.io/api/router/CanActivate) interface. The second
is it's newer equivalent, the
[`CanActivateFn`](https://angular.io/api/router/CanActivateFn).

A guard can only return two types of values, a `boolean` or a `UrlTree`. When
returning `true`, the navigation succeeds. When returning `false`, navigation is
cancelled (as if nothing happened). When returning a `UrlTree`, the router will
navigate to that `UrlTree` instead. You could see it as a redirect. More often
than not, the value you need to determine the result for the guard to return is
coming from either a HTTP request or some data store. So, in order to make the
guard asynchronous, you can return an `Observable<boolean | UrlTree>` or a
`Promise<boolean | UrlTree>` as well.

Now that we've cleared that up, let's look at how we would solve the Tour of
Heroes issues with `CanActivateFn`.

```typescript
// hero-loader.ts
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { BehaviorSubject, map } from 'rxjs';
import { Hero } from './hero';

import { HeroService } from './hero.service';

declare global {
  var hero: BehaviorSubject<null | Hero>;
}

window.hero = new BehaviorSubject<Hero | null>(null);

export const heroLoader: CanActivateFn = (route) => {
  const id = Number(route.paramMap.get('id')!);
  const router = inject(Router);
  const heroService = inject(HeroService);

  return heroService.getHero(id).pipe(
    map((hero) => {
      window.hero.next(hero);
      return Boolean(hero) || router.createUrlTree(['/not-found']);
    })
  );
};
```

Here we define a loader function which implement the `CanActivateFn` interface.
It mainly comprises of three parts:

- get some data from the route (the `id` param value)
- use it to fetch the hero and save it in a global variable for later use (here
  `Window`)
- handle the edge case (i.e. navigation to a 'Not found' page in case the hero
  can't be found)

Then, we use this function in the router config:

```diff
+ import { heroLoader } from './hero-loader';

const routes: Routes = [
  // ...
  {
    path: 'detail/:id',
    component: HeroDetailComponent,
    // 🔽🔽🔽 canActivate config added here 🔽🔽🔽
+    canActivate: [heroLoader],
  },
  // ...
];
```

And remove the data fetching logic from the `HeroDetailComponent`:

```typescript
import { Component } from '@angular/core';
import { Location } from '@angular/common';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css'],
})
export class HeroDetailComponent {
  hero$ = window.hero!;

  constructor(private heroService: HeroService, private location: Location) {}

  goBack(): void {
    this.location.back();
  }

  save(hero: Hero): void {
    this.heroService.updateHero(hero).subscribe(() => this.goBack());
  }
}
```

Now that the hero property is an `Observable<Hero | null>` instead of
`Hero | undefined` we have to change the template a bit:

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

[For a working example on Stackblitz, see here.](https://stackblitz.com/edit/angular-loaders-canactivate?file=src/app/hero-loader.ts)

### resolve

Last on the list, but not least is the resolve guard. A resolve guard comes in
two forms. The first is the deprecated
[`Resolve`](https://angular.io/api/router/Resolve) interface. The second is it's
newer equivalent, the [`ResolveFn`](https://angular.io/api/router/ResolveFn).
Resolve guards are a little different in usage and API than the other guards.
Let's review how a resolve might solve our data fetching issues in the Tour of
Heroes. Looking at some code:

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
  const id = Number(route.paramMap.get('id')!);
  const router = inject(Router);
  const heroService = inject(HeroService);

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

Note we still have to pluck the hero from the route data. The plucking requires
a type annotation or a typecast because by default any property on `Data`
resolves to `any`:

```typescript
type Data = {
  [key: string | symbol]: any;
};
```

This typecasting issue is also there in Remix. In Remix we also have to help
typescript to infer the type of the loader using
`useLoaderData<typeof loader>()`.

Now that the hero property is an `Observable<Hero>` instead of
`Hero | undefined` we have to change the template a bit:

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

[For a working example on Stackblitz, see here.](https://stackblitz.com/edit/angular-loaders-resolve?file=src/app/hero-resolver.ts)

## Solutions in review

### General guard data fetching experience

After applying the resolve or canActivate guard there's a change in UX:

- When we click on a hero from the dashboard we stay on the same page.
- In the background the hero is fetched.
- When fetching is done, we see the `HeroDetailComponent` instantly.

To improve the UX we could introduce a global loading indicator using the logic
explained
[in this tutorial by Todd Motto](https://ultimatecourses.com/blog/angular-loading-spinners-with-router-events).
This brings additional benefits, because we only have to build the loading logic
once instead of into each template of several other components!

### canActivate guard

While having the possibility to do a redirect using `UrlTree` is great,
canActivate is not perfect. The ugly part is the extra 'state' management we
have to do. It's not even actual state, it's more of a temporary cache which we
have to keep up to date. If there were more instances of the same component
using the same hero variable, we'd have to resort to a more sophisticated state
management solution like NgRx to organize it, because it can get messy quickly.

### resolve guard

Compared to the canActivate guard, a resolve guard solves the extra state
management we have to do. But a resolve guard also has downsides compared to a
canActivate guard. In case the user navigates to a hero that can't be found, the
edge case logic kicks in, leading to a `router.navigate`. Doing that from a
resolve guard triggers a `NavigationCancel` event. There's
[a long-running open github issue](https://github.com/angular/angular/issues/29089)
about this, but in a nutshell a `NavigationCancel` event confuses the router. It
also messes up the loading indicator logic mentioned above, possibly leading to
a slight flicker of the loader (depending on how it's implemented).

## Conclusion

In this article we've seen how to use the `canActivate` and `resolve` guards to
fetch data for a component, Remix loader style. We've seen they both have their
up- and downsides, but in general they can both get the job done.

While being pretty feature-complete, the Angular team is still actively working
on the router.
[For example see this issue](https://github.com/angular/angular/issues/42953),
saying the architecture is problematic (in 2021). I still expect to see more
improvements in the future. But for now, resolve or canActivate guards are the
closest thing we have to a loader in SPA Angular land.
