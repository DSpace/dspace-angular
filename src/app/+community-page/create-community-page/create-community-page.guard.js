import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { hasNoValue, hasValue } from '../../shared/empty.util';
import { CommunityDataService } from '../../core/data/community-data.service';
import { getFinishedRemoteData } from '../../core/shared/operators';
import { map, tap } from 'rxjs/operators';
import { of as observableOf } from 'rxjs';
/**
 * Prevent creation of a community with an invalid parent community provided
 * @class CreateCommunityPageGuard
 */
var CreateCommunityPageGuard = /** @class */ (function () {
    function CreateCommunityPageGuard(router, communityService) {
        this.router = router;
        this.communityService = communityService;
    }
    /**
     * True when either NO parent ID query parameter has been provided, or the parent ID resolves to a valid parent community
     * Reroutes to a 404 page when the page cannot be activated
     * @method canActivate
     */
    CreateCommunityPageGuard.prototype.canActivate = function (route, state) {
        var _this = this;
        var parentID = route.queryParams.parent;
        if (hasNoValue(parentID)) {
            return observableOf(true);
        }
        var parent = this.communityService.findById(parentID)
            .pipe(getFinishedRemoteData());
        return parent.pipe(map(function (communityRD) { return hasValue(communityRD) && communityRD.hasSucceeded && hasValue(communityRD.payload); }), tap(function (isValid) {
            if (!isValid) {
                _this.router.navigate(['/404']);
            }
        }));
    };
    CreateCommunityPageGuard = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [Router, CommunityDataService])
    ], CreateCommunityPageGuard);
    return CreateCommunityPageGuard;
}());
export { CreateCommunityPageGuard };
//# sourceMappingURL=create-community-page.guard.js.map