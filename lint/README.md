# DSpace ESLint plugins

Custom ESLint rules for DSpace Angular peculiarities.

## Usage

These plugins are included with the rest of our ESLint configuration in [.eslintc.json](../.eslintrc.json). Individual rules can be configured or disabled there, like usual.
- In order for the new rules to be picked up by your IDE, you should first run `yarn build:lint` to build the plugins.
- This will also happen automatically each time `yarn lint` is run.

## Documentation

The rules are split up into plugins by language:
- [TypeScript rules](../docs/lint/ts/index.md)
- [HTML rules](../docs/lint/html/index.md)

> Run `yarn docs:lint` to generate this documentation!

## Developing

### Overview

- All rules are written in TypeScript and compiled into [`dist`](./dist)
  - The plugins are linked into the main project dependencies from here
  - These directories already contain the necessary `package.json` files to mark them as ESLint plugins
- Rule source files are structured, so they can be imported all in one go
  - Each rule must export the following:
    - `Messages`: an Enum of error message IDs
    - `info`: metadata about this rule (name, description, messages, options, ...)
    - `rule`: the implementation of the rule
    - `tests`: the tests for this rule, as a set of valid/invalid code snippets. These snippets are used as example in the documentation.
  - New rules should be added to their plugin's `index.ts`
- Some useful links
  - [Developing ESLint plugins](https://eslint.org/docs/latest/extend/plugins)
  - [Custom rules in typescript-eslint](https://typescript-eslint.io/developers/custom-rules)
  - [Angular ESLint](https://github.com/angular-eslint/angular-eslint)

### Parsing project metadata in advance ~ TypeScript AST

While it is possible to retain persistent state between files during the linting process, it becomes quite complicated if the content of one file determines how we want to lint another file.
Because the two files may be linted out of order, we may not know whether the first file is wrong before we pass by the second. This means that we cannot report or fix the issue, because the first file is already detached from the linting context.

For example, we cannot consistently determine which components are themeable (i.e. have a `ThemedComponent` wrapper) while linting.
To work around this issue, we construct a registry of themeable components _before_ linting anything.
- We don't have a good way to hook into the ESLint parser at this time
- Instead, we leverage the actual TypeScript AST parser
  - Retrieve all `ThemedComponent` wrapper files by the pattern of their path (`themed-*.component.ts`)
  - Determine the themed component they're linked to (by the actual type annotation/import path, since filenames are prone to errors)
  - Store metadata describing these component pairs in a global registry that can be shared between rules
- This only needs to happen once, and only takes a fraction of a second (for ~100 themeable components)