import * as tslib_1 from "tslib";
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MetadataSchema } from '../../../../core/metadata/metadataschema.model';
import { DynamicInputModel } from '@ng-dynamic-forms/core';
import { RegistryService } from '../../../../core/registry/registry.service';
import { FormBuilderService } from '../../../../shared/form/builder/form-builder.service';
import { MetadataField } from '../../../../core/metadata/metadatafield.model';
import { take } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';
var MetadataFieldFormComponent = /** @class */ (function () {
    function MetadataFieldFormComponent(registryService, formBuilderService, translateService) {
        this.registryService = registryService;
        this.formBuilderService = formBuilderService;
        this.translateService = translateService;
        /**
         * A unique id used for ds-form
         */
        this.formId = 'metadata-field-form';
        /**
         * The prefix for all messages related to this form
         */
        this.messagePrefix = 'admin.registries.schema.form';
        /**
         * Layout used for structuring the form inputs
         */
        this.formLayout = {
            element: {
                grid: {
                    host: 'col col-sm-6 d-inline-block'
                }
            },
            qualifier: {
                grid: {
                    host: 'col col-sm-6 d-inline-block'
                }
            },
            scopeNote: {
                grid: {
                    host: 'col col-sm-12 d-inline-block'
                }
            }
        };
        /**
         * An EventEmitter that's fired whenever the form is being submitted
         */
        this.submitForm = new EventEmitter();
    }
    /**
     * Initialize the component, setting up the necessary Models for the dynamic form
     */
    MetadataFieldFormComponent.prototype.ngOnInit = function () {
        var _this = this;
        combineLatest(this.translateService.get(this.messagePrefix + ".element"), this.translateService.get(this.messagePrefix + ".qualifier"), this.translateService.get(this.messagePrefix + ".scopenote")).subscribe(function (_a) {
            var element = _a[0], qualifier = _a[1], scopenote = _a[2];
            _this.element = new DynamicInputModel({
                id: 'element',
                label: element,
                name: 'element',
                validators: {
                    required: null,
                },
                required: true,
            });
            _this.qualifier = new DynamicInputModel({
                id: 'qualifier',
                label: qualifier,
                name: 'qualifier',
                required: false,
            });
            _this.scopeNote = new DynamicInputModel({
                id: 'scopeNote',
                label: scopenote,
                name: 'scopeNote',
                required: false,
            });
            _this.formModel = [
                _this.element,
                _this.qualifier,
                _this.scopeNote
            ];
            _this.formGroup = _this.formBuilderService.createFormGroup(_this.formModel);
            _this.registryService.getActiveMetadataField().subscribe(function (field) {
                _this.formGroup.patchValue({
                    element: field != null ? field.element : '',
                    qualifier: field != null ? field.qualifier : '',
                    scopeNote: field != null ? field.scopeNote : ''
                });
            });
        });
    };
    /**
     * Stop editing the currently selected metadata field
     */
    MetadataFieldFormComponent.prototype.onCancel = function () {
        this.registryService.cancelEditMetadataField();
    };
    /**
     * Submit the form
     * When the field has an id attached -> Edit the field
     * When the field has no id attached -> Create new field
     * Emit the updated/created field using the EventEmitter submitForm
     */
    MetadataFieldFormComponent.prototype.onSubmit = function () {
        var _this = this;
        this.registryService.getActiveMetadataField().pipe(take(1)).subscribe(function (field) {
            var values = {
                schema: _this.metadataSchema,
                element: _this.element.value,
                qualifier: _this.qualifier.value,
                scopeNote: _this.scopeNote.value
            };
            if (field == null) {
                _this.registryService.createOrUpdateMetadataField(Object.assign(new MetadataField(), values)).subscribe(function (newField) {
                    _this.submitForm.emit(newField);
                });
            }
            else {
                _this.registryService.createOrUpdateMetadataField(Object.assign(new MetadataField(), {
                    id: field.id,
                    schema: _this.metadataSchema,
                    element: (values.element ? values.element : field.element),
                    qualifier: (values.qualifier ? values.qualifier : field.qualifier),
                    scopeNote: (values.scopeNote ? values.scopeNote : field.scopeNote)
                })).subscribe(function (updatedField) {
                    _this.submitForm.emit(updatedField);
                });
            }
            _this.clearFields();
        });
    };
    /**
     * Reset all input-fields to be empty
     */
    MetadataFieldFormComponent.prototype.clearFields = function () {
        this.formGroup.patchValue({
            element: '',
            qualifier: '',
            scopeNote: ''
        });
    };
    /**
     * Cancel the current edit when component is destroyed
     */
    MetadataFieldFormComponent.prototype.ngOnDestroy = function () {
        this.onCancel();
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", MetadataSchema)
    ], MetadataFieldFormComponent.prototype, "metadataSchema", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], MetadataFieldFormComponent.prototype, "submitForm", void 0);
    MetadataFieldFormComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-metadata-field-form',
            templateUrl: './metadata-field-form.component.html'
        })
        /**
         * A form used for creating and editing metadata fields
         */
        ,
        tslib_1.__metadata("design:paramtypes", [RegistryService,
            FormBuilderService,
            TranslateService])
    ], MetadataFieldFormComponent);
    return MetadataFieldFormComponent;
}());
export { MetadataFieldFormComponent };
//# sourceMappingURL=metadata-field-form.component.js.map