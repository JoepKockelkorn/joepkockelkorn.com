---
title: Combining gitattributes, EditorConfig and Prettier
date: 2024-03-16
draft: true
description: 'How to combine and configure git, EditorConfig and Prettier to work together in a project.'
---

We all know the eternal debates about tabs vs spaces, single quotes vs double quotes, etc. While they can be entertaining, that is **not**
what this blog post is about. This article is about combining and configuring git, EditorConfig and Prettier to work together in a project.
So you can work together with your team without having to worry (too much) about formatting and style.

I've intentionally left eslint out of scope, because this post is about formatting. And linting is not formatting. Whatever you do, don't
use eslint for formatting. That's what Prettier is for
([link](https://www.joshuakgoldberg.com/blog/you-probably-dont-need-eslint-config-prettier-or-eslint-plugin-prettier/)).

# Why do we need these tools

In my career so far I've have seen many different ways of formatting code. Anyway, when no format is enforced, it leads to many discussions
and thus time lost. Also, the codebase will soon have many different formatting flavors in the same repository. If you recognize any of
these situations, you know what I'm talking about:

> Why are you using tabs instead of spaces? I can't read this code.

> Your PR has a lot of changes, but it's only formatting. It's hard to see what really changed.

> I'm getting an error when I try to run this file on my Windows machine. What OS are you using?

So we want to standardize and enforce. The next chapters will go through each tool and how to configure them.

# gitattributes

The scope of git regarding formatting is rather limited, but very powerful. In the
[`.gitattributes`](https://git-scm.com/docs/gitattributes) file you can only configure line endings behavior. Here is the config I use:

```
* text=auto

*.{cmd,[cC][mM][dD]} text eol=crlf
*.{bat,[bB][aA][tT]} text eol=crlf
*.{ics,[iI][cC][sS]} text eol=crlf
*.sh text eol=lf
```

Let's go through it. At the top, I set the baseline, apply `text=auto` on every file. This makes sure that whenever a commit is done, git
will normalize line endings (to `LF`) in the index. And whenever a checkout is done, git will convert the normalized line endings to the
native line endings for the platform.

Converting line endings on checkout is important because different operating systems use different line endings. Windows uses CRLF, while
Unix uses LF. If you have a file with CRLF line endings in a Unix environment, it could potentially not work when you run it. And vice
versa.

Normalizing line endings on commit is important because it makes sure that the line endings are consistent in the repository. This is
important because it makes it easier to review changes, and it makes it easier to merge changes. If you have a file with mixed line endings,
it could potentially cause merge conflicts.

There are some exceptions, some files do not make sense to normalize. For example, `.bat` files should always have CRLF line endings,
because they can only run in Windows. The same goes for bash scripts, which should always have LF line endings, because they are used in
Unix. This idea I've copied from [this blog post](https://rehansaeed.com/gitattributes-best-practices/).

# EditorConfig

TODO: .editorconfig

# Prettier

TODO: .prettierrc

# Exceptions

TODO: explain solution for Docker container comment from blog post:
https://dev.to/deadlybyte/please-add-gitattributes-to-your-git-repository-1jld/comments
