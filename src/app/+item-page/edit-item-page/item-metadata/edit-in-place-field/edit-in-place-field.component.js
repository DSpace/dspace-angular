import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import { hasValue, isNotEmpty } from '../../../../shared/empty.util';
import { RegistryService } from '../../../../core/registry/registry.service';
import { cloneDeep } from 'lodash';
import { BehaviorSubject, of as observableOf } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { FieldChangeType } from '../../../../core/data/object-updates/object-updates.actions';
import { ObjectUpdatesService } from '../../../../core/data/object-updates/object-updates.service';
var EditInPlaceFieldComponent = /** @class */ (function () {
    function EditInPlaceFieldComponent(metadataFieldService, objectUpdatesService) {
        this.metadataFieldService = metadataFieldService;
        this.objectUpdatesService = objectUpdatesService;
        /**
         * The current suggestions for the metadatafield when editing
         */
        this.metadataFieldSuggestions = new BehaviorSubject([]);
    }
    /**
     * Sets up an observable that keeps track of the current editable and valid state of this field
     */
    EditInPlaceFieldComponent.prototype.ngOnInit = function () {
        this.editable = this.objectUpdatesService.isEditable(this.url, this.metadata.uuid);
        this.valid = this.objectUpdatesService.isValid(this.url, this.metadata.uuid);
    };
    /**
     * Sends a new change update for this field to the object updates service
     */
    EditInPlaceFieldComponent.prototype.update = function (ngModel) {
        this.objectUpdatesService.saveChangeFieldUpdate(this.url, this.metadata);
        if (hasValue(ngModel)) {
            this.checkValidity(ngModel);
        }
    };
    /**
     * Method to check the validity of a form control
     * @param ngModel
     */
    EditInPlaceFieldComponent.prototype.checkValidity = function (ngModel) {
        ngModel.control.setValue(ngModel.viewModel);
        ngModel.control.updateValueAndValidity();
        this.objectUpdatesService.setValidFieldUpdate(this.url, this.metadata.uuid, ngModel.control.valid);
    };
    /**
     * Sends a new editable state for this field to the service to change it
     * @param editable The new editable state for this field
     */
    EditInPlaceFieldComponent.prototype.setEditable = function (editable) {
        this.objectUpdatesService.setEditableFieldUpdate(this.url, this.metadata.uuid, editable);
    };
    /**
     * Sends a new remove update for this field to the object updates service
     */
    EditInPlaceFieldComponent.prototype.remove = function () {
        this.objectUpdatesService.saveRemoveFieldUpdate(this.url, this.metadata);
    };
    /**
     * Notifies the object updates service that the updates for the current field can be removed
     */
    EditInPlaceFieldComponent.prototype.removeChangesFromField = function () {
        this.objectUpdatesService.removeSingleFieldUpdate(this.url, this.metadata.uuid);
    };
    /**
     * Sets the current metadatafield based on the fieldUpdate input field
     */
    EditInPlaceFieldComponent.prototype.ngOnChanges = function () {
        this.metadata = cloneDeep(this.fieldUpdate.field);
    };
    /**
     * Requests all metadata fields that contain the query string in their key
     * Then sets all found metadata fields as metadataFieldSuggestions
     * @param query The query to look for
     */
    EditInPlaceFieldComponent.prototype.findMetadataFieldSuggestions = function (query) {
        var _this = this;
        if (isNotEmpty(query)) {
            this.metadataFieldService.queryMetadataFields(query).pipe(
            // getSucceededRemoteData(),
            take(1), map(function (data) { return data.payload.page; })).subscribe(function (fields) { return _this.metadataFieldSuggestions.next(fields.map(function (field) {
                return {
                    displayValue: field.toString().split('.').join('.&#8203;'),
                    value: field.toString()
                };
            })); });
        }
        else {
            this.metadataFieldSuggestions.next([]);
        }
    };
    /**
     * Check if a user should be allowed to edit this field
     * @return an observable that emits true when the user should be able to edit this field and false when they should not
     */
    EditInPlaceFieldComponent.prototype.canSetEditable = function () {
        var _this = this;
        return this.editable.pipe(map(function (editable) {
            if (editable) {
                return false;
            }
            else {
                return _this.fieldUpdate.changeType !== FieldChangeType.REMOVE;
            }
        }));
    };
    /**
     * Check if a user should be allowed to disabled editing this field
     * @return an observable that emits true when the user should be able to disable editing this field and false when they should not
     */
    EditInPlaceFieldComponent.prototype.canSetUneditable = function () {
        return this.editable;
    };
    /**
     * Check if a user should be allowed to remove this field
     * @return an observable that emits true when the user should be able to remove this field and false when they should not
     */
    EditInPlaceFieldComponent.prototype.canRemove = function () {
        return observableOf(this.fieldUpdate.changeType !== FieldChangeType.REMOVE && this.fieldUpdate.changeType !== FieldChangeType.ADD);
    };
    /**
     * Check if a user should be allowed to undo changes to this field
     * @return an observable that emits true when the user should be able to undo changes to this field and false when they should not
     */
    EditInPlaceFieldComponent.prototype.canUndo = function () {
        var _this = this;
        return this.editable.pipe(map(function (editable) { return _this.fieldUpdate.changeType >= 0 || editable; }));
    };
    EditInPlaceFieldComponent.prototype.isNotEmpty = function (value) {
        return isNotEmpty(value);
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], EditInPlaceFieldComponent.prototype, "fieldUpdate", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], EditInPlaceFieldComponent.prototype, "url", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Array)
    ], EditInPlaceFieldComponent.prototype, "metadataFields", void 0);
    EditInPlaceFieldComponent = tslib_1.__decorate([
        Component({
            // tslint:disable-next-line:component-selector
            selector: '[ds-edit-in-place-field]',
            styleUrls: ['./edit-in-place-field.component.scss'],
            templateUrl: './edit-in-place-field.component.html',
        })
        /**
         * Component that displays a single metadatum of an item on the edit page
         */
        ,
        tslib_1.__metadata("design:paramtypes", [RegistryService,
            ObjectUpdatesService])
    ], EditInPlaceFieldComponent);
    return EditInPlaceFieldComponent;
}());
export { EditInPlaceFieldComponent };
//# sourceMappingURL=edit-in-place-field.component.js.map