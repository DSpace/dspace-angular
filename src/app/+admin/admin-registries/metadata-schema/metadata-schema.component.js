import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { RegistryService } from '../../../core/registry/registry.service';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest as observableCombineLatest } from 'rxjs';
import { PaginationComponentOptions } from '../../../shared/pagination/pagination-component-options.model';
import { map, take } from 'rxjs/operators';
import { hasValue } from '../../../shared/empty.util';
import { zip } from 'rxjs/internal/observable/zip';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
var MetadataSchemaComponent = /** @class */ (function () {
    function MetadataSchemaComponent(registryService, route, notificationsService, router, translateService) {
        this.registryService = registryService;
        this.route = route;
        this.notificationsService = notificationsService;
        this.router = router;
        this.translateService = translateService;
        /**
         * Pagination config used to display the list of metadata fields
         */
        this.config = Object.assign(new PaginationComponentOptions(), {
            id: 'registry-metadatafields-pagination',
            pageSize: 25,
            pageSizeOptions: [25, 50, 100, 200]
        });
    }
    MetadataSchemaComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.params.subscribe(function (params) {
            _this.initialize(params);
        });
    };
    /**
     * Initialize the component using the params within the url (schemaName)
     * @param params
     */
    MetadataSchemaComponent.prototype.initialize = function (params) {
        this.metadataSchema = this.registryService.getMetadataSchemaByName(params.schemaName);
        this.updateFields();
    };
    /**
     * Event triggered when the user changes page
     * @param event
     */
    MetadataSchemaComponent.prototype.onPageChange = function (event) {
        this.config.currentPage = event;
        this.updateFields();
    };
    /**
     * Update the list of fields by fetching it from the rest api or cache
     */
    MetadataSchemaComponent.prototype.updateFields = function () {
        var _this = this;
        this.metadataSchema.subscribe(function (schemaData) {
            var schema = schemaData.payload;
            _this.metadataFields = _this.registryService.getMetadataFieldsBySchema(schema, _this.config);
            _this.namespace = { namespace: schemaData.payload.namespace };
        });
    };
    /**
     * Force-update the list of fields by first clearing the cache related to metadata fields, then performing
     * a new REST call
     */
    MetadataSchemaComponent.prototype.forceUpdateFields = function () {
        this.registryService.clearMetadataFieldRequests().subscribe();
        this.updateFields();
    };
    /**
     * Start editing the selected metadata field
     * @param field
     */
    MetadataSchemaComponent.prototype.editField = function (field) {
        var _this = this;
        this.getActiveField().pipe(take(1)).subscribe(function (activeField) {
            if (field === activeField) {
                _this.registryService.cancelEditMetadataField();
            }
            else {
                _this.registryService.editMetadataField(field);
            }
        });
    };
    /**
     * Checks whether the given metadata field is active (being edited)
     * @param field
     */
    MetadataSchemaComponent.prototype.isActive = function (field) {
        return this.getActiveField().pipe(map(function (activeField) { return field === activeField; }));
    };
    /**
     * Gets the active metadata field (being edited)
     */
    MetadataSchemaComponent.prototype.getActiveField = function () {
        return this.registryService.getActiveMetadataField();
    };
    /**
     * Select a metadata field within the list (checkbox)
     * @param field
     * @param event
     */
    MetadataSchemaComponent.prototype.selectMetadataField = function (field, event) {
        event.target.checked ?
            this.registryService.selectMetadataField(field) :
            this.registryService.deselectMetadataField(field);
    };
    /**
     * Checks whether a given metadata field is selected in the list (checkbox)
     * @param field
     */
    MetadataSchemaComponent.prototype.isSelected = function (field) {
        return this.registryService.getSelectedMetadataFields().pipe(map(function (fields) { return fields.find(function (selectedField) { return selectedField === field; }) != null; }));
    };
    /**
     * Delete all the selected metadata fields
     */
    MetadataSchemaComponent.prototype.deleteFields = function () {
        var _this = this;
        this.registryService.getSelectedMetadataFields().pipe(take(1)).subscribe(function (fields) {
            var tasks$ = [];
            for (var _i = 0, fields_1 = fields; _i < fields_1.length; _i++) {
                var field = fields_1[_i];
                if (hasValue(field.id)) {
                    tasks$.push(_this.registryService.deleteMetadataField(field.id));
                }
            }
            zip.apply(void 0, tasks$).subscribe(function (responses) {
                var successResponses = responses.filter(function (response) { return response.isSuccessful; });
                var failedResponses = responses.filter(function (response) { return !response.isSuccessful; });
                if (successResponses.length > 0) {
                    _this.showNotification(true, successResponses.length);
                }
                if (failedResponses.length > 0) {
                    _this.showNotification(false, failedResponses.length);
                }
                _this.registryService.deselectAllMetadataField();
                _this.registryService.cancelEditMetadataField();
                _this.forceUpdateFields();
            });
        });
    };
    /**
     * Show notifications for an amount of deleted metadata fields
     * @param success   Whether or not the notification should be a success message (error message when false)
     * @param amount    The amount of deleted metadata fields
     */
    MetadataSchemaComponent.prototype.showNotification = function (success, amount) {
        var _this = this;
        var prefix = 'admin.registries.schema.notification';
        var suffix = success ? 'success' : 'failure';
        var messages = observableCombineLatest(this.translateService.get(success ? prefix + "." + suffix : prefix + "." + suffix), this.translateService.get(prefix + ".field.deleted." + suffix, { amount: amount }));
        messages.subscribe(function (_a) {
            var head = _a[0], content = _a[1];
            if (success) {
                _this.notificationsService.success(head, content);
            }
            else {
                _this.notificationsService.error(head, content);
            }
        });
    };
    MetadataSchemaComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-metadata-schema',
            templateUrl: './metadata-schema.component.html',
            styleUrls: ['./metadata-schema.component.scss']
        })
        /**
         * A component used for managing all existing metadata fields within the current metadata schema.
         * The admin can create, edit or delete metadata fields here.
         */
        ,
        tslib_1.__metadata("design:paramtypes", [RegistryService,
            ActivatedRoute,
            NotificationsService,
            Router,
            TranslateService])
    ], MetadataSchemaComponent);
    return MetadataSchemaComponent;
}());
export { MetadataSchemaComponent };
//# sourceMappingURL=metadata-schema.component.js.map