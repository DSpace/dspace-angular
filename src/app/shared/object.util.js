import * as tslib_1 from "tslib";
import { isNotEmpty } from './empty.util';
import { isEqual, isObject, transform } from 'lodash';
/**
 * Returns passed object without specified property
 */
export function deleteProperty(object, key) {
    var _a = key, deletedKey = object[_a], otherKeys = tslib_1.__rest(object, [typeof _a === "symbol" ? _a : _a + ""]);
    return otherKeys;
}
/**
 * Returns true if the passed object is empty or has only empty property.
 * hasOnlyEmptyProperties({});               // true
 * hasOnlyEmptyProperties({a: null});        // true
 * hasOnlyEmptyProperties({a: []});          // true
 * hasOnlyEmptyProperties({a: [], b: {});    // true
 * hasOnlyEmptyProperties({a: 'a', b: 'b'}); // false
 * hasOnlyEmptyProperties({a: [], b: 'b'});  // false
 */
export function hasOnlyEmptyProperties(obj) {
    var objectType = typeof obj;
    if (objectType === 'object') {
        if (Object.keys(obj).length === 0) {
            return true;
        }
        else {
            var result = true;
            for (var key in obj) {
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
    var changes = function (o, b) {
        return transform(o, function (result, value, key) {
            if (!isEqual(value, b[key]) && isNotEmpty(value)) {
                var resultValue = (isObject(value) && isObject(b[key])) ? changes(value, b[key]) : value;
                if (!hasOnlyEmptyProperties(resultValue)) {
                    result[key] = resultValue;
                }
            }
        });
    };
    return changes(object, base);
}
//# sourceMappingURL=object.util.js.map