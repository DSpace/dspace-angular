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
 * Returns true if the passed object is empty or has only empty property.
 * isObjectEmpty({});               // true
 * isObjectEmpty({a: null});        // true
 * isObjectEmpty({a: []});          // true
 * isObjectEmpty({a: [], b: {});    // true
 * isObjectEmpty({a: 'a', b: 'b'}); // false
 * isObjectEmpty({a: [], b: 'b'});  // false
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

/**
 * Returns diff from the base object.
 * difference({}, {});                      // {}
 * difference({a: 'a', b: 'b'}, {a: 'a'});  // {b: 'b'}
 * difference({a: 'a', b: {}}, {a: 'a'});   // {}
 * difference({a: 'a'}, {a: 'a', b: 'b'});  // {}
 */
export function difference(object, base) {
  const changes = (o, b) => {
    return transform(o, (result, value, key) => {
      if (!isEqual(value, b[key]) && isNotEmpty(value)) {
        const resultValue = (isObject(value) && isObject(b[key])) ? changes(value, b[key]) : value;
        if (!isObjectEmpty(resultValue)) {
          result[key] = resultValue;
        }
      }
    });
  };
  return changes(object, base);
}
