import * as tslib_1 from "tslib";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { SortOptions } from '../../core/cache/models/sort-options.model';
import { RemoteData } from '../../core/data/remote-data';
import { fadeIn } from '../animations/fade';
import { PaginationComponentOptions } from '../pagination/pagination-component-options.model';
/**
 * This component renders a paginated set of results in the detail view.
 */
var ObjectDetailComponent = /** @class */ (function () {
    function ObjectDetailComponent() {
        /**
         * A boolean representing if to hide gear pagination icon
         */
        this.hideGear = true;
        /**
         * A boolean representing if to hide pagination when there is only a page
         */
        this.hidePagerWhenSinglePage = true;
        /**
         * Option for hiding the pagination detail
         */
        this.hidePaginationDetail = true;
        /**
         * An event fired when the page is changed.
         * Event's payload equals to the newly selected page.
         */
        this.change = new EventEmitter();
        /**
         * An event fired when the page is changed.
         * Event's payload equals to the newly selected page.
         */
        this.pageChange = new EventEmitter();
        /**
         * An event fired when the page wsize is changed.
         * Event's payload equals to the newly selected page size.
         */
        this.pageSizeChange = new EventEmitter();
        /**
         * An event fired when the sort direction is changed.
         * Event's payload equals to the newly selected sort direction.
         */
        this.sortDirectionChange = new EventEmitter();
        /**
         * An event fired when the pagination is changed.
         * Event's payload equals to the newly selected sort direction.
         */
        this.paginationChange = new EventEmitter();
        /**
         * An event fired when the sort field is changed.
         * Event's payload equals to the newly selected sort field.
         */
        this.sortFieldChange = new EventEmitter();
    }
    Object.defineProperty(ObjectDetailComponent.prototype, "objects", {
        /**
         * Getter for _objects property
         */
        get: function () {
            return this._objects;
        },
        /**
         * Setter for _objects property
         * @param objects
         */
        set: function (objects) {
            this._objects = objects;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Emit pageChange event
     */
    ObjectDetailComponent.prototype.onPageChange = function (event) {
        this.pageChange.emit(event);
    };
    /**
     * Emit pageSizeChange event
     */
    ObjectDetailComponent.prototype.onPageSizeChange = function (event) {
        this.pageSizeChange.emit(event);
    };
    /**
     * Emit sortDirectionChange event
     */
    ObjectDetailComponent.prototype.onSortDirectionChange = function (event) {
        this.sortDirectionChange.emit(event);
    };
    /**
     * Emit sortFieldChange event
     */
    ObjectDetailComponent.prototype.onSortFieldChange = function (event) {
        this.sortFieldChange.emit(event);
    };
    /**
     * Emit paginationChange event
     */
    ObjectDetailComponent.prototype.onPaginationChange = function (event) {
        this.paginationChange.emit(event);
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", PaginationComponentOptions)
    ], ObjectDetailComponent.prototype, "config", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", SortOptions)
    ], ObjectDetailComponent.prototype, "sortConfig", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], ObjectDetailComponent.prototype, "hideGear", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], ObjectDetailComponent.prototype, "hidePagerWhenSinglePage", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", RemoteData),
        tslib_1.__metadata("design:paramtypes", [RemoteData])
    ], ObjectDetailComponent.prototype, "objects", null);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], ObjectDetailComponent.prototype, "change", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], ObjectDetailComponent.prototype, "pageChange", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], ObjectDetailComponent.prototype, "pageSizeChange", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], ObjectDetailComponent.prototype, "sortDirectionChange", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], ObjectDetailComponent.prototype, "paginationChange", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], ObjectDetailComponent.prototype, "sortFieldChange", void 0);
    ObjectDetailComponent = tslib_1.__decorate([
        Component({
            changeDetection: ChangeDetectionStrategy.Default,
            encapsulation: ViewEncapsulation.Emulated,
            selector: 'ds-object-detail',
            styleUrls: ['./object-detail.component.scss'],
            templateUrl: './object-detail.component.html',
            animations: [fadeIn]
        })
    ], ObjectDetailComponent);
    return ObjectDetailComponent;
}());
export { ObjectDetailComponent };
//# sourceMappingURL=object-detail.component.js.map