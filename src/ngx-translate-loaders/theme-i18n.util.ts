import { ThemeConfig } from '@dspace/config/theme.config';

/**
 * Resolve the i18n load order for a single **active** theme, walking up its
 * `extends` chain so ancestors are loaded before descendants (ancestor keys
 * are overridden by descendant keys).
 *
 * Only the active theme's inheritance chain is returned.  Sibling themes that
 * are configured but not active are intentionally excluded — loading all
 * configured themes caused cross-theme key pollution (a sibling theme's
 * translations silently overriding the active theme's keys).
 *
 * This mirrors the official `merge-i18n` CLI approach, which merges exactly
 * one theme at a time: `npm run merge-i18n -- -s src/themes/<active>/assets/i18n`.
 *
 * `extends` cycles are handled gracefully (each theme name appears at most once).
 *
 * Examples (config `[base-theme, child-theme (extends base-theme), sibling-theme (extends base-theme)]`):
 *   active = 'base-theme'    (no extends)                  → ['base-theme']
 *   active = 'child-theme'   (extends: 'base-theme')       → ['base-theme', 'child-theme']
 *   active = 'sibling-theme' (extends: 'base-theme')       → ['base-theme', 'sibling-theme']
 *
 * @param configured the configured themes (typically `environment.themes`)
 * @param activeName the name of the active/default theme
 * @returns ordered list of theme names to load (root ancestor → active theme)
 */
export function resolveActiveThemeChain(configured: ThemeConfig[], activeName: string): string[] {
  const byName = new Map<string, ThemeConfig>();
  configured.forEach((t) => {
    if (t?.name) {
      byName.set(t.name, t);
    }
  });

  const chain: string[] = [];
  const visited = new Set<string>();
  let cursor: string | undefined = activeName;
  while (cursor && !visited.has(cursor)) {
    visited.add(cursor);
    chain.push(cursor);
    cursor = byName.get(cursor)?.extends;
  }
  return chain.reverse(); // ancestor → descendant
}
