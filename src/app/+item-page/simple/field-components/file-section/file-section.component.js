import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import { Item } from '../../../../core/shared/item.model';
/**
 * This component renders the file section of the item
 * inside a 'ds-metadata-field-wrapper' component.
 */
var FileSectionComponent = /** @class */ (function () {
    function FileSectionComponent() {
        this.label = 'item.page.files';
        this.separator = '<br/>';
    }
    FileSectionComponent.prototype.ngOnInit = function () {
        this.initialize();
    };
    FileSectionComponent.prototype.initialize = function () {
        this.bitstreamsObs = this.item.getFiles();
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Item)
    ], FileSectionComponent.prototype, "item", void 0);
    FileSectionComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-item-page-file-section',
            templateUrl: './file-section.component.html'
        })
    ], FileSectionComponent);
    return FileSectionComponent;
}());
export { FileSectionComponent };
//# sourceMappingURL=file-section.component.js.map