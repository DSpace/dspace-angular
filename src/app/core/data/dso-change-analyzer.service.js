import * as tslib_1 from "tslib";
import { compare } from 'fast-json-patch';
import { Injectable } from '@angular/core';
/**
 * A class to determine what differs between two
 * DSpaceObjects
 */
var DSOChangeAnalyzer = /** @class */ (function () {
    function DSOChangeAnalyzer() {
    }
    /**
     * Compare the metadata of two DSpaceObjects and return the differences as
     * a JsonPatch Operation Array
     *
     * @param {NormalizedDSpaceObject} object1
     *    The first object to compare
     * @param {NormalizedDSpaceObject} object2
     *    The second object to compare
     */
    DSOChangeAnalyzer.prototype.diff = function (object1, object2) {
        return compare(object1.metadata, object2.metadata).map(function (operation) { return Object.assign({}, operation, { path: '/metadata' + operation.path }); });
    };
    DSOChangeAnalyzer = tslib_1.__decorate([
        Injectable()
    ], DSOChangeAnalyzer);
    return DSOChangeAnalyzer;
}());
export { DSOChangeAnalyzer };
//# sourceMappingURL=dso-change-analyzer.service.js.map