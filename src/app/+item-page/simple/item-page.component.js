import * as tslib_1 from "tslib";
import { map } from 'rxjs/operators';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemDataService } from '../../core/data/item-data.service';
import { MetadataService } from '../../core/metadata/metadata.service';
import { fadeInOut } from '../../shared/animations/fade';
import { redirectToPageNotFoundOn404 } from '../../core/shared/operators';
import { ItemViewMode } from '../../shared/items/item-type-decorator';
/**
 * This component renders a simple item page.
 * The route parameter 'id' is used to request the item it represents.
 * All fields of the item that should be displayed, are defined in its template.
 */
var ItemPageComponent = /** @class */ (function () {
    function ItemPageComponent(route, router, items, metadataService) {
        this.route = route;
        this.router = router;
        this.items = items;
        this.metadataService = metadataService;
        /**
         * The view-mode we're currently on
         */
        this.viewMode = ItemViewMode.Full;
    }
    ItemPageComponent.prototype.ngOnInit = function () {
        this.itemRD$ = this.route.data.pipe(map(function (data) { return data.item; }), redirectToPageNotFoundOn404(this.router));
        this.metadataService.processRemoteData(this.itemRD$);
    };
    ItemPageComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-item-page',
            styleUrls: ['./item-page.component.scss'],
            templateUrl: './item-page.component.html',
            changeDetection: ChangeDetectionStrategy.OnPush,
            animations: [fadeInOut]
        }),
        tslib_1.__metadata("design:paramtypes", [ActivatedRoute,
            Router,
            ItemDataService,
            MetadataService])
    ], ItemPageComponent);
    return ItemPageComponent;
}());
export { ItemPageComponent };
//# sourceMappingURL=item-page.component.js.map