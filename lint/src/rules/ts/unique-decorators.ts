import {
  AST_NODE_TYPES,
  TSESLint,
  TSESTree,
} from '@typescript-eslint/utils';

import { isTestFile } from '../../util/filter';
import {
  DSpaceESLintRuleInfo,
  NamedTests,
} from '../../util/structure';

export enum Message {
  DUPLICATE_DECORATOR_CALL = 'duplicateDecoratorCall',
}

export const info: DSpaceESLintRuleInfo = {
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
          },
        },
      },
    ],
  },
  defaultOptions: [
    {
      decorators: [
        'listableObjectComponent',  // todo: must take default arguments into account!
      ],
    },
  ],
};

export const rule = {
  ...info,
  create(context: TSESLint.RuleContext<Message, unknown[]>, options: any) {
    const decoratorCalls: Map<string, Set<string>> = new Map();

    return {
      'ClassDeclaration > Decorator > CallExpression': (node: TSESTree.CallExpression) => {  // todo: limit to class decorators
        if (isTestFile(context)) {
          return;
        }

        if (node.callee.type !== AST_NODE_TYPES.Identifier) {
          // We only support regular method identifiers
          return;
        }

        // todo: can we fold this into the selector actually?
        if (!(options[0].decorators as string[]).includes(node.callee.name)) {
          // We don't care about this decorator
          return;
        }

        if (!isUnique(node, decoratorCalls)) {
          context.report({
            messageId: Message.DUPLICATE_DECORATOR_CALL,
            node: node,
          });
        }
      },
    };
  },
};

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

function isUnique(node: TSESTree.CallExpression, decoratorCalls: Map<string, Set<string>>): boolean {
  const decorator = (node.callee as TSESTree.Identifier).name;

  if (!decoratorCalls.has(decorator)) {
    decoratorCalls.set(decorator, new Set());
  }

  const key = callKey(node);

  let unique = true;

  if (decoratorCalls.get(decorator)?.has(key)) {
    unique = !unique;
  }

  decoratorCalls.get(decorator)?.add(key);

  return unique;
}
