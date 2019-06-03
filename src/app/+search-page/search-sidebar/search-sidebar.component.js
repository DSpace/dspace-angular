import * as tslib_1 from "tslib";
import { Component, EventEmitter, Input, Output } from '@angular/core';
/**
 * This component renders a simple item page.
 * The route parameter 'id' is used to request the item it represents.
 * All fields of the item that should be displayed, are defined in its template.
 */
var SearchSidebarComponent = /** @class */ (function () {
    function SearchSidebarComponent() {
        /**
         * Emits event when the user clicks a button to open or close the sidebar
         */
        this.toggleSidebar = new EventEmitter();
    }
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Array)
    ], SearchSidebarComponent.prototype, "configurationList", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], SearchSidebarComponent.prototype, "resultCount", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], SearchSidebarComponent.prototype, "viewModeList", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], SearchSidebarComponent.prototype, "inPlaceSearch", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], SearchSidebarComponent.prototype, "toggleSidebar", void 0);
    SearchSidebarComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-search-sidebar',
            styleUrls: ['./search-sidebar.component.scss'],
            templateUrl: './search-sidebar.component.html',
        })
        /**
         * Component representing the sidebar on the search page
         */
    ], SearchSidebarComponent);
    return SearchSidebarComponent;
}());
export { SearchSidebarComponent };
//# sourceMappingURL=search-sidebar.component.js.map