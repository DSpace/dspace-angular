import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { RegistryService } from '../../../core/registry/registry.service';
import { combineLatest as observableCombineLatest } from 'rxjs';
import { PaginationComponentOptions } from '../../../shared/pagination/pagination-component-options.model';
import { map, take } from 'rxjs/operators';
import { hasValue } from '../../../shared/empty.util';
import { zip } from 'rxjs/internal/observable/zip';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
var MetadataRegistryComponent = /** @class */ (function () {
    function MetadataRegistryComponent(registryService, notificationsService, router, translateService) {
        this.registryService = registryService;
        this.notificationsService = notificationsService;
        this.router = router;
        this.translateService = translateService;
        /**
         * Pagination config used to display the list of metadata schemas
         */
        this.config = Object.assign(new PaginationComponentOptions(), {
            id: 'registry-metadataschemas-pagination',
            pageSize: 25
        });
        this.updateSchemas();
    }
    /**
     * Event triggered when the user changes page
     * @param event
     */
    MetadataRegistryComponent.prototype.onPageChange = function (event) {
        this.config.currentPage = event;
        this.updateSchemas();
    };
    /**
     * Update the list of schemas by fetching it from the rest api or cache
     */
    MetadataRegistryComponent.prototype.updateSchemas = function () {
        this.metadataSchemas = this.registryService.getMetadataSchemas(this.config);
    };
    /**
     * Force-update the list of schemas by first clearing the cache related to metadata schemas, then performing
     * a new REST call
     */
    MetadataRegistryComponent.prototype.forceUpdateSchemas = function () {
        this.registryService.clearMetadataSchemaRequests().subscribe();
        this.updateSchemas();
    };
    /**
     * Start editing the selected metadata schema
     * @param schema
     */
    MetadataRegistryComponent.prototype.editSchema = function (schema) {
        var _this = this;
        this.getActiveSchema().pipe(take(1)).subscribe(function (activeSchema) {
            if (schema === activeSchema) {
                _this.registryService.cancelEditMetadataSchema();
            }
            else {
                _this.registryService.editMetadataSchema(schema);
            }
        });
    };
    /**
     * Checks whether the given metadata schema is active (being edited)
     * @param schema
     */
    MetadataRegistryComponent.prototype.isActive = function (schema) {
        return this.getActiveSchema().pipe(map(function (activeSchema) { return schema === activeSchema; }));
    };
    /**
     * Gets the active metadata schema (being edited)
     */
    MetadataRegistryComponent.prototype.getActiveSchema = function () {
        return this.registryService.getActiveMetadataSchema();
    };
    /**
     * Select a metadata schema within the list (checkbox)
     * @param schema
     * @param event
     */
    MetadataRegistryComponent.prototype.selectMetadataSchema = function (schema, event) {
        event.target.checked ?
            this.registryService.selectMetadataSchema(schema) :
            this.registryService.deselectMetadataSchema(schema);
    };
    /**
     * Checks whether a given metadata schema is selected in the list (checkbox)
     * @param schema
     */
    MetadataRegistryComponent.prototype.isSelected = function (schema) {
        return this.registryService.getSelectedMetadataSchemas().pipe(map(function (schemas) { return schemas.find(function (selectedSchema) { return selectedSchema === schema; }) != null; }));
    };
    /**
     * Delete all the selected metadata schemas
     */
    MetadataRegistryComponent.prototype.deleteSchemas = function () {
        var _this = this;
        this.registryService.getSelectedMetadataSchemas().pipe(take(1)).subscribe(function (schemas) {
            var tasks$ = [];
            for (var _i = 0, schemas_1 = schemas; _i < schemas_1.length; _i++) {
                var schema = schemas_1[_i];
                if (hasValue(schema.id)) {
                    tasks$.push(_this.registryService.deleteMetadataSchema(schema.id));
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
                _this.registryService.deselectAllMetadataSchema();
                _this.registryService.cancelEditMetadataSchema();
                _this.forceUpdateSchemas();
            });
        });
    };
    /**
     * Show notifications for an amount of deleted metadata schemas
     * @param success   Whether or not the notification should be a success message (error message when false)
     * @param amount    The amount of deleted metadata schemas
     */
    MetadataRegistryComponent.prototype.showNotification = function (success, amount) {
        var _this = this;
        var prefix = 'admin.registries.schema.notification';
        var suffix = success ? 'success' : 'failure';
        var messages = observableCombineLatest(this.translateService.get(success ? prefix + "." + suffix : prefix + "." + suffix), this.translateService.get(prefix + ".deleted." + suffix, { amount: amount }));
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
    MetadataRegistryComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-metadata-registry',
            templateUrl: './metadata-registry.component.html',
            styleUrls: ['./metadata-registry.component.scss']
        })
        /**
         * A component used for managing all existing metadata schemas within the repository.
         * The admin can create, edit or delete metadata schemas here.
         */
        ,
        tslib_1.__metadata("design:paramtypes", [RegistryService,
            NotificationsService,
            Router,
            TranslateService])
    ], MetadataRegistryComponent);
    return MetadataRegistryComponent;
}());
export { MetadataRegistryComponent };
//# sourceMappingURL=metadata-registry.component.js.map