import { RuleContext } from '@typescript-eslint/utils/ts-eslint';

/**
 * Determine whether the current file is a test file
 * @param context the current ESLint rule context
 */
export function isTestFile(context: RuleContext<any, any>): boolean {
  // note: shouldn't use plain .filename (doesn't work in DSpace Angular 7.4)
  return context.getFilename()?.endsWith('.spec.ts')  ;
}
