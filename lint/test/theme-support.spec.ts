/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */

import { themeableComponents } from '../src/util/theme-support';

describe('theme-support', () => {
  describe('themeable component registry', () => {
    it('should contain all themeable components from the fixture', () => {
      expect(themeableComponents.entries.size).toBe(1);
      expect(themeableComponents.byBasePath.size).toBe(1);
      expect(themeableComponents.byWrapperPath.size).toBe(1);
      expect(themeableComponents.byBaseClass.size).toBe(1);

      expect(themeableComponents.byBaseClass.get('TestThemeableComponent')).toBeTruthy();
      expect(themeableComponents.byBasePath.get('src/app/test/test-themeable.component.ts')).toBeTruthy();
      expect(themeableComponents.byWrapperPath.get('src/app/test/themed-test-themeable.component.ts')).toBeTruthy();
    });
  });
});
