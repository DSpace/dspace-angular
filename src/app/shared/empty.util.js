import { filter, map } from 'rxjs/operators';
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
export function isNull(obj) {
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
export function isNotNull(obj) {
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
export function isUndefined(obj) {
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
export function isNotUndefined(obj) {
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
export function hasNoValue(obj) {
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
export function hasValue(obj) {
    return isNotUndefined(obj) && isNotNull(obj);
}
/**
 * Filter items emitted by the source Observable by only emitting those for
 * which hasValue is true
 */
export var hasValueOperator = function () {
    return function (source) {
        return source.pipe(filter(function (obj) { return hasValue(obj); }));
    };
};
/**
 * Verifies that a value is `null` or an empty string, empty array,
 * or empty function.
 * isEmpty();                // true
 * isEmpty(null);            // true
 * isEmpty(undefined);       // true
 * isEmpty('');              // true
 * isEmpty([]);              // true
 * isEmpty({});              // true
 * isEmpty('Adam Hawkins');  // false
 * isEmpty([0,1,2]);         // false
 * isEmpty('\n\t');          // false
 * isEmpty('  ');            // false
 */
export function isEmpty(obj) {
    if (hasNoValue(obj)) {
        return true;
    }
    if (typeof obj.size === 'number') {
        return !obj.size;
    }
    var objectType = typeof obj;
    if (objectType === 'object') {
        var size = obj.size;
        if (typeof size === 'number') {
            return !size;
        }
    }
    if (typeof obj.length === 'number' && objectType !== 'function') {
        return !obj.length;
    }
    if (objectType === 'object') {
        if (Object.keys(obj).length === 0) {
            return true;
        }
        var length_1 = obj.length;
        if (typeof length_1 === 'number') {
            return !length_1;
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
 * isNotEmpty({});              // false
 * isNotEmpty('Adam Hawkins');  // true
 * isNotEmpty([0,1,2]);         // true
 * isNotEmpty('\n\t');          // true
 * isNotEmpty('  ');            // true
 */
export function isNotEmpty(obj) {
    return !isEmpty(obj);
}
/**
 * Filter items emitted by the source Observable by only emitting those for
 * which isNotEmpty is true
 */
export var isNotEmptyOperator = function () {
    return function (source) {
        return source.pipe(filter(function (obj) { return isNotEmpty(obj); }));
    };
};
/**
 * Tests each value emitted by the source Observable,
 * let's arrays pass through, turns other values in to
 * empty arrays. Used to be able to chain array operators
 * on something that may not have a value
 */
export var ensureArrayHasValue = function () {
    return function (source) {
        return source.pipe(map(function (arr) { return Array.isArray(arr) ? arr : []; }));
    };
};
//# sourceMappingURL=empty.util.js.map