import * as tslib_1 from "tslib";
import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { RemoteData } from '../../core/data/remote-data';
import { PaginationComponentOptions } from '../pagination/pagination-component-options.model';
import { SortOptions } from '../../core/cache/models/sort-options.model';
import { SetViewMode } from '../view-mode';
import { hasValue, isNotEmpty } from '../empty.util';
var ObjectCollectionComponent = /** @class */ (function () {
    /**
     * @param cdRef
     *    ChangeDetectorRef service provided by Angular.
     * @param route
     *    Route is a singleton service provided by Angular.
     * @param router
     *    Router is a singleton service provided by Angular.
     */
    function ObjectCollectionComponent(cdRef, route, router) {
        this.cdRef = cdRef;
        this.route = route;
        this.router = router;
        this.hasBorder = false;
        this.hideGear = false;
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
        this.currentMode = SetViewMode.List;
        this.viewModeEnum = SetViewMode;
    }
    ObjectCollectionComponent.prototype.ngOnChanges = function (changes) {
        if (changes.objects && !changes.objects.isFirstChange()) {
            // this.pageInfo = this.objects.pageInfo;
        }
    };
    ObjectCollectionComponent.prototype.ngOnInit = function () {
        // this.pageInfo = this.objects.pageInfo;
        var _this = this;
        this.sub = this.route
            .queryParams
            .subscribe(function (params) {
            if (isNotEmpty(params.view)) {
                _this.currentMode = params.view;
            }
        });
    };
    ObjectCollectionComponent.prototype.getViewMode = function () {
        var _this = this;
        this.route.queryParams.pipe(map(function (params) {
            if (isNotEmpty(params.view) && hasValue(params.view)) {
                _this.currentMode = params.view;
            }
        }));
        return this.currentMode;
    };
    ObjectCollectionComponent.prototype.onPageChange = function (event) {
        this.pageChange.emit(event);
    };
    ObjectCollectionComponent.prototype.onPageSizeChange = function (event) {
        this.pageSizeChange.emit(event);
    };
    ObjectCollectionComponent.prototype.onSortDirectionChange = function (event) {
        this.sortDirectionChange.emit(event);
    };
    ObjectCollectionComponent.prototype.onSortFieldChange = function (event) {
        this.sortFieldChange.emit(event);
    };
    ObjectCollectionComponent.prototype.onPaginationChange = function (event) {
        this.paginationChange.emit(event);
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", RemoteData)
    ], ObjectCollectionComponent.prototype, "objects", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", PaginationComponentOptions)
    ], ObjectCollectionComponent.prototype, "config", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", SortOptions)
    ], ObjectCollectionComponent.prototype, "sortConfig", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], ObjectCollectionComponent.prototype, "hasBorder", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], ObjectCollectionComponent.prototype, "hideGear", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], ObjectCollectionComponent.prototype, "pageChange", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], ObjectCollectionComponent.prototype, "pageSizeChange", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], ObjectCollectionComponent.prototype, "sortDirectionChange", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], ObjectCollectionComponent.prototype, "paginationChange", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], ObjectCollectionComponent.prototype, "sortFieldChange", void 0);
    ObjectCollectionComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-viewable-collection',
            styleUrls: ['./object-collection.component.scss'],
            templateUrl: './object-collection.component.html',
        }),
        tslib_1.__metadata("design:paramtypes", [ChangeDetectorRef,
            ActivatedRoute,
            Router])
    ], ObjectCollectionComponent);
    return ObjectCollectionComponent;
}());
export { ObjectCollectionComponent };
//# sourceMappingURL=object-collection.component.js.map