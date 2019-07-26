import { getExcludedFromEqualsFor, getFieldsForEquals } from './equals.decorators';
import { hasNoValue, hasValue } from '../../shared/empty.util';

function equalsByFields(object1, object2, fieldList): boolean {
  const unequalProperty = fieldList.find((key) => {
    if (object1[key] === object2[key]) {
      return false;
    }
    if (hasNoValue(object1[key]) && hasNoValue(object2[key])) {
      return false;
    }
    if (hasNoValue(object1[key]) || hasNoValue(object2[key])) {
      return true;
    }
    const mapping = getFieldsForEquals(object1.constructor, key);
    if (hasValue(mapping)) {
      return !equalsByFields(object1[key], object2[key], mapping);
    }
    if (object1[key] instanceof EquatableObject) {
      return !object1[key].equals(object2[key]);
    }
    return object1[key] !== object2[key];
  });
  return hasNoValue(unequalProperty);
}

export abstract class EquatableObject<T> {
  equals(other: T): boolean {
    if (hasNoValue(other)) {
      return false;
    }
    if (this as any === other) {
      return true;
    }
    const excludedKeys = getExcludedFromEqualsFor(this.constructor);
    const keys = Object.keys(this).filter((key) => !excludedKeys.includes(key));
    return equalsByFields(this, other, keys);
  }
}