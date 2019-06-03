import * as tslib_1 from "tslib";
import { Component, Inject } from '@angular/core';
import { ItemDataService } from '../../../core/data/item-data.service';
import { ObjectUpdatesService } from '../../../core/data/object-updates/object-updates.service';
import { ActivatedRoute, Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { first, map, switchMap, take, tap } from 'rxjs/operators';
import { getSucceededRemoteData } from '../../../core/shared/operators';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { GLOBAL_CONFIG } from '../../../../config';
import { TranslateService } from '@ngx-translate/core';
import { RegistryService } from '../../../core/registry/registry.service';
import { MetadatumViewModel } from '../../../core/shared/metadata.models';
import { Metadata } from '../../../core/shared/metadata.utils';
var ItemMetadataComponent = /** @class */ (function () {
    function ItemMetadataComponent(itemService, objectUpdatesService, router, notificationsService, translateService, EnvConfig, route, metadataFieldService) {
        this.itemService = itemService;
        this.objectUpdatesService = objectUpdatesService;
        this.router = router;
        this.notificationsService = notificationsService;
        this.translateService = translateService;
        this.EnvConfig = EnvConfig;
        this.route = route;
        this.metadataFieldService = metadataFieldService;
        /**
         * Prefix for this component's notification translate keys
         */
        this.notificationsPrefix = 'item.edit.metadata.notifications.';
    }
    /**
     * Set up and initialize all fields
     */
    ItemMetadataComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.metadataFields$ = this.findMetadataFields();
        this.route.parent.data.pipe(map(function (data) { return data.item; }))
            .pipe(first(), map(function (data) { return data.payload; })).subscribe(function (item) {
            _this.item = item;
        });
        this.discardTimeOut = this.EnvConfig.item.edit.undoTimeout;
        this.url = this.router.url;
        if (this.url.indexOf('?') > 0) {
            this.url = this.url.substr(0, this.url.indexOf('?'));
        }
        this.hasChanges().pipe(first()).subscribe(function (hasChanges) {
            if (!hasChanges) {
                _this.initializeOriginalFields();
            }
            else {
                _this.checkLastModified();
            }
        });
        this.updates$ = this.objectUpdatesService.getFieldUpdates(this.url, this.item.metadataAsList);
    };
    /**
     * Sends a new add update for a field to the object updates service
     * @param metadata The metadata to add, if no parameter is supplied, create a new Metadatum
     */
    ItemMetadataComponent.prototype.add = function (metadata) {
        if (metadata === void 0) { metadata = new MetadatumViewModel(); }
        this.objectUpdatesService.saveAddFieldUpdate(this.url, metadata);
    };
    /**
     * Request the object updates service to discard all current changes to this item
     * Shows a notification to remind the user that they can undo this
     */
    ItemMetadataComponent.prototype.discard = function () {
        var undoNotification = this.notificationsService.info(this.getNotificationTitle('discarded'), this.getNotificationContent('discarded'), { timeOut: this.discardTimeOut });
        this.objectUpdatesService.discardFieldUpdates(this.url, undoNotification);
    };
    /**
     * Request the object updates service to undo discarding all changes to this item
     */
    ItemMetadataComponent.prototype.reinstate = function () {
        this.objectUpdatesService.reinstateFieldUpdates(this.url);
    };
    /**
     * Sends all initial values of this item to the object updates service
     */
    ItemMetadataComponent.prototype.initializeOriginalFields = function () {
        this.objectUpdatesService.initialize(this.url, this.item.metadataAsList, this.item.lastModified);
    };
    /**
     * Prevent unnecessary rerendering so fields don't lose focus
     */
    ItemMetadataComponent.prototype.trackUpdate = function (index, update) {
        return update && update.field ? update.field.uuid : undefined;
    };
    /**
     * Requests all current metadata for this item and requests the item service to update the item
     * Makes sure the new version of the item is rendered on the page
     */
    ItemMetadataComponent.prototype.submit = function () {
        var _this = this;
        this.isValid().pipe(first()).subscribe(function (isValid) {
            if (isValid) {
                var metadata$ = _this.objectUpdatesService.getUpdatedFields(_this.url, _this.item.metadataAsList);
                metadata$.pipe(first(), switchMap(function (metadata) {
                    var updatedItem = Object.assign(cloneDeep(_this.item), { metadata: Metadata.toMetadataMap(metadata) });
                    return _this.itemService.update(updatedItem);
                }), tap(function () { return _this.itemService.commitUpdates(); }), getSucceededRemoteData()).subscribe(function (rd) {
                    _this.item = rd.payload;
                    _this.initializeOriginalFields();
                    _this.updates$ = _this.objectUpdatesService.getFieldUpdates(_this.url, _this.item.metadataAsList);
                    _this.notificationsService.success(_this.getNotificationTitle('saved'), _this.getNotificationContent('saved'));
                });
            }
            else {
                _this.notificationsService.error(_this.getNotificationTitle('invalid'), _this.getNotificationContent('invalid'));
            }
        });
    };
    /**
     * Checks whether or not there are currently updates for this item
     */
    ItemMetadataComponent.prototype.hasChanges = function () {
        return this.objectUpdatesService.hasUpdates(this.url);
    };
    /**
     * Checks whether or not the item is currently reinstatable
     */
    ItemMetadataComponent.prototype.isReinstatable = function () {
        return this.objectUpdatesService.isReinstatable(this.url);
    };
    /**
     * Checks if the current item is still in sync with the version in the store
     * If it's not, a notification is shown and the changes are removed
     */
    ItemMetadataComponent.prototype.checkLastModified = function () {
        var _this = this;
        var currentVersion = this.item.lastModified;
        this.objectUpdatesService.getLastModified(this.url).pipe(first()).subscribe(function (updateVersion) {
            if (updateVersion.getDate() !== currentVersion.getDate()) {
                _this.notificationsService.warning(_this.getNotificationTitle('outdated'), _this.getNotificationContent('outdated'));
                _this.initializeOriginalFields();
            }
        });
    };
    /**
     * Check if the current page is entirely valid
     */
    ItemMetadataComponent.prototype.isValid = function () {
        return this.objectUpdatesService.isValidPage(this.url);
    };
    /**
     * Get translated notification title
     * @param key
     */
    ItemMetadataComponent.prototype.getNotificationTitle = function (key) {
        return this.translateService.instant(this.notificationsPrefix + key + '.title');
    };
    /**
     * Get translated notification content
     * @param key
     */
    ItemMetadataComponent.prototype.getNotificationContent = function (key) {
        return this.translateService.instant(this.notificationsPrefix + key + '.content');
    };
    /**
     * Method to request all metadata fields and convert them to a list of strings
     */
    ItemMetadataComponent.prototype.findMetadataFields = function () {
        return this.metadataFieldService.getAllMetadataFields().pipe(getSucceededRemoteData(), take(1), map(function (remoteData$) { return remoteData$.payload.page.map(function (field) { return field.toString(); }); }));
    };
    ItemMetadataComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-item-metadata',
            styleUrls: ['./item-metadata.component.scss'],
            templateUrl: './item-metadata.component.html',
        })
        /**
         * Component for displaying an item's metadata edit page
         */
        ,
        tslib_1.__param(5, Inject(GLOBAL_CONFIG)),
        tslib_1.__metadata("design:paramtypes", [ItemDataService,
            ObjectUpdatesService,
            Router,
            NotificationsService,
            TranslateService, Object, ActivatedRoute,
            RegistryService])
    ], ItemMetadataComponent);
    return ItemMetadataComponent;
}());
export { ItemMetadataComponent };
//# sourceMappingURL=item-metadata.component.js.map