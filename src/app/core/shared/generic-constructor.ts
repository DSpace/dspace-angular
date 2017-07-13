/**
 * ensures we can use 'typeof T' as a type
 * more details:
 * https://github.com/Microsoft/TypeScript/issues/204#issuecomment-257722306
 */
/* tslint:disable:interface-over-type-literal */
export type GenericConstructor<T> = { new(...args: any[]): T };
/* tslint:enable:interface-over-type-literal */
