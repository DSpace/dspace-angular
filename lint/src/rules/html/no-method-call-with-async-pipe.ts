/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
import {
  AST,
  BindingPipe,
  Call,
  PropertyRead,
  RecursiveAstVisitor,
  SafeCall,
  TmplAstBoundAttribute,
  TmplAstBoundDeferredTrigger,
  TmplAstBoundEvent,
  TmplAstBoundText,
  TmplAstForLoopBlock,
  TmplAstIfBlockBranch,
  TmplAstLetDeclaration,
  TmplAstSwitchBlock,
  TmplAstSwitchBlockCase,
} from '@angular-eslint/bundled-angular-compiler';
import { ESLintUtils } from '@typescript-eslint/utils';
import {
  RuleContext,
  RuleListener,
} from '@typescript-eslint/utils/ts-eslint';

import {
  DSpaceESLintRuleInfo,
  NamedTests,
} from '../../util/structure';
import { getSourceCode } from '../../util/typescript';

export enum Message {
  NO_METHOD_CALL_WITH_ASYNC_PIPE = 'noMethodCallWithAsyncPipe',
}

export const info = {
  name: 'no-method-call-with-async-pipe',
  meta: {
    docs: {
      description: `Don't call a method directly as the input of the \`async\` pipe (e.g. \`getFoo$() | async\`).

This re-executes the method - and the RxJS pipeline it returns - on every change detection cycle, which often leads to performance issues.

Instead:
- Subscribe to the Observable in \`ngOnInit()\`
- Push emitted values into a \`BehaviorSubject\`
- Bind \`| async\` to that \`BehaviorSubject\` in the template
- Unsubscribe in \`ngOnDestroy()\`
      `,
    },
    type: 'problem',
    schema: [],
    messages: {
      [Message.NO_METHOD_CALL_WITH_ASYNC_PIPE]: 'Don\'t call \'{{ methodName }}\' directly in the template as the input of the async pipe; subscribe in ngOnInit(), push values into a BehaviorSubject, and bind `| async` to that instead.',
    },
  },
  optionDocs: [],
  defaultOptions: [],
} as DSpaceESLintRuleInfo;

/**
 * @angular-eslint/template-parser's own visitor keys (used to drive ESLint's node traversal)
 * don't cover every expression AST node type (e.g. SafePropertyRead, LiteralMap, KeyedRead, ...),
 * so selectors like `BindingPipe[name="async"] > Call` silently miss anything wrapped in one of
 * those unsupported node types (e.g. `(getFoo$() | async)?.length`, or `[ngClass]="{x: getFoo$() | async}"`).
 * We work around this by walking each expression ourselves with the Angular compiler's own
 * RecursiveAstVisitor, which correctly covers the full expression AST regardless of what
 * @angular-eslint/template-parser exposes to ESLint's selector engine.
 */
class AsyncPipedCallVisitor extends RecursiveAstVisitor {
  constructor(private readonly onFound: (call: Call | SafeCall) => void) {
    super();
  }

  override visitPipe(ast: BindingPipe, context: unknown) {
    if (ast.name === 'async' && (ast.exp instanceof Call || ast.exp instanceof SafeCall)) {
      this.onFound(ast.exp);
    }
    super.visitPipe(ast, context);
  }
}

