import { NamedThemeConfig } from '@dspace/config/theme.config';

import { resolveActiveThemeChain } from './theme-i18n.util';

describe('resolveActiveThemeChain', () => {
  const theme = (name: string, ext?: string): NamedThemeConfig =>
    ext ? { name, extends: ext } : { name };

  it('returns an empty array when activeName is empty', () => {
    expect(resolveActiveThemeChain([theme('custom')], '')).toEqual([]);
  });

  it('returns [active] when the active theme has no extends', () => {
    expect(resolveActiveThemeChain([theme('custom')], 'custom')).toEqual(['custom']);
  });

  it('returns [parent, active] when active extends a configured parent', () => {
    expect(resolveActiveThemeChain(
      [theme('custom'), theme('child-theme', 'custom')],
      'child-theme',
    )).toEqual(['custom', 'child-theme']);
  });

  it('resolves the chain even when the active theme is listed before its parent', () => {
    expect(resolveActiveThemeChain(
      [theme('child-theme', 'parent-theme'), theme('parent-theme')],
      'child-theme',
    )).toEqual(['parent-theme', 'child-theme']);
  });

  it('expands a multi-level chain (root → mid → active)', () => {
    expect(resolveActiveThemeChain(
      [theme('child-theme', 'parent-theme'), theme('parent-theme', 'base-theme'), theme('base-theme')],
      'child-theme',
    )).toEqual(['base-theme', 'parent-theme', 'child-theme']);
  });

  it('includes an ancestor even when it is not separately listed in configured themes', () => {
    expect(resolveActiveThemeChain(
      [theme('child-theme', 'parent-theme')],
      'child-theme',
    )).toEqual(['parent-theme', 'child-theme']);
  });

  it('does NOT include sibling themes — only the active chain', () => {
    // sibling-theme and child-theme both extend parent-theme; when child-theme is active,
    // sibling-theme must not appear in the chain.
    const chain = resolveActiveThemeChain(
      [theme('parent-theme'), theme('child-theme', 'parent-theme'), theme('sibling-theme', 'parent-theme')],
      'child-theme',
    );
    expect(chain).toEqual(['parent-theme', 'child-theme']);
    expect(chain).not.toContain('sibling-theme');
  });

  it('terminates and includes each theme once when extends forms a cycle', () => {
    const order = resolveActiveThemeChain(
      [theme('theme-a', 'theme-b'), theme('theme-b', 'theme-a')],
      'theme-a',
    );
    expect(order.length).toBe(2);
    expect([...order].sort()).toEqual(['theme-a', 'theme-b']);
  });

  it('returns [active] when activeName does not match any configured theme', () => {
    expect(resolveActiveThemeChain([theme('custom')], 'unknown-theme')).toEqual(['unknown-theme']);
  });
});
