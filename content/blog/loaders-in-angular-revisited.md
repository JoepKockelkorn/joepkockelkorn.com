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

The feature can be enabled by providing
[`https://angular.io/api/router/withComponentInputBinding`](https://angular.io/api/router/withComponentInputBinding) as part of
`provideRouter`:

```ts
const appRoutes: Routes = [];
bootstrapApplication(AppComponent, {
	providers: [provideRouter(appRoutes, withComponentInputBinding())],
});
```

### Less code needed

Since we can now directly bind data from the router to a component, it takes less code to 'inject' the data in the component. An example:

```ts
// Before
@Component(...)
export class About {
  contact = this.route.data.pipe(map(data => data.contact as Contact)); // ⬅️ is of type `any`, so casting or parsing needed 🫠

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

Also, any child component of the component with the resolved data can bind via an `@Input()` as well, without prop-drilling. Gotcha: it has
to use the same name.

## Setting things straight

In this blog post I want to show **the** way to bring the concept of Remix loaders closer to Angular than before. But before we do that, I
have to set some things straight. In [the previous blog post](./loaders-in-angular), I wrote that the `resolve` function is not so great. I
said:

> In case the user navigates to a hero that can't be found, the edge case logic kicks in, leading to a `router.navigate`. Doing that from a
> resolve guard triggers a `NavigationCancel` event. There's
> [a long-running open github issue](https://github.com/angular/angular/issues/29089) about this, but in a nutshell a `NavigationCancel`
> event confuses the router. It also messes up the loading indicator logic mentioned above, possibly leading to a slight flicker of the
> loader (depending on how it's implemented).

This is not entirely true. The `NavigationCancel` event I spoke of is actually an **additional** `NavigationCancel` event, because of the
`router.navigate` done in the resolve. It can be prevented by returning an `Observable` that never completes. It will result in a **single**
`NavigationCancel` event. The loading indicator logic will then work as expected.

To still have the 'redirect to 404' logic, we can add some code to the app component:

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
the 404 page and replace the url to prevent the user from going back to the page that couldn't be resolved by clicking the back button. The
enum `NavigationCancellationCode` is provided by Angular,
[you can look at the possible values here](https://angular.io/api/router/NavigationCancellationCode).

So conclusion: `ResolveFn` is not so bad, so let's put it to good use.

## Remixing the loader

<!-- TODO: explain feature you typically need in a production app like 404 behavior, permission checking on the data level, an app global loading indicator, reuse of types (and data revalidation?) -->
<!-- TODO: explain how I applied concepts of Remix to achieve those -->
