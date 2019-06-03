import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
/**
 * This component renders any content inside of this component.
 * If there is a title set it will render the title.
 * If hasInnerHtml is true the content will be handled as html.
 * To see how it is used see collection-page or community-page.
 */
var ComcolPageContentComponent = /** @class */ (function () {
    function ComcolPageContentComponent() {
    }
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], ComcolPageContentComponent.prototype, "title", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], ComcolPageContentComponent.prototype, "content", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Boolean)
    ], ComcolPageContentComponent.prototype, "hasInnerHtml", void 0);
    ComcolPageContentComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-comcol-page-content',
            styleUrls: ['./comcol-page-content.component.scss'],
            templateUrl: './comcol-page-content.component.html'
        })
    ], ComcolPageContentComponent);
    return ComcolPageContentComponent;
}());
export { ComcolPageContentComponent };
//# sourceMappingURL=comcol-page-content.component.js.map