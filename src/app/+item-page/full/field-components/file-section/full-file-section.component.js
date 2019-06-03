import * as tslib_1 from "tslib";
import { combineLatest as observableCombineLatest } from 'rxjs';
import { Component, Input } from '@angular/core';
import { Item } from '../../../../core/shared/item.model';
import { FileSectionComponent } from '../../../simple/field-components/file-section/file-section.component';
import { map } from 'rxjs/operators';
/**
 * This component renders the file section of the item
 * inside a 'ds-metadata-field-wrapper' component.
 */
var FullFileSectionComponent = /** @class */ (function (_super) {
    tslib_1.__extends(FullFileSectionComponent, _super);
    function FullFileSectionComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.thumbnails = new Map();
        return _this;
    }
    FullFileSectionComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
    };
    FullFileSectionComponent.prototype.initialize = function () {
        var _this = this;
        var originals = this.item.getFiles();
        var licenses = this.item.getBitstreamsByBundleName('LICENSE');
        this.bitstreamsObs = observableCombineLatest(originals, licenses).pipe(map(function (_a) {
            var o = _a[0], l = _a[1];
            return o.concat(l);
        }));
        this.bitstreamsObs.subscribe(function (files) {
            return files.forEach(function (original) {
                var thumbnail = _this.item.getThumbnailForOriginal(original);
                _this.thumbnails.set(original.id, thumbnail);
            });
        });
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Item)
    ], FullFileSectionComponent.prototype, "item", void 0);
    FullFileSectionComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-item-page-full-file-section',
            styleUrls: ['./full-file-section.component.scss'],
            templateUrl: './full-file-section.component.html'
        })
    ], FullFileSectionComponent);
    return FullFileSectionComponent;
}(FileSectionComponent));
export { FullFileSectionComponent };
//# sourceMappingURL=full-file-section.component.js.map