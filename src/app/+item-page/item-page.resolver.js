import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { ItemDataService } from '../core/data/item-data.service';
import { hasValue } from '../shared/empty.util';
import { find } from 'rxjs/operators';
/**
 * This class represents a resolver that requests a specific item before the route is activated
 */
var ItemPageResolver = /** @class */ (function () {
    function ItemPageResolver(itemService) {
        this.itemService = itemService;
    }
    /**
     * Method for resolving an item based on the parameters in the current route
     * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
     * @param {RouterStateSnapshot} state The current RouterStateSnapshot
     * @returns Observable<<RemoteData<Item>> Emits the found item based on the parameters in the current route,
     * or an error if something went wrong
     */
    ItemPageResolver.prototype.resolve = function (route, state) {
        return this.itemService.findById(route.params.id)
            .pipe(find(function (RD) { return hasValue(RD.error) || RD.hasSucceeded; }));
    };
    ItemPageResolver = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [ItemDataService])
    ], ItemPageResolver);
    return ItemPageResolver;
}());
export { ItemPageResolver };
//# sourceMappingURL=item-page.resolver.js.map