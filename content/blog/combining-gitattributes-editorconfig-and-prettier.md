---
title: Combining gitattributes, EditorConfig and Prettier
date: 2024-03-16
draft: true
description: 'How to combine and configure git, EditorConfig and Prettier in a project.'
---

We all know the eternal debates about tabs vs spaces, single vs double quotes, and so on. They can be entertaining, but also time-consuming.
This article will explain how to combine git, EditorConfig and Prettier so you can focus on shipping features instead of debating endlessly
about that missing semicolon on line 39.

I've intentionally left eslint out of scope, because this post is about formatting.
[And linting is not formatting](https://www.joshuakgoldberg.com/blog/you-probably-dont-need-eslint-config-prettier-or-eslint-plugin-prettier/).
Whatever you do, please don't use eslint for formatting.

# Why do we need these tools

During my career I've have seen many different ways of formatting code. When no single format is enforced, it leads to many discussions and
thus time lost. Also, the codebase will soon have many different formatting flavors in the same repository. If you recognize any of these
situations, you know what I'm talking about:

> Why are you using tabs instead of spaces? I can't read this code.

> Your PR has a lot of changes, but it's only formatting. It's hard to see what really changed.

> I'm getting an error when I try to run this file on my Windows machine. What OS are you using?

So we want to standardize and enforce. The next chapters will go through each tool and how to configure them.

!!! info Disclaimer

Discuss and/or tweak the settings however you want, but whatever you do, use and enforce **a single standard**. Not everyone has to agree
with it, but everyone must comply.

!!!

# gitattributes

Git is a version control system, not a formatting tool. However, it does have some formatting capabilities though limited. In the
[`.gitattributes`](https://git-scm.com/docs/gitattributes) file you can configure line endings behavior. Here is the config I use:

```text
* text=auto

*.{cmd,[cC][mM][dD]} text eol=crlf
*.{bat,[bB][aA][tT]} text eol=crlf
*.{ics,[iI][cC][sS]} text eol=crlf
*.sh text eol=lf
```

Let's go through it. At the top, I set the baseline `text=auto` on every file. This makes sure that whenever a `git commit` or `add` is
done, git will normalize line endings (to `LF`) in the index. And whenever a `git checkout`, `merge` or `switch` is done, git will convert
the normalized line endings to the native line endings for the operating system.

Converting line endings **on checkout/switch/merge** is important because different operating systems use different line endings. Windows
uses CRLF, while Unix uses LF. If you have a file with CRLF line endings in a Unix environment, it could potentially not work when you run
it. And vice versa.

Normalizing line endings **on commit/add** is important because it makes sure that the line endings are consistent in the repository. This
makes it easier to review changes in a PR. Also, if you have a file with mixed line endings it could potentially cause merge conflicts.

There are some exceptions, some files do not make sense to normalize. For example, `.bat` files should always have CRLF line endings,
because they can only run in Windows. The same goes for bash scripts in Unix, which should always have LF line endings. I've copied this
setup from [this blog post](https://rehansaeed.com/gitattributes-best-practices/) by Muhammad Rehan Saeed.

# EditorConfig

Next up is [EditorConfig](https://editorconfig.org/). Compared to git, EditorConfig is a tool solely about maintaining consistent coding
styles, so it has some more formatting related features. Here is the config I use:

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

- charset to `utf-8`: This is **the** most common/dominant encoding.
- indent_style to `tab`: This is truly a personal preference and many words have already been written on it, but just use one of the two. I
  like the accessibility of tabs, but I won't go into details.
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
the box. Make sure it is [installed as a dev dependency](https://www.npmjs.com/package/@prettier/plugin-xml).

Then, I set the following options:

- singleQuote to `true`: This makes sure that single quotes are used instead of double quotes. Pick whatever you like, but stick to it.
- semi to `false`: This makes sure that no semicolons are used. This makes refactoring easier, and less is more.
- bracketSpacing to `true`: This makes sure there is a space between the brackets and the content, and thus improves readability.
- bracketSameLine to `false`: This makes sure that for HTML-like languages, the closing bracket of the opening tag is **not** on the same
  line as the last line of the opening tag. Also makes it more readable.
  [See an example here](https://prettier.io/docs/en/options.html#bracket-line).
- trailingComma to `all`: This makes sure that there is a trailing comma wherever possible. This makes refactoring easier.

!!! info Prettier follows EditorConfig

You might be missing the `printWidth`, `tabWidth` or `useTabs` options in my Prettier config. But I omitted them on purpose, because
Prettier will respect the settings from EditorConfig. And because EditorConfig applies to more files it's better to have the settings in
EditorConfig and let Prettier use them.

!!!

# Editor integration

The `.gitattributes` settings automatically apply when you commit/add or merge/checkout files or switch branches. For the EditorConfig
settings to work you (possibly) need to have [a plugin installed in your editor](https://editorconfig.org/). For Prettier, you also need to
have the plugin installed in your editor. See [the Prettier website](https://prettier.io/docs/en/editors.html) for more information.

# Further improvements

While the editor integrations are nice, they are not enforced. People can still commit files that do not adhere to the settings.

As a first improvement you could format the files on the pre-commit git hook. For example, use
[the Prettier cli](https://prettier.io/docs/en/cli) together with [lint-staged](https://www.npmjs.com/package/lint-staged) registered by
[husky](https://typicode.github.io/husky/). Configuring this is out of scope for this blog post.

This however can still be bypassed (`git commit --no-verify`). So as a second improvement you could use a CI/CD pipeline to check the
formatting. You can [run the Prettier CLI in the pipeline](https://prettier.io/docs/en/cli#--check), failing the pipeline when the
formatting is not correct. This is also out of scope for this blog post. There are plenty of examples available on the internet.

# Building docker containers

If you are building a Docker container, you might want to convert line endings for the target operating system. This has the same reason as
mentioned in the gitattributes section: the docker container might not work if the line endings are not compatible with the underlying
operating system. There is conversion tooling available ([this](https://linux.die.net/man/1/unix2dos) and
[that](https://linux.die.net/man/1/dos2unix)), but I'll leave it as an exercise for the reader to use them.

# Conclusion

In this blog post I've shown how to combine and configure git, EditorConfig and Prettier, so you don't have to manually format your code.
These tools can be integrated in your IDE so the formatting is automatically applied while you program. To be safe you should also add
checks in your CI/CD pipeline so everyone is guaranteed to adhere to the formatting.
