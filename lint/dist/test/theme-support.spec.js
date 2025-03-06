"use strict";
/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
Object.defineProperty(exports, "__esModule", { value: true });
const theme_support_1 = require("../src/util/theme-support");
describe('theme-support', () => {
    describe('themeable component registry', () => {
        it('should contain all themeable components from the fixture', () => {
            expect(theme_support_1.themeableComponents.entries.size).toBe(1);
            expect(theme_support_1.themeableComponents.byBasePath.size).toBe(1);
            expect(theme_support_1.themeableComponents.byWrapperPath.size).toBe(1);
            expect(theme_support_1.themeableComponents.byBaseClass.size).toBe(1);
            expect(theme_support_1.themeableComponents.byBaseClass.get('TestThemeableComponent')).toBeTruthy();
            expect(theme_support_1.themeableComponents.byBasePath.get('src/app/test/test-themeable.component.ts')).toBeTruthy();
            expect(theme_support_1.themeableComponents.byWrapperPath.get('src/app/test/themed-test-themeable.component.ts')).toBeTruthy();
        });
    });
});
//# sourceMappingURL=theme-support.spec.js.map