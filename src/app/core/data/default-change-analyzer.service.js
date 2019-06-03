import * as tslib_1 from "tslib";
import { compare } from 'fast-json-patch';
import { Injectable } from '@angular/core';
/**
 * A class to determine what differs between two
 * CacheableObjects
 */
var DefaultChangeAnalyzer = /** @class */ (function () {
    function DefaultChangeAnalyzer() {
    }
    /**
     * Compare the metadata of two CacheableObject and return the differences as
     * a JsonPatch Operation Array
     *
     * @param {NormalizedObject} object1
     *    The first object to compare
     * @param {NormalizedObject} object2
     *    The second object to compare
     */
    DefaultChangeAnalyzer.prototype.diff = function (object1, object2) {
        return compare(object1, object2);
    };
    DefaultChangeAnalyzer = tslib_1.__decorate([
        Injectable()
    ], DefaultChangeAnalyzer);
    return DefaultChangeAnalyzer;
}());
export { DefaultChangeAnalyzer };
//# sourceMappingURL=default-change-analyzer.service.js.map