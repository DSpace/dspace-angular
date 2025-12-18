// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function isBoolean(value: any): value is boolean {
  return typeof value === 'boolean';
}
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function isFunction(value: any): value is Function {
  return typeof value === 'function';
}
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function isNumber(value: any): value is number {
  return typeof value === 'number';
}
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function isObject(value: any): value is object {
  return typeof value === 'object' && value !== null;
}
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function isString(value: any): value is string {
  return typeof value === 'string';
}
