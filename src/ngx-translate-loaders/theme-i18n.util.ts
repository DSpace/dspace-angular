import { ThemeConfig } from '@dspace/config/theme.config';

/**
 * Resolve the load order for the given configured themes, expanding their `extends` chains.
 *
 * For each configured theme we walk up its `extends` chain and then emit the themes from the root
 * ancestor down to the descendant. Duplicates are removed (a theme already emitted as an ancestor
 * of an earlier configured theme is not emitted again), and `extends` cycles are handled gracefully
 * (each theme is visited at most once while building a single chain).
 *
 * Applying i18n override files in the resulting order makes descendant theme keys win over their
 * ancestors, and later-configured themes win over earlier ones.
 *
 * Example given `themes: [child-theme (extends base-theme)]`:
 *   load order = [base-theme, child-theme]   →   base-theme keys first, then child-theme keys override
 *
 * @param configured the configured themes (typically `environment.themes`)
 * @returns the ordered, de-duplicated list of theme names to load (ancestor → descendant)
 */
export function resolveThemeLoadOrder(configured: ThemeConfig[]): string[] {
  const byName = new Map<string, ThemeConfig>();
  configured.forEach((theme) => {
    if (theme?.name) {
      byName.set(theme.name, theme);
    }
  });

  const result: string[] = [];
  const seen = new Set<string>();

  for (const theme of configured) {
    if (!theme?.name) {
      continue;
    }
    // Build the chain from this theme up to its root ancestor (guarding against `extends` cycles).
    const chain: string[] = [];
    const visited = new Set<string>();
    let cursor: string | undefined = theme.name;
    while (cursor && !visited.has(cursor)) {
      visited.add(cursor);
      chain.push(cursor);
      cursor = byName.get(cursor)?.extends;
    }
    // Reverse so we emit ancestor → descendant order.
    for (const name of chain.reverse()) {
      if (!seen.has(name)) {
        seen.add(name);
        result.push(name);
      }
    }
  }

  return result;
}
