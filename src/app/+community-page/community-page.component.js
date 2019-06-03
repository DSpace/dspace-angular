import * as tslib_1 from "tslib";
import { mergeMap, filter, map } from 'rxjs/operators';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommunityDataService } from '../core/data/community-data.service';
import { MetadataService } from '../core/metadata/metadata.service';
import { fadeInOut } from '../shared/animations/fade';
import { hasValue } from '../shared/empty.util';
import { redirectToPageNotFoundOn404 } from '../core/shared/operators';
var CommunityPageComponent = /** @class */ (function () {
    function CommunityPageComponent(communityDataService, metadata, route, router) {
        this.communityDataService = communityDataService;
        this.metadata = metadata;
        this.route = route;
        this.router = router;
    }
    CommunityPageComponent.prototype.ngOnInit = function () {
        this.communityRD$ = this.route.data.pipe(map(function (data) { return data.community; }), redirectToPageNotFoundOn404(this.router));
        this.logoRD$ = this.communityRD$.pipe(map(function (rd) { return rd.payload; }), filter(function (community) { return hasValue(community); }), mergeMap(function (community) { return community.logo; }));
    };
    CommunityPageComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-community-page',
            styleUrls: ['./community-page.component.scss'],
            templateUrl: './community-page.component.html',
            changeDetection: ChangeDetectionStrategy.OnPush,
            animations: [fadeInOut]
        })
        /**
         * This component represents a detail page for a single community
         */
        ,
        tslib_1.__metadata("design:paramtypes", [CommunityDataService,
            MetadataService,
            ActivatedRoute,
            Router])
    ], CommunityPageComponent);
    return CommunityPageComponent;
}());
export { CommunityPageComponent };
//# sourceMappingURL=community-page.component.js.map