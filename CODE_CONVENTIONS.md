# DSpace Angular Code Conventions

DSpace has established coding conventions or best practices that all contributions must follow in order
to be accepted.

These code conventions describe the best practices for design and implementation of DSpace code, helping ensure that all DSpace components have a consistent layout and follow the essential Web Content Accessibility Guidelines ([WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/)).
The best practices for formatting your code are defined in our separate [Code Style Guidelines](CODE_STYLE.md).

For additional guidelines, see the wiki documentation for [User Interface Design Principles & Accessibility](https://wiki.lyrasis.org/spaces/DSDOC10x/pages/408945765/User+Interface+Design+Principles+Accessibility).

1. [Enforcement of Guidelines](#enforcement-of-guidelines)
2. [Angular Guidelines](#angular-guidelines)
   1. [Templates in Base Theme should only use default Bootstrap styling](#templates-in-base-theme-should-only-use-default-Bootstrap-styling)
   2. [Required Bootstrap Components must use `ng-bootstrap` library](#required-bootstrap-components-must-use-ng-bootstrap-library)
   3. [Document methods and classes using TypeDoc](#document-methods-and-classes-using-typedoc)
3. [Accessibility Guidelines](#accessibility-guidelines)


## Enforcement of Guidelines

Enforcement of these code conventions is handled in two ways:
* Some guidelines are enforced strictly via static code tools such as ESLint. Where possible, we prefer to automate enforcement.
* All guidelines are enforced during code review by the assigned reviewers.

## Angular Guidelines

### Templates in Base Theme should only use default Bootstrap styling

All templates in the Base Theme ([/src/app](/src/app) directories) should only use default Bootstrap styling. Documentation at: https://getbootstrap.com/docs/4.6/getting-started/introduction/
* Exceptions may be made for accessibility purposes. For example, Bootstrap notes their [default color scheme does not always have sufficient color contrast](https://getbootstrap.com/docs/4.0/getting-started/accessibility/#color-contrast).

### Required Bootstrap Components must use `ng-bootstrap` library

When Bootstrap Components (accordion, dropdown, etc …) are required you MUST use the included `ng-bootstrap` library. Documentation at: https://ng-bootstrap.github.io/#/components/accordion/examples

### Document methods and classes using TypeDoc

Write [TypeDoc](https://typedoc.org/) comments for all new (or modified) public methods and classes, as well as for large or complex private methods.


## Accessibility Guidelines

The DSpace User Interface strives to align with [WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/) AA criteria. Some AAA criteria may also be supported.  For more information see [Accessibility documentation](https://wiki.lyrasis.org/spaces/DSDOC10x/pages/408944958/Accessibility).

The use of the Bootstrap framework can help in achieving some WCAG goals such as ‘Visual Presentation’ (AAA), 'Parsing' (A), ‘Orientation’ (AA), ‘Reflow’ (AA) and ‘Text Spacing’ (AA). See the Bootstrap chapter ["Accessibility"](https://getbootstrap.com/docs/4.0/getting-started/accessibility/) for an explanation of WCAG and where to find additional information.