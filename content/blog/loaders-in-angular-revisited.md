---
title: Loaders in Angular, revisited
date: 2023-09-13
draft: true
description: 'Using new Angular APIs to bring the concept of Remix loaders closer to Angular than before.'
---

In my previous blog post I wrote about how to use the concept of loaders in Angular. Since then, Angular v16 was released and it brought a
new feature which simplifies the code needed, so it's time for an update.

## New routing feature in Angular 16

It's already six months ago since Angular v16 was released (time flies). One of the new features is the ability to bind router data to
component `@Input()`s. First you configure the route:

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
// typically done in the main.ts file
provideRouter(routes, withComponentInputBinding());
```

### Less code needed

Since we can now directly bind data from the router to a component, it takes less code to 'inject' the data in the component. An example:

```ts
// Before
@Component(...)
export class About {
  contact = this.route.data.pipe(map(data => data.contact as Contact));
  // data.contact is of type any, casting or parsing needed 🫠

  constructor(private route: ActivatedRoute) {}
}
```

```ts
// After
@Component(...)
export class About {
  @Input() contact?: Contact; // ⬅️ still type assignment needed
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
event confuses the router"_. The additional `NavigationCancel` event will be triggered by the `router.navigate` done in the resolve. But
doing a `router.navigate` can be prevented in the resolve by returning an `Observable` that never completes. I found out by reading the
documentation of the `NavigationCancellationCode` enum, which is living on the `code` property of a `NavigationCancel` event:

```ts
// the enum
enum NavigationCancellationCode {
  Redirect
  SupersededByNewNavigation
  NoDataFromResolver // ⬅️ this is the case we aim for
  GuardRejected
}
```

[The docs](https://angular.io/api/router/NavigationCancellationCode#members) of the `NoDataFromResolver` value say:

> A navigation failed because one of the resolvers completed without emitting a value.

So if we don't return a value from a resolver,
[the loading indicator logic](https://ultimatecourses.com/blog/angular-loading-spinners-with-router-events) will work as expected and only a
single `NavigationCancel` event will be triggered. This does however mean the redirect logic is no longer in the guard. To still have the
app redirect to a 404 page when the resolver returns no data, we can add a side-effect to the app component:

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
the 404 page and replace the url. We replace the url because otherwise the browser back button will just trigger the 404 redirect again,
seemingly doing nothing. This small piece of code will handle **all** cases where resolve guards emit nothing, for the whole app, instead of
having to redirect to 404 in every resolve guard.

My conclusion is that `ResolveFn` is not so bad after all. It prevents us from having to do additional state management outside of any route
guard, which means less code. So let's put it to good use.

## Remixing the loader into Angular

To have a proper example of how to use the concept of Remix loaders in Angular, I created a small app. You can find the source code on
github: [JoepKockelkorn/loaders-in-angular](https://github.com/JoepKockelkorn/loaders-in-angular).

It's a simple books app where the user can view an overview of books and when they're an admin of a book, they can also toggle the
availability on a detail page.

These are the possible routes:

- `/`
- `/login`
- `/books`
- `/books/:id`
- `/books/:id/general`
- `/books/:id/admin`
- `/404`

This is the behavior:

- All the routes under `/books` are protected
- The `/books` route shows a list of books, the user can click on a book to go to `/books/:id`
- The `/books/:id` route shows some basic info on a book plus an outlet for two tabs:
  - general (this is the default)
  - admin
- The `/books/:id/admin` route is extra protected by authorization, only users with the `isAdmin` property **of a book** set to `true` can
  access it
- Whenever the user tries to access a protected route, the app redirects to `/404`
- Whenever a book is not found, the app redirects to `/404`
- Whenever a route is not found, the app redirects to `/404`

## The code

Let's see how the `/books` route uses the concept of a loader. This is the component file:

```ts
// books.component.ts
@Component({
  ...
  template: `
    <div *ngFor="let book of books" class="book">
      <a [routerLink]="['./', book.id]">{{ book.title }}</a>
    </div>
  `
})
export default class BooksComponent {
  @Input() books: Resolved<typeof loader> = [];
}
```

Unfortunately the loader can't be exported from the same file as the component, because that would eagerly load the component, even when
using `loadComponent` in the router config. So I've put the loader in a separate file:

```ts
// books.loader.ts
export const loader = () => inject(BooksService).getBooks();
```

In the same way as in Remix, I've reused the type of the `loader` function when declaring the type of the `@Input()`. The `Resolved` type is
a small utility type that I've put in a separate file:

```ts
// types.ts
import { ResolveFn } from '@angular/router';

export type Resolved<T> = T extends ResolveFn<infer R> ? R : never;
```

It's basically returning the type of the data that the loader function loads.

The router config looks like this:

```ts
import { loader as booksLoader } from './books.loader';

const routes = [
	// ...other routes
	{
		path: 'books',
		loadComponent: () => import('./books.component'),
		resolve: { books: booksLoader },
	},
];
```

The `booksLoader` is passed to the `resolve` property of the route config. There is some repetition in the router config and in the
component, both hard-reference the `books` key. But that key could also be moved to a variable and imported in both places, so it's not a
big deal.

Now when the user navigates to `/books`, the `booksLoader` is called and the result is passed to the `books` input of the `BooksComponent`.
The component can then use the data to render the list of books. No state management needed. Nice.

## The details

For the details page, I've created a `BookDetailsComponent` and a `loader`. The `BookDetailsComponent` is a bit more complex than the
`BooksComponent` because it has to handle the case the book is not found. This is the (simplified) component file:

```ts
// book-details.component.ts
@Component({
	template: `
		<h1>{{ book.title }}</h1>
		<div>
			<a [routerLink]="['./', 'general']">General</a>
			<a *ngIf="book.isAdmin" [routerLink]="['./', 'admin']">Admin</a>
		</div>
		<router-outlet></router-outlet>
		<a [routerLink]="['../', book.id + 1]">Try next book</a>
	`,
})
export default class BookDetailsComponent {
	@Input() book!: Resolved<typeof loader>;
}
```

This is the loader:

```ts
// book-details.loader.ts
export const loader = (route: ActivatedRouteSnapshot) => {
	const bookId = route.paramMap.get('bookId');
	return from(inject(BooksService).getBook(bookId!)).pipe(filter(Boolean));
};
```

Here we get a book by id from the `BooksService`. We then transform the `Promise<Book>` to an `Observable<Book>` and filter out the
`undefined` value so when the book is not found, the resolve will emit nothing. This will trigger the `NavigationCancel` event, which will
lead to a redirect to the 404 page because of the listener in the `AppComponent` as described under
[Setting things straight](#setting-things-straight).

The router config looks like this:

```ts
import { loader as bookLoader } from './book-details.loader';

const routes = [
	// ...other routes
	{
		path: 'books/:bookId',
		loadComponent: () => import('./book-details.component'),
		runGuardsAndResolvers: 'always',
		resolve: { book: bookLoader },
	},
];
```
