import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
/**
 * A component to display the "Browse By" section of a Community or Collection page
 * It expects the ID of the Community or Collection as input to be passed on as a scope
 */
var ComcolPageBrowseByComponent = /** @class */ (function () {
    function ComcolPageBrowseByComponent() {
    }
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], ComcolPageBrowseByComponent.prototype, "id", void 0);
    ComcolPageBrowseByComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-comcol-page-browse-by',
            templateUrl: './comcol-page-browse-by.component.html',
        })
    ], ComcolPageBrowseByComponent);
    return ComcolPageBrowseByComponent;
}());
export { ComcolPageBrowseByComponent };
//# sourceMappingURL=comcol-page-browse-by.component.js.map