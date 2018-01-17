import {
  hasNoValue, isEmpty, isNotNull, isNotUndefined, isNull,
  isUndefined
} from '../../shared/empty.util';

/* tslint:disable:no-string-literal */
function propertiesEqual<T extends any>(leftValue: T, rightValue: T) {
  if (isUndefined(leftValue)) {
    return isUndefined(rightValue);
  } else if (isNull(leftValue)) {
    return isNull(rightValue);
  } else if (Array.isArray(leftValue)) {
    return Array.isArray(rightValue) &&
      leftValue.length === rightValue.length &&
      isEmpty(leftValue.find((element, index) => propertiesEqual(element, rightValue[index])));
  } else if (typeof leftValue === 'function') {
    return leftValue.toString() === rightValue.toString();
  } else if (typeof leftValue === 'function') {
    return leftValue.toString() === rightValue.toString();
  } else if (typeof leftValue['equals'] === 'function') {
    return (leftValue as any).equals(rightValue);
  } else {
    return leftValue === rightValue;
  }
}
/* tslint:enable:no-string-literal */

export abstract class Equatable {
  equals(that: Equatable): boolean {
    if (hasNoValue(that)) {
      return false;
    }

    const thisKeys = Object.keys(this);
    const thatKeys = Object.keys(that);
    if (thisKeys.length !== thatKeys.length) {
      return false;
    }

    const propertyThatDoesntMatch = thisKeys.find((key) => {
      const thisValue = this[key];
      const thatValue = that[key];
      return !propertiesEqual(thisValue, thatValue);
    });

    if (!isEmpty(propertyThatDoesntMatch)) {
      console.log(propertyThatDoesntMatch, this.constructor, that.constructor);
    }

    return isEmpty(propertyThatDoesntMatch);
  }
}

export function compareEquatables<T extends Equatable>(a: T, b: T) {
  return a.equals(b);
}
