# Theme-specific translations

Themes can override individual translation keys, so a theme can rename a label or reword a
message without touching the shared language files.

These overrides are applied **at runtime**, while the application is loading its translations.
The alternative is the build-time [`merge-i18n`](#relationship-to-merge-i18n) script, which merges
one theme's translations into the base language files before the build. Applying the overrides at
runtime means a single build - and therefore a single Docker image - can be deployed for different
themes, each with its own translations.

## Adding translations to a theme

Place the override files alongside the theme's other assets:

```
src/themes/<theme>/assets/i18n/<lang>.json5
```

For example:

```
src/assets/i18n/de.json5                     * base translations (all keys)
src/themes/my-theme/assets/i18n/de.json5     * overrides for my-theme
```

An override file only has to contain the keys it changes; every other key falls back to the base
file. A theme also does not have to provide a file for every language.

The build copies these files to `assets/<theme>/i18n/<lang>.json5` in the output, where the
translate loaders pick them up.

## How keys are resolved

Translations are merged key by key. Later sources win:

1. the base file, `src/assets/i18n/<lang>.json5`
2. the active theme's ancestors, starting from the root of the `extends` chain
3. the active theme itself

Given this configuration:

```yaml
themes:
  - name: child-theme
    extends: parent-theme
  - name: parent-theme
```

with `child-theme` active, translations are merged in the order `base → parent-theme →
child-theme`. A key defined only in `parent-theme` is used unless `child-theme` redefines it, and a
key defined in neither falls back to the base file. This is the same `extends` inheritance that
DSpace already uses to resolve themed components.

## Which theme's overrides are applied

The overrides come from the **default theme** - the entry under `themes:` that has no `regex`,
`handle` or `uuid` matching rule - together with its ancestors.

Configured themes outside that chain are deliberately skipped. Loading every configured theme
would let keys from unrelated themes overwrite one another, because the merged result is a single
flat map of keys.

This also means that when one instance serves several themes selected by `regex`, `handle` or
`uuid`, only the default theme's translation overrides are applied.

## Server-side rendering

Under SSR the server loader reads the base file and the theme overrides from disk, merges them,
and stores the result in the Angular `TransferState`. The browser reuses that state, so no extra
request for theme translations is made after the initial page load.

When no `TransferState` is available - client-side rendering, for example `npm run start:dev` -
the browser loader fetches the base file and the theme override files over HTTP and merges them
client-side.

A missing override file is ignored. A malformed override file is skipped and a warning is written
to the server log, so a syntax error in one theme file cannot break rendering.

## Relationship to `merge-i18n`

Runtime overrides need no configuration change, and existing setups do not have to be migrated:
projects that run `npm run merge-i18n` before building keep working exactly as before.

To use runtime overrides instead, keep `src/assets/i18n/<lang>.json5` as the unmodified base file
and do not run the script.
