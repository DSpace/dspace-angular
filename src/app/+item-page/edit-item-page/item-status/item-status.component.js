import * as tslib_1 from "tslib";
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { fadeIn, fadeInOut } from '../../../shared/animations/fade';
import { ActivatedRoute } from '@angular/router';
import { ItemOperation } from '../item-operation/itemOperation.model';
import { first, map } from 'rxjs/operators';
import { getItemEditPath, getItemPageRoute } from '../../item-page-routing.module';
var ItemStatusComponent = /** @class */ (function () {
    function ItemStatusComponent(route) {
        this.route = route;
    }
    ItemStatusComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.itemRD$ = this.route.parent.data.pipe(map(function (data) { return data.item; }));
        this.itemRD$.pipe(first(), map(function (data) { return data.payload; })).subscribe(function (item) {
            _this.statusData = Object.assign({
                id: item.id,
                handle: item.handle,
                lastModified: item.lastModified
            });
            _this.statusDataKeys = Object.keys(_this.statusData);
            /*
              The key is used to build messages
                i18n example: 'item.edit.tabs.status.buttons.<key>.label'
              The value is supposed to be a href for the button
            */
            _this.operations = [];
            if (item.isWithdrawn) {
                _this.operations.push(new ItemOperation('reinstate', _this.getCurrentUrl(item) + '/reinstate'));
            }
            else {
                _this.operations.push(new ItemOperation('withdraw', _this.getCurrentUrl(item) + '/withdraw'));
            }
            if (item.isDiscoverable) {
                _this.operations.push(new ItemOperation('private', _this.getCurrentUrl(item) + '/private'));
            }
            else {
                _this.operations.push(new ItemOperation('public', _this.getCurrentUrl(item) + '/public'));
            }
            _this.operations.push(new ItemOperation('delete', _this.getCurrentUrl(item) + '/delete'));
        });
    };
    /**
     * Get the url to the simple item page
     * @returns {string}  url
     */
    ItemStatusComponent.prototype.getItemPage = function (item) {
        return getItemPageRoute(item.id);
    };
    /**
     * Get the current url without query params
     * @returns {string}  url
     */
    ItemStatusComponent.prototype.getCurrentUrl = function (item) {
        return getItemEditPath(item.id);
    };
    ItemStatusComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-item-status',
            templateUrl: './item-status.component.html',
            changeDetection: ChangeDetectionStrategy.OnPush,
            animations: [
                fadeIn,
                fadeInOut
            ]
        })
        /**
         * Component for displaying an item's status
         */
        ,
        tslib_1.__metadata("design:paramtypes", [ActivatedRoute])
    ], ItemStatusComponent);
    return ItemStatusComponent;
}());
export { ItemStatusComponent };
//# sourceMappingURL=item-status.component.js.map