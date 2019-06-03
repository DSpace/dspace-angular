import * as tslib_1 from "tslib";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { SortOptions } from '../../core/cache/models/sort-options.model';
import { RemoteData } from '../../core/data/remote-data';
import { fadeIn } from '../animations/fade';
import { PaginationComponentOptions } from '../pagination/pagination-component-options.model';
var ObjectListComponent = /** @class */ (function () {
    function ObjectListComponent() {
        this.hasBorder = false;
        this.hideGear = false;
        this.hidePagerWhenSinglePage = true;
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
        this.paginationChange = new EventEmitter();
        /**
         * An event fired when the sort field is changed.
         * Event's payload equals to the newly selected sort field.
         */
        this.sortFieldChange = new EventEmitter();
        this.data = {};
    }
    Object.defineProperty(ObjectListComponent.prototype, "objects", {
        get: function () {
            return this._objects;
        },
        set: function (objects) {
            this._objects = objects;
        },
        enumerable: true,
        configurable: true
    });
    ObjectListComponent.prototype.onPageChange = function (event) {
        this.pageChange.emit(event);
    };
    ObjectListComponent.prototype.onPageSizeChange = function (event) {
        this.pageSizeChange.emit(event);
    };
    ObjectListComponent.prototype.onSortDirectionChange = function (event) {
        this.sortDirectionChange.emit(event);
    };
    ObjectListComponent.prototype.onSortFieldChange = function (event) {
        this.sortFieldChange.emit(event);
    };
    ObjectListComponent.prototype.onPaginationChange = function (event) {
        this.paginationChange.emit(event);
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", PaginationComponentOptions)
    ], ObjectListComponent.prototype, "config", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", SortOptions)
    ], ObjectListComponent.prototype, "sortConfig", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], ObjectListComponent.prototype, "hasBorder", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], ObjectListComponent.prototype, "hideGear", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], ObjectListComponent.prototype, "hidePagerWhenSinglePage", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", RemoteData),
        tslib_1.__metadata("design:paramtypes", [RemoteData])
    ], ObjectListComponent.prototype, "objects", null);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], ObjectListComponent.prototype, "change", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], ObjectListComponent.prototype, "pageChange", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], ObjectListComponent.prototype, "pageSizeChange", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], ObjectListComponent.prototype, "sortDirectionChange", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], ObjectListComponent.prototype, "paginationChange", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], ObjectListComponent.prototype, "sortFieldChange", void 0);
    ObjectListComponent = tslib_1.__decorate([
        Component({
            changeDetection: ChangeDetectionStrategy.Default,
            encapsulation: ViewEncapsulation.Emulated,
            selector: 'ds-object-list',
            styleUrls: ['./object-list.component.scss'],
            templateUrl: './object-list.component.html',
            animations: [fadeIn]
        })
    ], ObjectListComponent);
    return ObjectListComponent;
}());
export { ObjectListComponent };
//# sourceMappingURL=object-list.component.js.map