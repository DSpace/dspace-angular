import {
  ESLintUtils,
  TSESTree,
} from '@typescript-eslint/utils';
import {
  RuleContext,
  RuleFix,
  RuleFixer,
} from '@typescript-eslint/utils/ts-eslint';

import {
  DSpaceESLintRuleInfo,
  NamedTests,
} from '../../util/structure';

export enum Message {
  HAS_EXPLICIT_STANDALONE_IMPORT_DECLARATION = 'hasExplicitStandaloneImportDeclaration',
}

export const info: DSpaceESLintRuleInfo = {
  name: 'no-default-standalone-value',
  meta: {
    docs: {
      description: 'Removes unnecessary explicit standalone declarations of the @Component decorators. Starting from Angular 19 this is now the default value.',
    },
    messages: {
      [Message.HAS_EXPLICIT_STANDALONE_IMPORT_DECLARATION]: 'Unnecessary explicit standalone declaration of the @Component decorator should be removed.',
    },
    type: 'problem',
    fixable: 'code',
    schema: [],
  },
  optionDocs: [],
  defaultOptions: [],
};

export const rule = ESLintUtils.RuleCreator.withoutDocs({
  ...info,
  create(context: RuleContext<any, any>, options: any) {
    return {
      ['ClassDeclaration > Decorator > CallExpression[callee.name="Component"] > ObjectExpression > Property[key.name="standalone"]']: (node: TSESTree.Property) => {
        if (node === undefined || (node.value as TSESTree.Literal).value === false) {
          return;
        }
        return context.report({
          messageId: Message.HAS_EXPLICIT_STANDALONE_IMPORT_DECLARATION,
          node: node,
          fix(fixer: RuleFixer): RuleFix {
            const displayValue: string = context.sourceCode.getText(node);
            let startRange: number = node.range[0];
            const matchStart = context.sourceCode.getText(node.parent).match(`\n[ ]*${displayValue}`);
            if (matchStart) {
              startRange -= (matchStart[0].length - displayValue.length);
            }

            let endRange: number = node.range[1];
            const matchEnd = context.sourceCode.getText(node.parent).match(`${displayValue}[ ,]*`);
            if (matchEnd) {
              endRange += (matchEnd[0].length - displayValue.length);
            }
            return fixer.removeRange([startRange, endRange]);
          },
        });
      },
    };
  },
});

export const tests: NamedTests = {
  plugin: info.name,
  valid: [
    {
      name: 'Not setting the standalone value is valid',
      code: `
@Component({
  selector: 'ds-test',
})
class TestComponent {}
      `,
    },
    {
      name: 'Setting the standalone value to false is valid',
      code: `
@Component({
  selector: 'ds-test',
  standalone: false,
})
class TestComponent {}
      `,
    },
  ],
  invalid: [
    {
      name: 'Should not have explicit standalone declaration',
      code: `
@Component({
  selector: 'ds-test',
  standalone: true,
})
class TestComponent {}
      `,
      errors: [
        {
          messageId: Message.HAS_EXPLICIT_STANDALONE_IMPORT_DECLARATION,
        },
      ],
      output: `
@Component({
  selector: 'ds-test',
})
class TestComponent {}
      `,
    },
  ],
};
