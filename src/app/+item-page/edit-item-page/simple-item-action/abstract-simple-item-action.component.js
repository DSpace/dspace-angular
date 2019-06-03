import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { ItemDataService } from '../../../core/data/item-data.service';
import { TranslateService } from '@ngx-translate/core';
import { getSucceededRemoteData } from '../../../core/shared/operators';
import { first, map } from 'rxjs/operators';
import { findSuccessfulAccordingTo } from '../edit-item-operators';
import { getItemEditPath } from '../../item-page-routing.module';
/**
 * Component to render and handle simple item edit actions such as withdrawal and reinstatement.
 * This component is not meant to be used itself but to be extended.
 */
var AbstractSimpleItemActionComponent = /** @class */ (function () {
    function AbstractSimpleItemActionComponent(route, router, notificationsService, itemDataService, translateService) {
        this.route = route;
        this.router = router;
        this.notificationsService = notificationsService;
        this.itemDataService = itemDataService;
        this.translateService = translateService;
    }
    AbstractSimpleItemActionComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.itemRD$ = this.route.data.pipe(map(function (data) { return data.item; }), getSucceededRemoteData());
        this.itemRD$.pipe(first()).subscribe(function (rd) {
            _this.item = rd.payload;
        });
        this.confirmMessage = 'item.edit.' + this.messageKey + '.confirm';
        this.cancelMessage = 'item.edit.' + this.messageKey + '.cancel';
        this.headerMessage = 'item.edit.' + this.messageKey + '.header';
        this.descriptionMessage = 'item.edit.' + this.messageKey + '.description';
    };
    /**
     * Perform the operation linked to this action
     */
    AbstractSimpleItemActionComponent.prototype.performAction = function () {
        // Overwrite in subclasses
    };
    ;
    /**
     * Process the response obtained during the performAction method and navigate back to the edit page
     * @param response from the action in the performAction method
     */
    AbstractSimpleItemActionComponent.prototype.processRestResponse = function (response) {
        var _this = this;
        if (response.isSuccessful) {
            this.itemDataService.findById(this.item.id).pipe(findSuccessfulAccordingTo(this.predicate)).subscribe(function () {
                _this.notificationsService.success(_this.translateService.get('item.edit.' + _this.messageKey + '.success'));
                _this.router.navigate([getItemEditPath(_this.item.id)]);
            });
        }
        else {
            this.notificationsService.error(this.translateService.get('item.edit.' + this.messageKey + '.error'));
            this.router.navigate([getItemEditPath(this.item.id)]);
        }
    };
    AbstractSimpleItemActionComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-simple-action',
            templateUrl: './abstract-simple-item-action.component.html'
        }),
        tslib_1.__metadata("design:paramtypes", [ActivatedRoute,
            Router,
            NotificationsService,
            ItemDataService,
            TranslateService])
    ], AbstractSimpleItemActionComponent);
    return AbstractSimpleItemActionComponent;
}());
export { AbstractSimpleItemActionComponent };
//# sourceMappingURL=abstract-simple-item-action.component.js.map