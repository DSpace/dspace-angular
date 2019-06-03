import * as tslib_1 from "tslib";
import { fadeIn, fadeInOut } from '../../shared/animations/fade';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { isNotEmpty } from '../../shared/empty.util';
import { getItemPageRoute } from '../item-page-routing.module';
var EditItemPageComponent = /** @class */ (function () {
    function EditItemPageComponent(route, router) {
        var _this = this;
        this.route = route;
        this.router = router;
        this.router.events.subscribe(function () {
            _this.currentPage = _this.route.snapshot.firstChild.routeConfig.path;
        });
    }
    EditItemPageComponent.prototype.ngOnInit = function () {
        this.pages = this.route.routeConfig.children
            .map(function (child) { return child.path; })
            .filter(function (path) { return isNotEmpty(path); }); // ignore reroutes
        this.itemRD$ = this.route.data.pipe(map(function (data) { return data.item; }));
    };
    /**
     * Get the item page url
     * @param item The item for which the url is requested
     */
    EditItemPageComponent.prototype.getItemPage = function (item) {
        return getItemPageRoute(item.id);
    };
    EditItemPageComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-edit-item-page',
            templateUrl: './edit-item-page.component.html',
            changeDetection: ChangeDetectionStrategy.OnPush,
            animations: [
                fadeIn,
                fadeInOut
            ]
        })
        /**
         * Page component for editing an item
         */
        ,
        tslib_1.__metadata("design:paramtypes", [ActivatedRoute, Router])
    ], EditItemPageComponent);
    return EditItemPageComponent;
}());
export { EditItemPageComponent };
//# sourceMappingURL=edit-item-page.component.js.map