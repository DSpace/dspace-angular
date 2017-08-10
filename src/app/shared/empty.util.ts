/**
 * Returns true if the passed value is null.
 * isNull();              // false
 * isNull(null);          // true
 * isNull(undefined);     // false
 * isNull('');            // false
 * isNull({});            // false
 * isNull([]);            // false
 * isNull(function() {}); // false
 */
export function isNull(obj?: any): boolean {
  return obj === null;
}

/**
 * Returns true if the passed value is not null.
 * isNotNull();              // true
 * isNotNull(null);          // false
 * isNotNull(undefined);     // true
 * isNotNull('');            // true
 * isNotNull({});            // true
 * isNotNull([]);            // true
 * isNotNull(function() {}); // true
 */
export function isNotNull(obj?: any): boolean {
  return obj !== null;
}

/**
 * Returns true if the passed value is undefined.
 * isUndefined();              // true
 * isUndefined(null);          // false
 * isUndefined(undefined);     // true
 * isUndefined('');            // false
 * isUndefined({});            // false
 * isUndefined([]);            // false
 * isUndefined(function() {}); // false
 */
export function isUndefined(obj?: any): boolean {
  return obj === undefined;
}

/**
 * Returns true if the passed value is not undefined.
 * isNotUndefined();              // false
 * isNotUndefined(null);          // true
 * isNotUndefined(undefined);     // false
 * isNotUndefined('');            // true
 * isNotUndefined({});            // true
 * isNotUndefined([]);            // true
 * isNotUndefined(function() {}); // true
 */
export function isNotUndefined(obj?: any): boolean {
  return obj !== undefined;
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
export function hasNoValue(obj?: any): boolean {
  return isUndefined(obj) || isNull(obj);
}

/**
 * Returns true if the passed value is not null or undefined.
 * hasValue();              // false
 * hasValue(null);          // false
 * hasValue(undefined);     // false
 * hasValue('');            // true
 * hasValue({});            // true
 * hasValue([]);            // true
 * hasValue(function() {}); // true
 */
export function hasValue(obj?: any): boolean {
  return isNotUndefined(obj) && isNotNull(obj);
}

/**
 * Verifies that a value is `null` or an empty string, empty array,
 * or empty function.
 * isEmpty();                // true
 * isEmpty(null);            // true
 * isEmpty(undefined);       // true
 * isEmpty('');              // true
 * isEmpty([]);              // true
 * isEmpty({});              // false
 * isEmpty('Adam Hawkins');  // false
 * isEmpty([0,1,2]);         // false
 * isEmpty('\n\t');          // false
 * isEmpty('  ');            // false
 */
export function isEmpty(obj?: any): boolean {
  if (hasNoValue(obj)) {
    return true;
  }

  if (typeof obj.size === 'number') {
    return !obj.size;
  }

  const objectType = typeof obj;

  if (objectType === 'object') {
    const size = obj.size;
    if (typeof size === 'number') {
      return !size;
    }
  }

  if (typeof obj.length === 'number' && objectType !== 'function') {
    return !obj.length;
  }

  if (objectType === 'object') {
    const length = obj.length;
    if (typeof length === 'number') {
      return !length;
    }
  }

  return false;
}

/**
 * Verifies that a value is not `null`, an empty string, empty array,
 * or empty function.
 * isNotEmpty();                // false
 * isNotEmpty(null);            // false
 * isNotEmpty(undefined);       // false
 * isNotEmpty('');              // false
 * isNotEmpty([]);              // false
 * isNotEmpty({});              // true
 * isNotEmpty('Adam Hawkins');  // true
 * isNotEmpty([0,1,2]);         // true
 * isNotEmpty('\n\t');          // true
 * isNotEmpty('  ');            // true
 */
export function isNotEmpty(obj?: any): boolean {
  return !isEmpty(obj);
}
