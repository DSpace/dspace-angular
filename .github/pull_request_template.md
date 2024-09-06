## References
_Add references/links to any related issues or PRs. These may include:_
* Fixes #issue-number (if this fixes an issue ticket)
* Requires DSpace/DSpace#pr-number (if a REST API PR is required to test this)

## Description
Short summary of changes (1-2 sentences).

## Instructions for Reviewers
Please add a more detailed description of the changes made by your PR. At a minimum, providing a bulleted list of changes in your PR is helpful to reviewers.

List of changes in this PR:
* First, ...
* Second, ...

**Include guidance for how to test or review your PR.** This may include: steps to reproduce a bug, screenshots or description of a new feature, or reasons behind specific changes. 

## Checklist
_This checklist provides a reminder of what we are going to look for when reviewing your PR. You do not need to complete this checklist prior creating your PR (draft PRs are always welcome).
However, reviewers may request that you complete any actions in this list if you have not done so. If you are unsure about an item in the checklist, don't hesitate to ask. We're here to help!_

- [ ] My PR is **created against the `main` branch** of code (unless it is a backport or is fixing an issue specific to an older branch).
- [ ] My PR is **small in size** (e.g. less than 1,000 lines of code, not including comments & specs/tests), or I have provided reasons as to why that's not possible.
- [ ] My PR **passes [ESLint](https://eslint.org/)** validation using `npm run lint`
- [ ] My PR **doesn't introduce circular dependencies** (verified via `npm run check-circ-deps`)
- [ ] My PR **includes [TypeDoc](https://typedoc.org/) comments** for _all new (or modified) public methods and classes_. It also includes TypeDoc for large or complex private methods.
- [ ] My PR **passes all specs/tests and includes new/updated specs or tests** based on the [Code Testing Guide](https://wiki.lyrasis.org/display/DSPACE/Code+Testing+Guide).
- [ ] My PR **aligns with [Accessibility guidelines](https://wiki.lyrasis.org/display/DSDOC8x/Accessibility)** if it makes changes to the user interface.
- [ ] My PR **uses i18n (internationalization) keys** instead of hardcoded English text, to allow for translations.
- [ ] My PR **includes details on how to test it**. I've provided clear instructions to reviewers on how to successfully test this fix or feature.
- [ ] If my PR includes new libraries/dependencies (in `package.json`), I've made sure their licenses align with the [DSpace BSD License](https://github.com/DSpace/DSpace/blob/main/LICENSE) based on the [Licensing of Contributions](https://wiki.lyrasis.org/display/DSPACE/Code+Contribution+Guidelines#CodeContributionGuidelines-LicensingofContributions) documentation.
- [ ] If my PR includes new features or configurations, I've provided basic technical documentation in the PR itself.
- [ ] If my PR fixes an issue ticket, I've [linked them together](https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue).
