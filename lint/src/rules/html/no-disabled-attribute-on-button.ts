import {
  TmplAstBoundAttribute,
  TmplAstTextAttribute,
} from '@angular-eslint/bundled-angular-compiler';
import { TemplateParserServices } from '@angular-eslint/utils';
import {
  ESLintUtils,
  TSESLint,
} from '@typescript-eslint/utils';

import {
  DSpaceESLintRuleInfo,
  NamedTests,
} from '../../util/structure';
import { getSourceCode } from '../../util/typescript';

export enum Message {
  USE_DSBTN_DISABLED = 'mustUseDsBtnDisabled',
}

export const info = {
  name: 'no-disabled-attribute-on-button',
  meta: {
    docs: {
      description: `Buttons should use the \`dsBtnDisabled\` directive instead of the HTML \`disabled\` attribute.
      This should be done to ensure that users with a screen reader are able to understand that the a button button is present, and that it is disabled.
      The native html disabled attribute does not allow users to navigate to the button by keyboard, and thus they have no way of knowing that the button is present.`,
    },
    type: 'problem',
    fixable: 'code',
    schema: [],
    messages: {
      [Message.USE_DSBTN_DISABLED]: 'Buttons should use the `dsBtnDisabled` directive instead of the `disabled` attribute.',
    },
  },
  optionDocs: [],
  defaultOptions: [],
} as DSpaceESLintRuleInfo;

export const rule = ESLintUtils.RuleCreator.withoutDocs({
  ...info,
  create(context: TSESLint.RuleContext<Message, unknown[]>) {
    const parserServices = getSourceCode(context).parserServices as TemplateParserServices;

    /**
     * Some dynamic angular inputs will have disabled as name because of how Angular handles this internally (e.g [class.disabled]="isDisabled")
     * But these aren't actually the disabled attribute we're looking for, we can determine this by checking the details of the keySpan
     */
    function isOtherAttributeDisabled(node: TmplAstBoundAttribute | TmplAstTextAttribute): boolean {
      // if the details are not null, and the details are not 'disabled', then it's not the disabled attribute we're looking for
      return node.keySpan?.details !== null && node.keySpan?.details !== 'disabled';
    }

    /**
     * Replace the disabled text with [dsBtnDisabled] in the template
     */
    function replaceDisabledText(text: string ): string {
      const hasBrackets = text.includes('[') && text.includes(']');
      const newDisabledText = hasBrackets ? 'dsBtnDisabled' : '[dsBtnDisabled]="true"';
      return text.replace('disabled', newDisabledText);
    }

    function inputIsChildOfButton(node: any): boolean {
      return (node.parent?.tagName === 'button' || node.parent?.name === 'button');
    }

    function reportAndFix(node: TmplAstBoundAttribute | TmplAstTextAttribute) {
      if (!inputIsChildOfButton(node) || isOtherAttributeDisabled(node)) {
        return;
      }

      const sourceSpan = node.sourceSpan;
      context.report({
        messageId: Message.USE_DSBTN_DISABLED,
        loc: parserServices.convertNodeSourceSpanToLoc(sourceSpan),
        fix(fixer) {
          const templateText = sourceSpan.start.file.content;
          const disabledText = templateText.slice(sourceSpan.start.offset, sourceSpan.end.offset);
          const newText = replaceDisabledText(disabledText);
          return fixer.replaceTextRange([sourceSpan.start.offset, sourceSpan.end.offset], newText);
        },
      });
    }

    return {
      'BoundAttribute[name="disabled"]'(node: TmplAstBoundAttribute) {
        reportAndFix(node);
      },
      'TextAttribute[name="disabled"]'(node: TmplAstTextAttribute) {
        reportAndFix(node);
      },
    };
  },
});

export const tests = {
  plugin: info.name,
  valid: [
    {
      name: 'should use [dsBtnDisabled] in HTML templates',
      code: `
<button [dsBtnDisabled]="true">Submit</button>
      `,
    },
    {
      name: 'disabled attribute is still valid on non-button elements',
      code: `
<input disabled>
      `,
    },
    {
      name: '[disabled] attribute is still valid on non-button elements',
      code: `
<input [disabled]="true">
      `,
    },
    {
      name: 'angular dynamic attributes that use disabled are still valid',
      code: `
<button [class.disabled]="isDisabled">Submit</button>
      `,
    },
  ],
  invalid: [
    {
      name: 'should not use disabled attribute in HTML templates',
      code: `
<button disabled>Submit</button>
      `,
      errors: [{ messageId: Message.USE_DSBTN_DISABLED }],
      output: `
<button [dsBtnDisabled]="true">Submit</button>
      `,
    },
    {
      name: 'should not use [disabled] attribute in HTML templates',
      code: `
<button [disabled]="true">Submit</button>
      `,
      errors: [{ messageId: Message.USE_DSBTN_DISABLED }],
      output: `
<button [dsBtnDisabled]="true">Submit</button>
      `,
    },
  ],
} as NamedTests;

export default rule;
