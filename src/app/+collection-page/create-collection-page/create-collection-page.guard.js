import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { hasNoValue, hasValue } from '../../shared/empty.util';
import { CommunityDataService } from '../../core/data/community-data.service';
import { getFinishedRemoteData } from '../../core/shared/operators';
import { map, tap } from 'rxjs/operators';
import { of as observableOf } from 'rxjs';
/**
 * Prevent creation of a collection without a parent community provided
 * @class CreateCollectionPageGuard
 */
var CreateCollectionPageGuard = /** @class */ (function () {
    function CreateCollectionPageGuard(router, communityService) {
        this.router = router;
        this.communityService = communityService;
    }
    /**
     * True when either a parent ID query parameter has been provided and the parent ID resolves to a valid parent community
     * Reroutes to a 404 page when the page cannot be activated
     * @method canActivate
     */
    CreateCollectionPageGuard.prototype.canActivate = function (route, state) {
        var _this = this;
        var parentID = route.queryParams.parent;
        if (hasNoValue(parentID)) {
            this.router.navigate(['/404']);
            return observableOf(false);
        }
        var parent = this.communityService.findById(parentID)
            .pipe(getFinishedRemoteData());
        return parent.pipe(map(function (communityRD) { return hasValue(communityRD) && communityRD.hasSucceeded && hasValue(communityRD.payload); }), tap(function (isValid) {
            if (!isValid) {
                _this.router.navigate(['/404']);
            }
        }));
    };
    CreateCollectionPageGuard = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [Router, CommunityDataService])
    ], CreateCollectionPageGuard);
    return CreateCollectionPageGuard;
}());
export { CreateCollectionPageGuard };
//# sourceMappingURL=create-collection-page.guard.js.map