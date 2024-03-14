/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */

import {
  fixture,
  htmlRuleTester,
  tsRuleTester,
} from '../testing';
import tsRule from '../../src/rules/ts/themed-component-usages';
import htmlRule from '../../src/rules/html/themed-component-usages';

describe('themed-component-usages (TypeScript)', () => {
  tsRuleTester.run('themed-component-usages', tsRule as any, {
    valid: [
      {
        code: `
const config = {
  a: ThemedTestThemeableComponent,
  b: ChipsComponent,
}
        `,
      },
      {
        code: `
export class TestThemeableComponent {
}
        `,
      },
      {
        code: `
import { TestThemeableComponent } from '../test/test-themeable.component.ts';

export class ThemedAdminSidebarComponent extends ThemedComponent<TestThemeableComponent> {
}
        `,
      },
      {
        code: `
import { TestThemeableComponent } from '../test/test-themeable.component.ts';

export class Something {
  @ViewChild(TestThemeableComponent) test: TestThemeableComponent;
}
        `,
      },
      {
        name: fixture('src/app/test/test.component.spec.ts'),
        code: `
By.css('ds-themeable');
By.Css('#test > ds-themeable > #nest');
        `,
      },
      {
        name: fixture('src/app/test/test.component.cy.ts'),
        code: `
By.css('ds-themeable');
By.Css('#test > ds-themeable > #nest');
        `,
      },
    ],
    invalid: [
      {
        code: `
import { TestThemeableComponent } from '../test/test-themeable.component.ts';
import { TestComponent } from '../test/test.component.ts';

const config = {
  a: TestThemeableComponent,
  b: TestComponent,
}
        `,
        errors: [
          {
            messageId: 'mustImportThemedWrapper',
          },
          {
            messageId: 'mustUseThemedWrapper',
          },
        ],
        output: `
import { ThemedTestThemeableComponent } from '../test/themed-test-themeable.component.ts';
import { TestComponent } from '../test/test.component.ts';

const config = {
  a: ThemedTestThemeableComponent,
  b: TestComponent,
}
        `
      },
      {
        filename: fixture('src/app/test/test.component.spec.ts'),
        code: `
By.css('ds-themed-themeable');
By.css('#test > ds-themed-themeable > #nest');
        `,
        errors: [
          {
            messageId: 'mustUseThemedWrapper',
          },
          {
            messageId: 'mustUseThemedWrapper',
          },
        ],
        output: `
By.css('ds-themeable');
By.css('#test > ds-themeable > #nest');
        `,
      },
      {
        filename: fixture('src/app/test/test.component.spec.ts'),
        code: `
By.css('ds-base-themeable');
By.css('#test > ds-base-themeable > #nest');
        `,
        errors: [
          {
            messageId: 'mustUseThemedWrapper',
          },
          {
            messageId: 'mustUseThemedWrapper',
          },
        ],
        output: `
By.css('ds-themeable');
By.css('#test > ds-themeable > #nest');
        `,
      },
      {
        filename: fixture('src/app/test/test.component.cy.ts'),
        code: `
cy.get('ds-themed-themeable');
cy.get('#test > ds-themed-themeable > #nest');
        `,
        errors: [
          {
            messageId: 'mustUseThemedWrapper',
          },
          {
            messageId: 'mustUseThemedWrapper',
          },
        ],
        output: `
cy.get('ds-themeable');
cy.get('#test > ds-themeable > #nest');
        `,
      },
      {
        filename: fixture('src/app/test/test.component.cy.ts'),
        code: `
cy.get('ds-base-themeable');
cy.get('#test > ds-base-themeable > #nest');
        `,
        errors: [
          {
            messageId: 'mustUseThemedWrapper',
          },
          {
            messageId: 'mustUseThemedWrapper',
          },
        ],
        output: `
cy.get('ds-themeable');
cy.get('#test > ds-themeable > #nest');
        `,
      },
    ],
  } as any);
});

describe('themed-component-usages (HTML)', () => {
  htmlRuleTester.run('themed-component-usages', htmlRule, {
    valid: [
      {
        code: `
<ds-test-themeable/>
<ds-test-themeable></ds-test-themeable>
<ds-test-themeable [test]="something"></ds-test-themeable>
        `,
      },
      {
        name: fixture('src/test.ts'),
        code: `
@Component({
  template: '<ds-test-themeable></ds-test-themeable>'
})
class Test {
}
        `,
      },
      {
        name: fixture('src/test.spec.ts'),
        code: `
@Component({
  template: '<ds-test-themeable></ds-test-themeable>'
})
class Test {
}
        `,
      },
      {
        filename: fixture('src/test.spec.ts'),
        code: `
@Component({
  template: '<ds-base-test-themeable></ds-base-test-themeable>'
})
class Test {
}
        `,
      },
    ],
    invalid: [
      {
        code: `
<ds-themed-test-themeable/>
<ds-themed-test-themeable></ds-themed-test-themeable>
<ds-themed-test-themeable [test]="something"></ds-themed-test-themeable>
        `,
        errors: [
          {
            messageId: 'mustUseThemedWrapperSelector',
          },
          {
            messageId: 'mustUseThemedWrapperSelector',
          },
          {
            messageId: 'mustUseThemedWrapperSelector',
          },
        ],
        output: `
<ds-test-themeable/>
<ds-test-themeable></ds-test-themeable>
<ds-test-themeable [test]="something"></ds-test-themeable>
        `,
      },
      {
        code: `
<ds-base-test-themeable/>
<ds-base-test-themeable></ds-base-test-themeable>
<ds-base-test-themeable [test]="something"></ds-base-test-themeable>
        `,
        errors: [
          {
            messageId: 'mustUseThemedWrapperSelector',
          },
          {
            messageId: 'mustUseThemedWrapperSelector',
          },
          {
            messageId: 'mustUseThemedWrapperSelector',
          },
        ],
        output: `
<ds-test-themeable/>
<ds-test-themeable></ds-test-themeable>
<ds-test-themeable [test]="something"></ds-test-themeable>
        `,
      },
    ]
  });
});
