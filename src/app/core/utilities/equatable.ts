import { getExcludedFromEqualsFor, getFieldsForEquals } from './equals.decorators';
import { hasNoValue, hasValue } from '../../shared/empty.util';

/**
 * Method to compare fields of two objects against each other
 * @param object1 The first object for the comparison
 * @param object2 The second object for the comparison
 * @param fieldList The list of property/field names to compare
 */
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
    if (typeof object1[key] === 'object') {
      return !equalsByFields(object1[key], object2[key], Object.keys(object1));
    }
    return object1[key] !== object2[key];
  });
  return hasNoValue(unequalProperty);
}

/**
 * Abstract class to represent objects that can be compared to each other
 * It provides a default way of comparing
 */
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
