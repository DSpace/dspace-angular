# DSpace Angular/Typescript Code Style Guidelines

DSpace has established code style / code formatting guidelines that all contributions must follow in order
to be accepted.

These code style guidelines describe the best practices for formatting your code. The best practices for design and implementation of your code are defined in our separate [Code Conventions](CODE_CONVENTIONS.md).

* [Enforcement of Guidelines](#enforcement-of-guidelines)
* [TypeScript Style Guide](#typescript-style-guide)
* [Angular Style Guide](#angular-style-guide)
* [IDE Support](#ide-support)


## Enforcement of Guidelines

Enforcement is handled by [ESLint](https://eslint.org/) using the configuration file in the root source directory: [.eslintrc.json](.eslintrc.json).

If you would like to pre-check your Pull Request for any Code Style issues, you can do so by running:

```
npm run lint
```

Code contributions may only suppress these rules if pre-approved. Code may suppress these rules by using [ESLint configuration comments](https://eslint.org/docs/latest/use/configure/rules#use-configuration-comments-1), for example `/* eslint-disable [rule-name] */`.

The DSpace TypeScript Style Guide is enforced on all Pull Requests to the "main" branch in `dspace-angular`. Therefore, if a Pull Request to the "main" branch does not align with the Style Guide, it will fail the build process within our GitHub CI.

## TypeScript Style Guide

For the DSpace Angular UI (written in TypeScript), we use [ESLint](https://eslint.org/) to validate the style of all Typescript (*.ts) files.  
All style rules are defined in [.eslintrc.json](.eslintrc.json).

## Angular Style Guide

Follow the [official Angular style guide](https://angular.dev/style-guide). It contains guidelines for naming files, directory structure, etc.

## IDE Support

Most IDEs include an ESLint plugin which can automatically enforce the defined style rules in your Typescript code.
