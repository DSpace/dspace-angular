import { isNotEmpty } from './empty.util';
import { isEqual, isObject, transform } from 'lodash';

/**
 * Returns passed object without specified property
 */
export function deleteProperty(object, key): object {
  const {[key]: deletedKey, ...otherKeys} = object;
  return otherKeys;
}

/**
 * Returns true if the passed value is null or undefined.
 * hasNoValue();              // true
 * hasNoValue(null);          // true
 * hasNoValue(undefined);     // true
 * hasNoValue('');            // false
 * hasNoValue({});            // false
 * hasNoValue([]);            // false
 * hasNoValue(function() {}); // false
 */
export function isObjectEmpty(obj: any): boolean {
  const objectType = typeof obj;
  if (objectType === 'object') {
    if (Object.keys(obj).length === 0) {
      return true;
    } else {
      let result = true;
      for (const key in obj) {
        if (isNotEmpty(obj[key])) {
          result = false;
          break;
        }
      }
      return result;
    }
  }
}

export function difference(object, base) {
  const changes = (o, b) => {
    return transform(o, (result, value, key) => {
      if (!isEqual(value, b[key]) && isNotEmpty(value)) {
        result[key] = (isObject(value) && isObject(b[key])) ? changes(value, b[key]) : value;
      }
    });
  };
  return changes(object, base);
}
