---
title: My first blog post
date: 2023-04-01
draft: true
description: This would be my first blog post
categories:
  - example
---

# Paragraphs

_Deserunt consectetur et adipisicing_ velit ullamco anim est consectetur enim excepteur. Consectetur labore culpa non reprehenderit irure ut
laboris Lorem excepteur. Minim proident eiusmod nostrud anim laborum.

**Deserunt consectetur et adipisicing** velit ullamco anim est consectetur enim excepteur. Consectetur labore culpa non reprehenderit irure
ut laboris Lorem excepteur. \*Minim proident eiusmod nostrud anim laborum\*.

~~Deserunt consectetur et adipisicing~~ velit ullamco anim est consectetur enim excepteur. Consectetur labore culpa non reprehenderit irure
ut laboris Lorem excepteur. **_Minim proident eiusmod nostrud anim laborum._**

<sub>Subscript</sub>

<sup>Superscript</sup>

Divider:

---

# Heading 1

## Heading 2

### Heading 3

#### Heading 4

---

# Code

```tsx
function Counter() {
	const [count, setCount] = React.useState(0);
	const increment = () => setCount((c) => c + 1);
	return <button onClick={increment}>{count}</button>;
}

function App() {
	return <Counter />;
}
```

Hello, `some inline code`, as example.

# Table

| Heading | Heading | Heading |
| ------- | ------- | ------- |
| Cell    | Cell    | Cell    |
| Cell    | Cell    | Cell    |

# Links

[Link to another page](https://google.com).

# Images

![Image](https://ik.imagekit.io/joepkockelkorn/tr:ar-16-9,w-768,f-auto/mindspace-studio-UrrYymj6R80-unsplash.jpg)

# Lists

## Unordered

- Item 1
- Item 2
- Item 3
  - Nested item 1
  - Nested item 2

## Ordered

1. Item 1
2. Item 2
3. Item 3
4. Nested item 1
5. Nested item 2

# Blockquote

> This is a blockquote

# Footnotes

Here is a simple footnote[^1].

A footnote can also have multiple lines[^2].

[^1]: My reference.
[^2]: To add line breaks within a footnote, prefix new lines with 2 spaces. This is a second line.