export const rule = ESLintUtils.RuleCreator.withoutDocs({
  meta: info.meta,
  defaultOptions: info.defaultOptions,
  create(context: RuleContext<Message, unknown[]>): RuleListener {
    const sourceCode = getSourceCode(context);

    const visitor = new AsyncPipedCallVisitor((node) => {
      const methodName = node.receiver instanceof PropertyRead ? node.receiver.name : 'this method';

      context.report({
        messageId: Message.NO_METHOD_CALL_WITH_ASYNC_PIPE,
        loc: {
          start: sourceCode.getLocFromIndex(node.sourceSpan.start),
          end: sourceCode.getLocFromIndex(node.sourceSpan.end),
        },
        data: {
          methodName,
        },
      });
    });

    function checkExpression(expression: AST | null | undefined) {
      if (expression != null) {
        visitor.visit(expression);
      }
    }

    return {
      BoundAttribute(node: TmplAstBoundAttribute) {
        checkExpression(node.value);
      },
      BoundEvent(node: TmplAstBoundEvent) {
        checkExpression(node.handler);
      },
      BoundText(node: TmplAstBoundText) {
        checkExpression(node.value);
      },
      IfBlockBranch(node: TmplAstIfBlockBranch) {
        checkExpression(node.expression);
      },
      ForLoopBlock(node: TmplAstForLoopBlock) {
        checkExpression(node.expression);
        checkExpression(node.trackBy);
      },
      SwitchBlock(node: TmplAstSwitchBlock) {
        checkExpression(node.expression);
      },
      SwitchBlockCase(node: TmplAstSwitchBlockCase) {
        checkExpression(node.expression);
      },
      LetDeclaration(node: TmplAstLetDeclaration) {
        checkExpression(node.value);
      },
      BoundDeferredTrigger(node: TmplAstBoundDeferredTrigger) {
        checkExpression(node.value);
      },
    };
  },
});

export const tests = {
  plugin: info.name,
  valid: [
    {
      name: 'binding the async pipe to a property is still valid',
      code: `
<span>{{ foo$ | async }}</span>
      `,
    },
    {
      name: 'calling a method without piping the result through async is still valid',
      code: `
<span>{{ getFoo() }}</span>
      `,
    },
    {
      name: 'piping a property through an unrelated pipe is still valid',
      code: `
<span>{{ foo$ | someOtherPipe }}</span>
      `,
    },
    {
      name: 'binding the async pipe to a property accessed through a member expression is still valid',
      code: `
<span>{{ (foo$ | async)?.length }}</span>
      `,
    },
  ],
  invalid: [
    {
      name: 'should not call a method as the direct input of the async pipe',
      code: `
<span>{{ getFoo$() | async }}</span>
      `,
      errors: [{ messageId: Message.NO_METHOD_CALL_WITH_ASYNC_PIPE }],
    },
    {
      name: 'should not call a method with arguments as the direct input of the async pipe',
      code: `
<span>{{ getFoo$(id) | async }}</span>
      `,
      errors: [{ messageId: Message.NO_METHOD_CALL_WITH_ASYNC_PIPE }],
    },
    {
      name: 'should not use the safe-call variant as the direct input of the async pipe',
      code: `
<span>{{ getFoo$?.() | async }}</span>
      `,
      errors: [{ messageId: Message.NO_METHOD_CALL_WITH_ASYNC_PIPE }],
    },
    {
      name: 'should not call a method as the direct input of the async pipe in the *ngIf microsyntax',
      code: `
<div *ngIf="getFoo$() | async as foo">{{ foo }}</div>
      `,
      errors: [{ messageId: Message.NO_METHOD_CALL_WITH_ASYNC_PIPE }],
    },
    {
      name: 'should not call a method as the direct input of the async pipe in an @if condition, even when wrapped in a member access',
      code: `
@if ((getFoo$() | async)?.length > 0) {
  <span>hi</span>
}
      `,
      errors: [{ messageId: Message.NO_METHOD_CALL_WITH_ASYNC_PIPE }],
    },
    {
      name: 'should not call a method as the direct input of the async pipe in an @for expression',
      code: `
@for (item of getFoo$() | async; track item) {
  <span>{{ item }}</span>
}
      `,
      errors: [{ messageId: Message.NO_METHOD_CALL_WITH_ASYNC_PIPE }],
    },
    {
      name: 'should not call a method as the direct input of the async pipe inside an object literal binding',
      code: `
<div [ngClass]="{'active': (getFoo$() | async)?.length > 0}"></div>
      `,
      errors: [{ messageId: Message.NO_METHOD_CALL_WITH_ASYNC_PIPE }],
    },
  ],
} as NamedTests;

export default rule;
