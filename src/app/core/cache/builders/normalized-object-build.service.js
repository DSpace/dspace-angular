import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { getRelationships } from './build-decorators';
import { NormalizedObjectFactory } from '../models/normalized-object-factory';
import { hasValue, isNotEmpty } from '../../../shared/empty.util';
/**
 * Return true if halObj has a value for `_links.self`
 *
 * @param {any} halObj The object to test
 */
export function isRestDataObject(halObj) {
    return isNotEmpty(halObj._links) && hasValue(halObj._links.self);
}
/**
 * Return true if halObj has a value for `page` and  `_embedded`
 *
 * @param {any} halObj The object to test
 */
export function isRestPaginatedList(halObj) {
    return hasValue(halObj.page) && hasValue(halObj._embedded);
}
/**
 * A service to turn domain models in to their normalized
 * counterparts.
 */
var NormalizedObjectBuildService = /** @class */ (function () {
    function NormalizedObjectBuildService() {
    }
    /**
     * Returns the normalized model that corresponds to the given domain model
     *
     * @param {TDomain} domainModel a domain model
     */
    NormalizedObjectBuildService.prototype.normalize = function (domainModel) {
        var normalizedConstructor = NormalizedObjectFactory.getConstructor(domainModel.type);
        var relationships = getRelationships(normalizedConstructor) || [];
        var normalizedModel = Object.assign({}, domainModel);
        relationships.forEach(function (key) {
            if (hasValue(domainModel[key])) {
                domainModel[key] = undefined;
            }
        });
        return normalizedModel;
    };
    NormalizedObjectBuildService = tslib_1.__decorate([
        Injectable()
    ], NormalizedObjectBuildService);
    return NormalizedObjectBuildService;
}());
export { NormalizedObjectBuildService };
//# sourceMappingURL=normalized-object-build.service.js.map