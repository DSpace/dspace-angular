/**
 * ensures we can use 'typeof T' as a type
 * more details:
 * https://github.com/Microsoft/TypeScript/issues/204#issuecomment-257722306
 */
/* eslint-disable @typescript-eslint/consistent-type-definitions */
export type GenericConstructor<T> = new (...args: any[]) => T ;
/* eslint-enable @typescript-eslint/consistent-type-definitions */
