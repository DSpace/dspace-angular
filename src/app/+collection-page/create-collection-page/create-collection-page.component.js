import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { CommunityDataService } from '../../core/data/community-data.service';
import { RouteService } from '../../shared/services/route.service';
import { Router } from '@angular/router';
import { CreateComColPageComponent } from '../../shared/comcol-forms/create-comcol-page/create-comcol-page.component';
import { CollectionDataService } from '../../core/data/collection-data.service';
/**
 * Component that represents the page where a user can create a new Collection
 */
var CreateCollectionPageComponent = /** @class */ (function (_super) {
    tslib_1.__extends(CreateCollectionPageComponent, _super);
    function CreateCollectionPageComponent(communityDataService, collectionDataService, routeService, router) {
        var _this = _super.call(this, collectionDataService, communityDataService, routeService, router) || this;
        _this.communityDataService = communityDataService;
        _this.collectionDataService = collectionDataService;
        _this.routeService = routeService;
        _this.router = router;
        _this.frontendURL = '/collections/';
        return _this;
    }
    CreateCollectionPageComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-create-collection',
            styleUrls: ['./create-collection-page.component.scss'],
            templateUrl: './create-collection-page.component.html'
        }),
        tslib_1.__metadata("design:paramtypes", [CommunityDataService,
            CollectionDataService,
            RouteService,
            Router])
    ], CreateCollectionPageComponent);
    return CreateCollectionPageComponent;
}(CreateComColPageComponent));
export { CreateCollectionPageComponent };
//# sourceMappingURL=create-collection-page.component.js.map