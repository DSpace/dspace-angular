import * as tslib_1 from "tslib";
import { Component, EventEmitter, Injector, Input, Output } from '@angular/core';
import { PaginationComponentOptions } from '../pagination/pagination-component-options.model';
import { SortDirection, SortOptions } from '../../core/cache/models/sort-options.model';
import { fadeIn, fadeInOut } from '../animations/fade';
import { Observable } from 'rxjs';
import { getStartsWithComponent, StartsWithType } from '../starts-with/starts-with-decorator';
var BrowseByComponent = /** @class */ (function () {
    function BrowseByComponent(injector) {
        this.injector = injector;
        /**
         * The type of StartsWith options used to define what component to render for the options
         * Defaults to text
         */
        this.type = StartsWithType.text;
        /**
         * The list of options to render for the StartsWith component
         */
        this.startsWithOptions = [];
        /**
         * Whether or not the pagination should be rendered as simple previous and next buttons instead of the normal pagination
         */
        this.enableArrows = false;
        /**
         * If enableArrows is set to true, should it hide the options gear?
         */
        this.hideGear = false;
        /**
         * If enableArrows is set to true, emit when the previous button is clicked
         */
        this.prev = new EventEmitter();
        /**
         * If enableArrows is set to true, emit when the next button is clicked
         */
        this.next = new EventEmitter();
        /**
         * If enableArrows is set to true, emit when the page size is changed
         */
        this.pageSizeChange = new EventEmitter();
        /**
         * If enableArrows is set to true, emit when the sort direction is changed
         */
        this.sortDirectionChange = new EventEmitter();
        /**
         * Declare SortDirection enumeration to use it in the template
         */
        this.sortDirections = SortDirection;
    }
    /**
     * Go to the previous page
     */
    BrowseByComponent.prototype.goPrev = function () {
        this.prev.emit(true);
    };
    /**
     * Go to the next page
     */
    BrowseByComponent.prototype.goNext = function () {
        this.next.emit(true);
    };
    /**
     * Change the page size
     * @param size
     */
    BrowseByComponent.prototype.doPageSizeChange = function (size) {
        this.paginationConfig.pageSize = size;
        this.pageSizeChange.emit(size);
    };
    /**
     * Change the sort direction
     * @param direction
     */
    BrowseByComponent.prototype.doSortDirectionChange = function (direction) {
        this.sortConfig.direction = direction;
        this.sortDirectionChange.emit(direction);
    };
    /**
     * Get the switchable StartsWith component dependant on the type
     */
    BrowseByComponent.prototype.getStartsWithComponent = function () {
        return getStartsWithComponent(this.type);
    };
    BrowseByComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.objectInjector = Injector.create({
            providers: [{ provide: 'startsWithOptions', useFactory: function () { return (_this.startsWithOptions); }, deps: [] }],
            parent: this.injector
        });
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], BrowseByComponent.prototype, "title", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Observable)
    ], BrowseByComponent.prototype, "objects$", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", PaginationComponentOptions)
    ], BrowseByComponent.prototype, "paginationConfig", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", SortOptions)
    ], BrowseByComponent.prototype, "sortConfig", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], BrowseByComponent.prototype, "type", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], BrowseByComponent.prototype, "startsWithOptions", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], BrowseByComponent.prototype, "enableArrows", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], BrowseByComponent.prototype, "hideGear", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], BrowseByComponent.prototype, "prev", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], BrowseByComponent.prototype, "next", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], BrowseByComponent.prototype, "pageSizeChange", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], BrowseByComponent.prototype, "sortDirectionChange", void 0);
    BrowseByComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-browse-by',
            styleUrls: ['./browse-by.component.scss'],
            templateUrl: './browse-by.component.html',
            animations: [
                fadeIn,
                fadeInOut
            ]
        })
        /**
         * Component to display a browse-by page for any ListableObject
         */
        ,
        tslib_1.__metadata("design:paramtypes", [Injector])
    ], BrowseByComponent);
    return BrowseByComponent;
}());
export { BrowseByComponent };
//# sourceMappingURL=browse-by.component.js.map