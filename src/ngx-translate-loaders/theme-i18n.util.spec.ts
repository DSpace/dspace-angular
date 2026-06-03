import { NamedThemeConfig } from '@dspace/config/theme.config';

import { resolveThemeLoadOrder } from './theme-i18n.util';

describe('resolveThemeLoadOrder', () => {
  const theme = (name: string, ext?: string): NamedThemeConfig =>
    ext ? { name, extends: ext } : { name };

  it('returns an empty array when no themes are configured', () => {
    expect(resolveThemeLoadOrder([])).toEqual([]);
  });

  it('keeps configuration order for themes without an extends chain', () => {
    expect(resolveThemeLoadOrder([theme('first-theme'), theme('second-theme')]))
      .toEqual(['first-theme', 'second-theme']);
  });

  it('emits ancestor before descendant for an extends chain', () => {
    expect(resolveThemeLoadOrder([theme('child-theme', 'parent-theme'), theme('parent-theme')]))
      .toEqual(['parent-theme', 'child-theme']);
  });

  it('emits ancestor before descendant regardless of configuration order', () => {
    expect(resolveThemeLoadOrder([theme('parent-theme'), theme('child-theme', 'parent-theme')]))
      .toEqual(['parent-theme', 'child-theme']);
  });

  it('expands a multi-level extends chain (root → leaf)', () => {
    expect(resolveThemeLoadOrder([
      theme('child-theme', 'parent-theme'),
      theme('parent-theme', 'base-theme'),
      theme('base-theme'),
    ])).toEqual(['base-theme', 'parent-theme', 'child-theme']);
  });

  it('includes an ancestor referenced via extends even when it is not separately configured', () => {
    expect(resolveThemeLoadOrder([theme('child-theme', 'parent-theme')]))
      .toEqual(['parent-theme', 'child-theme']);
  });

  it('de-duplicates a shared ancestor of multiple themes', () => {
    expect(resolveThemeLoadOrder([
      theme('child-theme', 'parent-theme'),
      theme('sibling-theme', 'parent-theme'),
    ])).toEqual(['parent-theme', 'child-theme', 'sibling-theme']);
  });

  it('terminates and emits each theme once when extends forms a cycle', () => {
    const order = resolveThemeLoadOrder([theme('theme-a', 'theme-b'), theme('theme-b', 'theme-a')]);
    expect(order.length).toBe(2);
    expect([...order].sort()).toEqual(['theme-a', 'theme-b']);
  });

  it('ignores entries without a (truthy) name', () => {
    expect(resolveThemeLoadOrder([theme(''), theme('first-theme')])).toEqual(['first-theme']);
  });
});
