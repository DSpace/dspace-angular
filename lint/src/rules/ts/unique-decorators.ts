import {
  AST_NODE_TYPES,
  ESLintUtils,
  TSESLint,
  TSESTree,
} from '@typescript-eslint/utils';

import { isTestFile } from '../../util/filter';
import {
  DSpaceESLintRuleInfo,
  NamedTests,
  OptionDoc,
} from '../../util/structure';

export enum Message {
  DUPLICATE_DECORATOR_CALL = 'duplicateDecoratorCall',
}

/**
 * Saves the decorators by decoratorName → file → Set<String>
 */
const decoratorCalls: Map<string, Map<string, Set<string>>> = new Map();

/**
 * Keep a list of the files wo contain a decorator. This is done in order to prevent the `Program` selector from being
 * run for every file.
 */
const fileWithDecorators: Set<string> = new Set();

export interface UniqueDecoratorsOptions {
  decorators: string[];
}

export interface UniqueDecoratorsDocOptions {
  decorators: OptionDoc;
}

export const info: DSpaceESLintRuleInfo<[UniqueDecoratorsOptions], [UniqueDecoratorsDocOptions]> = {
  name: 'unique-decorators',
  meta: {
    docs: {
      description: 'Some decorators must be called with unique arguments (e.g. when they construct a mapping based on the argument values)',
    },
    messages: {
      [Message.DUPLICATE_DECORATOR_CALL]: 'Duplicate decorator call',
    },
    type: 'problem',
    schema: [
      {
        type: 'object',
        properties: {
          decorators: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
      },
    ],
  },
  optionDocs: [
    {
      decorators: {
        title: '`decorators`',
        description: 'The list of all the decorators for which you want to enforce this behavior.',
      },
    },
  ],
  defaultOptions: [
    {
      decorators: [
        'listableObjectComponent',  // todo: must take default arguments into account!
      ],
    },
  ],
};

export const rule = ESLintUtils.RuleCreator.withoutDocs({
  ...info,
  create(context: TSESLint.RuleContext<Message, unknown[]>, options: any) {

    return {
      ['Program']: () => {
        if (fileWithDecorators.has(context.physicalFilename)) {
          for (const decorator of options[0].decorators) {
            decoratorCalls.get(decorator)?.get(context.physicalFilename)?.clear();
          }
        }
      },
      [`ClassDeclaration > Decorator > CallExpression[callee.name=/^(${options[0].decorators.join('|')})$/]`]: (node: TSESTree.CallExpression) => {
        if (isTestFile(context)) {
          return;
        }

        if (node.callee.type !== AST_NODE_TYPES.Identifier) {
          // We only support regular method identifiers
          return;
        }

        fileWithDecorators.add(context.physicalFilename);

        if (!isUnique(node, context.physicalFilename)) {
          context.report({
            messageId: Message.DUPLICATE_DECORATOR_CALL,
            node: node,
          });
        }
      },
    };
  },
});

export const tests: NamedTests = {
  plugin: info.name,
  valid: [
    {
      name: 'checked decorator, no repetitions',
      code: `
@listableObjectComponent(a)
export class A {
}

@listableObjectComponent(a, 'b')
export class B {
}

@listableObjectComponent(a, 'b', 3)
export class C {
}

@listableObjectComponent(a, 'b', 3, Enum.TEST1)
export class C {
}

@listableObjectComponent(a, 'b', 3, Enum.TEST2)
export class C {
}
      `,
    },
    {
      name: 'unchecked decorator, some repetitions',
      code: `
@something(a)
export class A {
}

@something(a)
export class B {
}
      `,
    },
  ],
  invalid: [
    {
      name: 'checked decorator, some repetitions',
      code: `
@listableObjectComponent(a)
export class A {
}

@listableObjectComponent(a)
export class B {
}
      `,
      errors: [
        {
          messageId: 'duplicateDecoratorCall',
        },
      ],
    },
  ],
};

function callKey(node: TSESTree.CallExpression): string {
  let key = '';

  for (const arg of node.arguments) {
    switch ((arg as TSESTree.Node).type) {
      // todo: can we make this more generic somehow?
      case AST_NODE_TYPES.Identifier:
        key += (arg as TSESTree.Identifier).name;
        break;
      case AST_NODE_TYPES.Literal:
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        key += (arg as TSESTree.Literal).value;
        break;
      case AST_NODE_TYPES.MemberExpression:
        key += (arg as any).object.name + '.' + (arg as any).property.name;
        break;
      default:
        throw new Error(`Unrecognized decorator argument type: ${arg.type}`);
    }

    key += ', ';
  }

  return key;
}

function isUnique(node: TSESTree.CallExpression, filePath: string): boolean {
  const decorator = (node.callee as TSESTree.Identifier).name;

  if (!decoratorCalls.has(decorator)) {
    decoratorCalls.set(decorator, new Map());
  }

  if (!decoratorCalls.get(decorator)!.has(filePath)) {
    decoratorCalls.get(decorator)!.set(filePath, new Set());
  }

  const key = callKey(node);

  let unique = true;

  for (const decoratorCallsByFile of decoratorCalls.get(decorator)!.values()) {
    if (decoratorCallsByFile.has(key)) {
      unique = !unique;
      break;
    }
  }

  decoratorCalls.get(decorator)?.get(filePath)?.add(key);

  return unique;
}
