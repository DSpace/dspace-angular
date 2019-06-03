import * as tslib_1 from "tslib";
import { Component, Injector, Input } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MyDSpaceActionsComponent } from '../mydspace-actions';
import { Item } from '../../../core/shared/item.model';
import { ResourceType } from '../../../core/shared/resource-type';
import { NotificationsService } from '../../notifications/notifications.service';
/**
 * This component represents mydspace actions related to Item object.
 */
var ItemActionsComponent = /** @class */ (function (_super) {
    tslib_1.__extends(ItemActionsComponent, _super);
    /**
     * Initialize instance variables
     *
     * @param {Injector} injector
     * @param {Router} router
     * @param {NotificationsService} notificationsService
     * @param {TranslateService} translate
     */
    function ItemActionsComponent(injector, router, notificationsService, translate) {
        var _this = _super.call(this, ResourceType.Item, injector, router, notificationsService, translate) || this;
        _this.injector = injector;
        _this.router = router;
        _this.notificationsService = notificationsService;
        _this.translate = translate;
        return _this;
    }
    /**
     * Init the target object
     *
     * @param {Item} object
     */
    ItemActionsComponent.prototype.initObjects = function (object) {
        this.object = object;
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Item)
    ], ItemActionsComponent.prototype, "object", void 0);
    ItemActionsComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-item-actions',
            styleUrls: ['./item-actions.component.scss'],
            templateUrl: './item-actions.component.html',
        }),
        tslib_1.__metadata("design:paramtypes", [Injector,
            Router,
            NotificationsService,
            TranslateService])
    ], ItemActionsComponent);
    return ItemActionsComponent;
}(MyDSpaceActionsComponent));
export { ItemActionsComponent };
//# sourceMappingURL=item-actions.component.js.map