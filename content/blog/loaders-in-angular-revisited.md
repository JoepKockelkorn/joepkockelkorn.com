---
title: Loaders in Angular, revisited
date: 2023-09-13
draft: true
description: 'Using new Angular APIs to bring the concept of Remix loaders closer to Angular than before.'
---

## New routing feature in Angular 16

It's already six months ago since Angular v16 was released (time flies), and it brought a lot of new features. One of them is the ability to
bind router data to component `@Input()`s. First you configure the route:

```ts
const routes = [
	{
		path: 'about',
		loadComponent: () => import('./about'),
		resolve: { contact: () => getContact() },
	},
];
```

Then you can use the `contact` data in the component:

```ts
@Component(...)
export class About {
  // The value of "contact" is passed to the contact input
  @Input() contact?: string;
}
```

The feature can be enabled by calling [`withComponentInputBinding()`](https://angular.io/api/router/withComponentInputBinding) as part of
`provideRouter`:

```ts
const routes = [];

provideRouter(routes, withComponentInputBinding());
```

### Less code needed

Since we can now directly bind data from the router to a component, it takes less code to 'inject' the data in the component. An example:

```ts
// Before
@Component(...)
export class About {
  contact = this.route.data.pipe(map(data => data.contact as Contact));
  // data.contact is of type any, so casting or parsing needed 🫠

  constructor(private route: ActivatedRoute) {}
}
```

```ts
// After
@Component(...)
export class About {
  @Input() contact?: Contact; // ⬅️ type assignment needed
}
```

### Children benefit too

Also, any child component can bind the data via an `@Input()` as well, without prop-drilling. Gotcha: it has to use the same name and you
have to enable `paramsInheritanceStrategy` with value 'always' in the router config:

```ts
provideRouter(
	routes,
	withComponentInputBinding(),
	withRouterConfig({ paramsInheritanceStrategy: 'always' }), // ⬅️ this
);
```

## Setting things straight

This blog post will try to be the best example of bringing the concept of Remix loaders to Angular. But before I do that, I have to set
something straight. In [the previous blog post](../loaders-in-angular), I wrote that the `resolve` function is not so great. I said:

> Doing a `router.navigate` from a resolve guard triggers a `NavigationCancel` event. There's
> [a long-running open github issue](https://github.com/angular/angular/issues/29089) about this, but in a nutshell a `NavigationCancel`
> event confuses the router. It also messes up
> [the loading indicator logic](https://ultimatecourses.com/blog/angular-loading-spinners-with-router-events), possibly leading to a slight
> flicker of the loader.

This is not entirely true. A `NavigationCancel` does not confuse the router. I actually meant to say: _"an **additional** `NavigationCancel`
event confuses the router"_. The additional `NavigationCancel` event will be triggered by the `router.navigate` done in the resolve. But the
`router.navigate` can be prevented by returning an `Observable` that never completes. I found out by reading the documentation of the
`NavigationCancellationCode` enum, which is living on the `code` property of a `NavigationCancel` event:

```ts
// the enum
enum NavigationCancellationCode {
  Redirect
  SupersededByNewNavigation
  NoDataFromResolver
  GuardRejected
}
```

[The docs](https://angular.io/api/router/NavigationCancellationCode#members) of the `NoDataFromResolver` value say:

> A navigation failed because one of the resolvers completed without emitting a value.

So if we don't return a value from a resolver, the loading indicator logic will work as expected and only a single `NavigationCancel` event
will be triggered. This does however mean the redirect logic should be moved elsewhere. To still have the 'redirect to 404' logic, we can
add some code to the app component:

```ts
@Component(...)
export class AppComponent implements OnInit {
  #router = inject(Router);

  ngOnInit() {
    this.#router.events.subscribe((event) => {
      if (event instanceof NavigationCancel && event.code === NavigationCancellationCode.NoDataFromResolver) {
        this.#router.navigateByUrl('/404', { replaceUrl: true });
      }
    });
  }
}
```

As you can see, we use the `code` property of the `NavigationCancel` event to check if the resolver returned no data. If so, we navigate to
the 404 page and replace the url. We replace the url because otherwise the browser back button will just trigger the 404 redirect again.

The conclusion is that `ResolveFn` is not so bad. It prevents us from having to do state management outside of any route guard, which means
less code. So let's put it to good use.

## Remixing the loader into Angular

<!-- TODO: explain feature you typically need in a production app like 404 behavior, permission checking on the data level, an app global loading indicator, reuse of types (and data revalidation?) -->
<!-- TODO: explain how I applied concepts of Remix to achieve those -->
