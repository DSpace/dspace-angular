import * as tslib_1 from "tslib";
import { Component, EventEmitter, Output } from '@angular/core';
import { DynamicInputModel } from '@ng-dynamic-forms/core';
import { RegistryService } from '../../../../core/registry/registry.service';
import { FormBuilderService } from '../../../../shared/form/builder/form-builder.service';
import { take } from 'rxjs/operators';
import { MetadataSchema } from '../../../../core/metadata/metadataschema.model';
import { TranslateService } from '@ngx-translate/core';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';
var MetadataSchemaFormComponent = /** @class */ (function () {
    function MetadataSchemaFormComponent(registryService, formBuilderService, translateService) {
        this.registryService = registryService;
        this.formBuilderService = formBuilderService;
        this.translateService = translateService;
        /**
         * A unique id used for ds-form
         */
        this.formId = 'metadata-schema-form';
        /**
         * The prefix for all messages related to this form
         */
        this.messagePrefix = 'admin.registries.metadata.form';
        /**
         * Layout used for structuring the form inputs
         */
        this.formLayout = {
            name: {
                grid: {
                    host: 'col col-sm-6 d-inline-block'
                }
            },
            namespace: {
                grid: {
                    host: 'col col-sm-6 d-inline-block'
                }
            }
        };
        /**
         * An EventEmitter that's fired whenever the form is being submitted
         */
        this.submitForm = new EventEmitter();
    }
    MetadataSchemaFormComponent.prototype.ngOnInit = function () {
        var _this = this;
        combineLatest(this.translateService.get(this.messagePrefix + ".name"), this.translateService.get(this.messagePrefix + ".namespace")).subscribe(function (_a) {
            var name = _a[0], namespace = _a[1];
            _this.name = new DynamicInputModel({
                id: 'name',
                label: name,
                name: 'name',
                validators: {
                    required: null,
                    pattern: '^[^ ,_]{1,32}$'
                },
                required: true,
            });
            _this.namespace = new DynamicInputModel({
                id: 'namespace',
                label: namespace,
                name: 'namespace',
                validators: {
                    required: null,
                },
                required: true,
            });
            _this.formModel = [
                _this.namespace,
                _this.name
            ];
            _this.formGroup = _this.formBuilderService.createFormGroup(_this.formModel);
            _this.registryService.getActiveMetadataSchema().subscribe(function (schema) {
                _this.formGroup.patchValue({
                    name: schema != null ? schema.prefix : '',
                    namespace: schema != null ? schema.namespace : ''
                });
            });
        });
    };
    /**
     * Stop editing the currently selected metadata schema
     */
    MetadataSchemaFormComponent.prototype.onCancel = function () {
        this.registryService.cancelEditMetadataSchema();
    };
    /**
     * Submit the form
     * When the schema has an id attached -> Edit the schema
     * When the schema has no id attached -> Create new schema
     * Emit the updated/created schema using the EventEmitter submitForm
     */
    MetadataSchemaFormComponent.prototype.onSubmit = function () {
        var _this = this;
        this.registryService.getActiveMetadataSchema().pipe(take(1)).subscribe(function (schema) {
            var values = {
                prefix: _this.name.value,
                namespace: _this.namespace.value
            };
            if (schema == null) {
                _this.registryService.createOrUpdateMetadataSchema(Object.assign(new MetadataSchema(), values)).subscribe(function (newSchema) {
                    _this.submitForm.emit(newSchema);
                });
            }
            else {
                _this.registryService.createOrUpdateMetadataSchema(Object.assign(new MetadataSchema(), {
                    id: schema.id,
                    prefix: (values.prefix ? values.prefix : schema.prefix),
                    namespace: (values.namespace ? values.namespace : schema.namespace)
                })).subscribe(function (updatedSchema) {
                    _this.submitForm.emit(updatedSchema);
                });
            }
            _this.clearFields();
        });
    };
    /**
     * Reset all input-fields to be empty
     */
    MetadataSchemaFormComponent.prototype.clearFields = function () {
        this.formGroup.patchValue({
            prefix: '',
            namespace: ''
        });
    };
    /**
     * Cancel the current edit when component is destroyed
     */
    MetadataSchemaFormComponent.prototype.ngOnDestroy = function () {
        this.onCancel();
    };
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], MetadataSchemaFormComponent.prototype, "submitForm", void 0);
    MetadataSchemaFormComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-metadata-schema-form',
            templateUrl: './metadata-schema-form.component.html'
        })
        /**
         * A form used for creating and editing metadata schemas
         */
        ,
        tslib_1.__metadata("design:paramtypes", [RegistryService, FormBuilderService, TranslateService])
    ], MetadataSchemaFormComponent);
    return MetadataSchemaFormComponent;
}());
export { MetadataSchemaFormComponent };
//# sourceMappingURL=metadata-schema-form.component.js.map