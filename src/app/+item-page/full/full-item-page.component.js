import * as tslib_1 from "tslib";
import { filter, map } from 'rxjs/operators';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemPageComponent } from '../simple/item-page.component';
import { ItemDataService } from '../../core/data/item-data.service';
import { MetadataService } from '../../core/metadata/metadata.service';
import { fadeInOut } from '../../shared/animations/fade';
import { hasValue } from '../../shared/empty.util';
/**
 * This component renders a simple item page.
 * The route parameter 'id' is used to request the item it represents.
 * All fields of the item that should be displayed, are defined in its template.
 */
var FullItemPageComponent = /** @class */ (function (_super) {
    tslib_1.__extends(FullItemPageComponent, _super);
    function FullItemPageComponent(route, router, items, metadataService) {
        return _super.call(this, route, router, items, metadataService) || this;
    }
    /*** AoT inheritance fix, will hopefully be resolved in the near future **/
    FullItemPageComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.metadata$ = this.itemRD$.pipe(map(function (rd) { return rd.payload; }), filter(function (item) { return hasValue(item); }), map(function (item) { return item.metadata; }));
    };
    FullItemPageComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-full-item-page',
            styleUrls: ['./full-item-page.component.scss'],
            templateUrl: './full-item-page.component.html',
            changeDetection: ChangeDetectionStrategy.OnPush,
            animations: [fadeInOut]
        }),
        tslib_1.__metadata("design:paramtypes", [ActivatedRoute, Router, ItemDataService, MetadataService])
    ], FullItemPageComponent);
    return FullItemPageComponent;
}(ItemPageComponent));
export { FullItemPageComponent };
//# sourceMappingURL=full-item-page.component.js.map