import * as tslib_1 from "tslib";
import { combineLatest as observableCombineLatest, BehaviorSubject } from 'rxjs';
import { startWith, distinctUntilChanged, map } from 'rxjs/operators';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { SortOptions } from '../../core/cache/models/sort-options.model';
import { RemoteData } from '../../core/data/remote-data';
import { fadeIn } from '../animations/fade';
import { hasNoValue, hasValue } from '../empty.util';
import { HostWindowService, WidthCategory } from '../host-window.service';
import { PaginationComponentOptions } from '../pagination/pagination-component-options.model';
var ObjectGridComponent = /** @class */ (function () {
    function ObjectGridComponent(hostWindow) {
        this.hostWindow = hostWindow;
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
        this._objects$ = new BehaviorSubject(undefined);
    }
    Object.defineProperty(ObjectGridComponent.prototype, "objects", {
        get: function () {
            return this._objects$.getValue();
        },
        set: function (objects) {
            this._objects$.next(objects);
        },
        enumerable: true,
        configurable: true
    });
    ObjectGridComponent.prototype.ngOnInit = function () {
        var nbColumns$ = this.hostWindow.widthCategory.pipe(map(function (widthCat) {
            switch (widthCat) {
                case WidthCategory.XL:
                case WidthCategory.LG: {
                    return 3;
                }
                case WidthCategory.MD:
                case WidthCategory.SM: {
                    return 2;
                }
                default: {
                    return 1;
                }
            }
        }), distinctUntilChanged()).pipe(startWith(3));
        this.columns$ = observableCombineLatest(nbColumns$, this._objects$).pipe(map(function (_a) {
            var nbColumns = _a[0], objects = _a[1];
            if (hasValue(objects) && hasValue(objects.payload) && hasValue(objects.payload.page)) {
                var page = objects.payload.page;
                var result_1 = [];
                page.forEach(function (obj, i) {
                    var colNb = i % nbColumns;
                    var col = result_1[colNb];
                    if (hasNoValue(col)) {
                        col = [];
                    }
                    result_1[colNb] = col.concat([obj]);
                });
                return result_1;
            }
            else {
                return [];
            }
        }));
    };
    ObjectGridComponent.prototype.onPageChange = function (event) {
        this.pageChange.emit(event);
    };
    ObjectGridComponent.prototype.onPageSizeChange = function (event) {
        this.pageSizeChange.emit(event);
    };
    ObjectGridComponent.prototype.onSortDirectionChange = function (event) {
        this.sortDirectionChange.emit(event);
    };
    ObjectGridComponent.prototype.onSortFieldChange = function (event) {
        this.sortFieldChange.emit(event);
    };
    ObjectGridComponent.prototype.onPaginationChange = function (event) {
        this.paginationChange.emit(event);
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", PaginationComponentOptions)
    ], ObjectGridComponent.prototype, "config", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", SortOptions)
    ], ObjectGridComponent.prototype, "sortConfig", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], ObjectGridComponent.prototype, "hideGear", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], ObjectGridComponent.prototype, "hidePagerWhenSinglePage", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", RemoteData),
        tslib_1.__metadata("design:paramtypes", [RemoteData])
    ], ObjectGridComponent.prototype, "objects", null);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], ObjectGridComponent.prototype, "change", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], ObjectGridComponent.prototype, "pageChange", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], ObjectGridComponent.prototype, "pageSizeChange", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], ObjectGridComponent.prototype, "sortDirectionChange", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], ObjectGridComponent.prototype, "paginationChange", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], ObjectGridComponent.prototype, "sortFieldChange", void 0);
    ObjectGridComponent = tslib_1.__decorate([
        Component({
            changeDetection: ChangeDetectionStrategy.Default,
            encapsulation: ViewEncapsulation.Emulated,
            selector: 'ds-object-grid',
            styleUrls: ['./object-grid.component.scss'],
            templateUrl: './object-grid.component.html',
            animations: [fadeIn]
        }),
        tslib_1.__metadata("design:paramtypes", [HostWindowService])
    ], ObjectGridComponent);
    return ObjectGridComponent;
}());
export { ObjectGridComponent };
//# sourceMappingURL=object-grid.component.js.map