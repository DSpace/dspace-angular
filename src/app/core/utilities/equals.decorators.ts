import { isEmpty } from '../../shared/empty.util';
import { GenericConstructor } from '../shared/generic-constructor';
import { EquatableObject } from './equatable';

const excludedFromEquals = new Map();
const fieldsForEqualsMap = new Map();

export function inheritEquatable(parentCo: GenericConstructor<EquatableObject<any>>) {
  return function decorator(childCo: GenericConstructor<EquatableObject<any>>) {
    const parentExcludedFields = getExcludedFromEqualsFor(parentCo) || [];
    const excludedFields = getExcludedFromEqualsFor(childCo) || [];
    excludedFromEquals.set(childCo, [...excludedFields, ...parentExcludedFields]);

    const mappedFields = fieldsForEqualsMap.get(childCo) || new Map();
    const parentMappedFields = fieldsForEqualsMap.get(parentCo) || new Map();
    Array.from(parentMappedFields.keys())
      .filter((key) => !Array.from(mappedFields.keys()).includes(key))
      .forEach((key) => {
        fieldsForEquals(...parentMappedFields.get(key))(new childCo(), key);
      });
  }
}

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

// tslint:disable-next-line:ban-types
export function getExcludedFromEqualsFor(constructor: Function): string[] {
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

// tslint:disable-next-line:ban-types
export function getFieldsForEquals(constructor: Function, field: string): string[] {
  const fieldMap = fieldsForEqualsMap.get(constructor) || new Map();
  return fieldMap.get(field);
}
