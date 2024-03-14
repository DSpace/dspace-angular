/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */


import {
  fixture,
  tsRuleTester,
} from '../testing';
import rule from '../../src/rules/ts/themed-component-selectors';

describe('themed-component-selectors', () => {
  tsRuleTester.run('themed-component-selectors', rule as any, {
    valid: [
      {
        name: 'Regular non-themeable component selector',
        code: `
        @Component({
          selector: 'ds-something',
        })
        class Something {
        }
      `,
      },
      {
        name: 'Themeable component selector should replace the original version, unthemed version should be changed to ds-base-',
        code: `
@Component({
  selector: 'ds-base-something',
})
class Something {
}

@Component({
  selector: 'ds-something',
})
class ThemedSomething extends ThemedComponent<Something> {
}

@Component({
  selector: 'ds-themed-something',
})
class OverrideSomething extends Something {
}
      `,
      },
      {
        name: 'Other themed component wrappers should not interfere',
        code: `
@Component({
  selector: 'ds-something',
})
class Something {
}

@Component({
  selector: 'ds-something-else',
})
class ThemedSomethingElse extends ThemedComponent<SomethingElse> {
}
      `,
      },
    ],
    invalid: [
      {
        name: 'Wrong selector for base component',
        filename: fixture('src/app/test/test-themeable.component.ts'),
        code: `
@Component({
  selector: 'ds-something',
})
class TestThemeableComponent {
}
        `,
        errors: [
          {
            messageId: 'wrongSelectorUnthemedComponent',
          },
        ],
        output: `
@Component({
  selector: 'ds-base-something',
})
class TestThemeableComponent {
}
        `,
      },
      {
        name: 'Wrong selector for wrapper component',
        filename: fixture('src/app/test/themed-test-themeable.component.ts'),
        code: `
@Component({
  selector: 'ds-themed-something',
})
class ThemedTestThemeableComponent extends ThemedComponent<TestThemeableComponent> {
}
        `,
        errors: [
          {
            messageId: 'wrongSelectorThemedComponentWrapper',
          },
        ],
        output: `
@Component({
  selector: 'ds-something',
})
class ThemedTestThemeableComponent extends ThemedComponent<TestThemeableComponent> {
}
        `,
      },
      {
        name: 'Wrong selector for theme override',
        filename: fixture('src/themes/test/app/test/test-themeable.component.ts'),
        code: `
@Component({
  selector: 'ds-something',
})
class TestThememeableComponent extends BaseComponent {
}
        `,
        errors: [
          {
            messageId: 'wrongSelectorThemedComponentOverride',
          },
        ],
        output: `
@Component({
  selector: 'ds-themed-something',
})
class TestThememeableComponent extends BaseComponent {
}
        `,
      },
    ],
  } as any);
});
