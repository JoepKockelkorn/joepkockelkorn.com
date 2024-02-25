---
title: Letting git, eslint, EditorConfig and Prettier cooperate
date: 2024-03-01
draft: true
description: 'How to combine and configure git, eslint, EditorConfig and Prettier to work together in a project.'
---

We all know the eternal debates about tabs vs spaces, single quotes vs double quotes, etc. While they can be entertaining, that is **not**
what this blog post is about. This article is about combining and configuring git, eslint, EditorConfig and Prettier to work together in a
project. So you can work together with your team without having to worry (too much) about formatting and style.

# Why do we need these tools

In my career so far I've have seen many different ways of formatting and styling code. When no code style/format is enforced, it leads to
many discussions and thus time lost. Also, the codebase will soon have many different formatting flavors of code in the same repository. If
you recognize any of these situations, you know what I'm talking about:

> Why are you using tabs instead of spaces? I can't read this code.

> Your PR has a lot of changes, but it's only formatting. It's hard to see what really changed.

> I'm getting an error when I try to run this file on my Windows machine. What OS are you using?

So we want to standardize and enforce. But first some explanation on the tools we are going to use.

# How they overlap

<!-- TODO: venn diagram? timeline? -->

# How to configure them

## git

TODO: gitattributes

## EditorConfig

TODO: .editorconfig

## Prettier

TODO: .prettierrc

## eslint

TODO: .eslintrc

<!-- TODO: explain solution for Docker container comment from blog post: https://dev.to/deadlybyte/please-add-gitattributes-to-your-git-repository-1jld/comments -->
