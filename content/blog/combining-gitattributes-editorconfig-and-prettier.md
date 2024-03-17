---
title: Combining gitattributes, EditorConfig and Prettier
date: 2024-03-16
draft: true
description: 'How to combine and configure git, EditorConfig and Prettier to work together in a project.'
---

We all know the eternal debates about tabs vs spaces, single quotes vs double quotes, etc. While they can be entertaining, that is **not**
what this blog post is about. This article is about combining and configuring git, EditorConfig and Prettier to work together in a project.
So you can work together with your team without having to worry (too much) about formatting.

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

!!! info Disclaimer

For all settings the following is true: argue or tweak however you want, but it's better to have a standard than to have none.

!!!

# gitattributes

The scope of git regarding formatting is rather limited, but very powerful. In the
[`.gitattributes`](https://git-scm.com/docs/gitattributes) file you can only configure line endings behavior. Here is the config I use:

```text
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

Next up is [EditorConfig](https://editorconfig.org/). It is a bit more powerful than gitattributes regarding formatting, but also has its
limits. Here is the config I use:

```text
root = true

[*]
charset = utf-8
indent_style = tab
insert_final_newline = true
trim_trailing_whitespace = true
max_line_length = 80

[*.md]
max_line_length = off
trim_trailing_whitespace = false
```

Let's go through it. At the top, I set `root = true`, which tells EditorConfig to stop looking for an `.editorconfig` file in parent
directories. Then, I set the baseline for all files (targeted by the `*`), which is:

- charset to `utf-8`: This is the most common encoding.
- indent_style to `tab`: This is truly a personal preference and many words have already been written on it, but just use one of the two.
- insert_final_newline to `true`: This makes sure that every file ends with a newline. This is important because some tools (like `cat`)
  will not display the last line of a file if it doesn't end with a newline. Also see
  [this answer on StackOverflow](https://stackoverflow.com/a/729795/5475829).
- trim_trailing_whitespace to `true`: This makes sure that no trailing whitespace is left in the file. Because well, less is better.
- max_line_length to `80`: This wraps most lines at 80 characters. This is a common convention, and it's also the default in many tools. It
  also improves readability, and also gives the writer a good indication when the code might be getting too long and should be split up.

For markdown files I set some exceptions. Markdown files are often used for documentation, and therefore often go over 80 characters per
line. Trailing whitespace could potentially be used for alignment/aesthetics.

# Prettier

While gitattributes and EditorConfig are good for the basics and work on all files, they have a rather limited formatting scope.
[Prettier](https://prettier.io/docs/en/configuration.html) on the other hand is more powerful and opinionated but works on only a few file
types. Here is the config I use:

```json
{
	"plugins": ["@prettier/plugin-xml"],
	"singleQuote": true,
	"semi": false,
	"bracketSpacing": true,
	"bracketSameLine": false,
	"trailingComma": "all"
}
```

Let's go through it. First, I set the `plugins` to include `@prettier/plugin-xml`. This is because prettier does not format xml files out of
the box. Make sure it is installed as a dev dependency.

Then, I set the following options:

- `singleQuote` to `true`: This makes sure that single quotes are used instead of double quotes.
- `semi` to `false`: This makes sure that no semicolons are used. This makes refactoring easier, and less is more.
- `bracketSpacing` to `true`: This makes sure there is a space between the brackets and the content, and thus improves readability.
- `bracketSameLine` to `false`: This makes sure that for HTML-like languages, the closing bracket of the opening tag is **not** on the same
  line as the last line of the opening tag. Makes it more readable.
  [See an example here](https://prettier.io/docs/en/options.html#bracket-line).
- `trailingComma` to `all`: This makes sure that there is a trailing comma wherever possible. This makes refactoring easier.

!!! info Adhere to EditorConfig

Prettier will respect the settings from EditorConfig. And because EditorConfig applies to more files than Prettier, I did not include the
`printWidth`, `tabWidth` and `useTabs` options in the Prettier config.

!!!

# Editor integration

TODO: explain how to integrate EditorConfig and Prettier in your editor/workflow

# How to enforce

TODO: explain how to enforce these settings in a pipeline

# Other exceptions

TODO: explain solution for Docker container comment from blog post:
https://dev.to/deadlybyte/please-add-gitattributes-to-your-git-repository-1jld/comments
