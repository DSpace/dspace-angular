import * as tslib_1 from "tslib";
import { map } from 'rxjs/operators';
import { Component, Input } from '@angular/core';
import { Item } from '../../../core/shared/item.model';
import { RemoteDataBuildService } from '../../../core/cache/builders/remote-data-build.service';
/**
 * This component renders the parent collections section of the item
 * inside a 'ds-metadata-field-wrapper' component.
 */
var CollectionsComponent = /** @class */ (function () {
    function CollectionsComponent(rdbs) {
        this.rdbs = rdbs;
        this.label = 'item.page.collections';
        this.separator = '<br/>';
    }
    CollectionsComponent.prototype.ngOnInit = function () {
        //   this.collections = this.item.parents.payload;
        // TODO: this should use parents, but the collections
        // for an Item aren't returned by the REST API yet,
        // only the owning collection
        this.collections = this.item.owner.pipe(map(function (rd) { return [rd.payload]; }));
    };
    CollectionsComponent.prototype.hasSucceeded = function () {
        return this.item.owner.pipe(map(function (rd) { return rd.hasSucceeded; }));
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Item)
    ], CollectionsComponent.prototype, "item", void 0);
    CollectionsComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-item-page-collections',
            templateUrl: './collections.component.html'
        }),
        tslib_1.__metadata("design:paramtypes", [RemoteDataBuildService])
    ], CollectionsComponent);
    return CollectionsComponent;
}());
export { CollectionsComponent };
//# sourceMappingURL=collections.component.js.map