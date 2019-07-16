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
    const mapping = getFieldsForEquals(this.constructor, key);
    if (hasValue(mapping)) {
      return !equalsByFields(object1[key], object2[key], mapping);
    }
    if (this[key] instanceof EquatableObject) {
      return !object1[key].equals(object2[key]);
    }
    return object1[key] !== object2[key];
  });
  return hasNoValue(unequalProperty);
}

export abstract class EquatableObject<T> {
  equals(other: T): boolean {
    const excludedKeys = getExcludedFromEqualsFor(this.constructor);
    const keys = Object.keys(this).filter((key) => excludedKeys.findIndex((excludedKey) => key === excludedKey) < 0);
    return equalsByFields(this, other, keys);
  }
}