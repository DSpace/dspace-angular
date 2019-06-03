import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EditComColPageComponent } from '../../shared/comcol-forms/edit-comcol-page/edit-comcol-page.component';
import { CollectionDataService } from '../../core/data/collection-data.service';
/**
 * Component that represents the page where a user can edit an existing Collection
 */
var EditCollectionPageComponent = /** @class */ (function (_super) {
    tslib_1.__extends(EditCollectionPageComponent, _super);
    function EditCollectionPageComponent(collectionDataService, router, route) {
        var _this = _super.call(this, collectionDataService, router, route) || this;
        _this.collectionDataService = collectionDataService;
        _this.router = router;
        _this.route = route;
        _this.frontendURL = '/collections/';
        return _this;
    }
    EditCollectionPageComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-edit-collection',
            styleUrls: ['./edit-collection-page.component.scss'],
            templateUrl: './edit-collection-page.component.html'
        }),
        tslib_1.__metadata("design:paramtypes", [CollectionDataService,
            Router,
            ActivatedRoute])
    ], EditCollectionPageComponent);
    return EditCollectionPageComponent;
}(EditComColPageComponent));
export { EditCollectionPageComponent };
//# sourceMappingURL=edit-collection-page.component.js.map