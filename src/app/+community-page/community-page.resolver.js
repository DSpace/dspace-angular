import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { CommunityDataService } from '../core/data/community-data.service';
import { find } from 'rxjs/operators';
import { hasValue } from '../shared/empty.util';
/**
 * This class represents a resolver that requests a specific community before the route is activated
 */
var CommunityPageResolver = /** @class */ (function () {
    function CommunityPageResolver(communityService) {
        this.communityService = communityService;
    }
    /**
     * Method for resolving a community based on the parameters in the current route
     * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
     * @param {RouterStateSnapshot} state The current RouterStateSnapshot
     * @returns Observable<<RemoteData<Community>> Emits the found community based on the parameters in the current route,
     * or an error if something went wrong
     */
    CommunityPageResolver.prototype.resolve = function (route, state) {
        return this.communityService.findById(route.params.id).pipe(find(function (RD) { return hasValue(RD.error) || RD.hasSucceeded; }));
    };
    CommunityPageResolver = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [CommunityDataService])
    ], CommunityPageResolver);
    return CommunityPageResolver;
}());
export { CommunityPageResolver };
//# sourceMappingURL=community-page.resolver.js.map