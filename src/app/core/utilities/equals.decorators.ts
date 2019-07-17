import { isEmpty } from '../../shared/empty.util';

const excludedFromEquals = new Map();
const fieldsForEqualsMap = new Map();

export function excludeFromEquals(object: any, propertyName: string): any {
  if (!object) {
    return;
  }
  let list = excludedFromEquals.get(object.constructor);
  if (isEmpty(list)) {
    list = [];
  }
  excludedFromEquals.set(object.constructor, [...list, propertyName]);
}

export function getExcludedFromEqualsFor(constructor: Function) {
  return excludedFromEquals.get(constructor) || [];
}

export function fieldsForEquals(...fields: string[]): any {
  return function i(object: any, propertyName: string): any {
    if (!object) {
      return;
    }
    let fieldMap = fieldsForEqualsMap.get(object.constructor);
    if (isEmpty(fieldMap)) {
      fieldMap = new Map();
    }
    fieldMap.set(propertyName, fields);
    fieldsForEqualsMap.set(object.constructor, fieldMap);
  }
}


export function getFieldsForEquals(constructor: Function, field: string) {
  const fieldMap = fieldsForEqualsMap.get(constructor) || new Map();
  return fieldMap.get(field);
}