import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { CollectionDataService } from '../core/data/collection-data.service';
import { find } from 'rxjs/operators';
import { hasValue } from '../shared/empty.util';
/**
 * This class represents a resolver that requests a specific collection before the route is activated
 */
var CollectionPageResolver = /** @class */ (function () {
    function CollectionPageResolver(collectionService) {
        this.collectionService = collectionService;
    }
    /**
     * Method for resolving a collection based on the parameters in the current route
     * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
     * @param {RouterStateSnapshot} state The current RouterStateSnapshot
     * @returns Observable<<RemoteData<Collection>> Emits the found collection based on the parameters in the current route,
     * or an error if something went wrong
     */
    CollectionPageResolver.prototype.resolve = function (route, state) {
        return this.collectionService.findById(route.params.id).pipe(find(function (RD) { return hasValue(RD.error) || RD.hasSucceeded; }));
    };
    CollectionPageResolver = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [CollectionDataService])
    ], CollectionPageResolver);
    return CollectionPageResolver;
}());
export { CollectionPageResolver };
//# sourceMappingURL=collection-page.resolver.js.map