import * as tslib_1 from "tslib";
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { findIndex } from 'lodash';
import { FormBuilderService } from './builder/form-builder.service';
import { hasValue, isNotEmpty, isNotNull, isNull } from '../empty.util';
import { FormService } from './form.service';
/**
 * The default form component.
 */
var FormComponent = /** @class */ (function () {
    function FormComponent(formService, changeDetectorRef, formBuilderService) {
        this.formService = formService;
        this.changeDetectorRef = changeDetectorRef;
        this.formBuilderService = formBuilderService;
        this.formErrors = [];
        /**
         * A boolean that indicate if to display form's submit and cancel buttons
         */
        this.displaySubmit = true;
        /**
         * A boolean that indicate if to emit a form change event
         */
        this.emitChange = true;
        this.formLayout = null;
        /* tslint:disable:no-output-rename */
        this.blur = new EventEmitter();
        this.change = new EventEmitter();
        this.focus = new EventEmitter();
        /* tslint:enable:no-output-rename */
        this.addArrayItem = new EventEmitter();
        this.removeArrayItem = new EventEmitter();
        /**
         * An event fired when form is valid and submitted .
         * Event's payload equals to the form content.
         */
        this.cancel = new EventEmitter();
        /**
         * An event fired when form is valid and submitted .
         * Event's payload equals to the form content.
         */
        this.submitForm = new EventEmitter();
        /**
         * An object of FormGroup type
         */
        // public formGroup: FormGroup;
        /**
         * Array to track all subscriptions and unsubscribe them onDestroy
         * @type {Array}
         */
        this.subs = [];
    }
    /**
     * Method provided by Angular. Invoked after the view has been initialized.
     */
    /*ngAfterViewChecked(): void {
      this.subs.push(this.formGroup.valueChanges
        .filter((formGroup) => this.formGroup.dirty)
        .subscribe(() => {
          // Dispatch a FormChangeAction if the user has changed the value in the UI
          this.store.dispatch(new FormChangeAction(this.formId, this.formGroup.value));
          this.formGroup.markAsPristine();
        }));
    }*/
    FormComponent.prototype.getFormGroup = function () {
        if (!!this.parentFormModel) {
            return this.formGroup.parent;
        }
        return this.formGroup;
    };
    FormComponent.prototype.getFormGroupValue = function () {
        return this.getFormGroup().value;
    };
    FormComponent.prototype.getFormGroupValidStatus = function () {
        return this.getFormGroup().valid;
    };
    /**
     * Method provided by Angular. Invoked after the constructor
     */
    FormComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (!this.formGroup) {
            this.formGroup = this.formBuilderService.createFormGroup(this.formModel);
        }
        else {
            this.formModel.forEach(function (model) {
                if (_this.parentFormModel) {
                    _this.formBuilderService.addFormGroupControl(_this.formGroup, _this.parentFormModel, model);
                }
            });
        }
        this.formService.initForm(this.formId, this.formModel, this.getFormGroupValidStatus());
        // TODO: take a look to the following method:
        // this.keepSync();
        this.formValid = this.getFormGroupValidStatus();
        this.subs.push(this.formGroup.statusChanges.pipe(filter(function (currentStatus) { return _this.formValid !== _this.getFormGroupValidStatus(); }))
            .subscribe(function (currentStatus) {
            _this.formService.setStatusChanged(_this.formId, _this.getFormGroupValidStatus());
            _this.formValid = _this.getFormGroupValidStatus();
        }));
        this.subs.push(this.formService.getForm(this.formId).pipe(filter(function (formState) { return !!formState && (isNotEmpty(formState.errors) || isNotEmpty(_this.formErrors)); }), map(function (formState) { return formState.errors; }), distinctUntilChanged())
            // .delay(100) // this terrible delay is here to prevent the detection change error
            .subscribe(function (errors) {
            var _a = _this, formGroup = _a.formGroup, formModel = _a.formModel;
            errors
                .filter(function (error) { return findIndex(_this.formErrors, {
                fieldId: error.fieldId,
                fieldIndex: error.fieldIndex
            }) === -1; })
                .forEach(function (error) {
                var fieldId = error.fieldId;
                var fieldIndex = error.fieldIndex;
                var field;
                if (!!_this.parentFormModel) {
                    field = _this.formBuilderService.getFormControlById(fieldId, formGroup.parent, formModel, fieldIndex);
                }
                else {
                    field = _this.formBuilderService.getFormControlById(fieldId, formGroup, formModel, fieldIndex);
                }
                if (field) {
                    var model = _this.formBuilderService.findById(fieldId, formModel);
                    _this.formService.addErrorToField(field, model, error.message);
                    // this.formService.validateAllFormFields(formGroup);
                    _this.changeDetectorRef.detectChanges();
                }
            });
            _this.formErrors
                .filter(function (error) { return findIndex(errors, {
                fieldId: error.fieldId,
                fieldIndex: error.fieldIndex
            }) === -1; })
                .forEach(function (error) {
                var fieldId = error.fieldId;
                var fieldIndex = error.fieldIndex;
                var field;
                if (!!_this.parentFormModel) {
                    field = _this.formBuilderService.getFormControlById(fieldId, formGroup.parent, formModel, fieldIndex);
                }
                else {
                    field = _this.formBuilderService.getFormControlById(fieldId, formGroup, formModel, fieldIndex);
                }
                if (field) {
                    var model = _this.formBuilderService.findById(fieldId, formModel);
                    _this.formService.removeErrorFromField(field, model, error.message);
                }
            });
            _this.formErrors = errors;
            _this.changeDetectorRef.detectChanges();
        }));
    };
    /**
     * Method provided by Angular. Invoked when the instance is destroyed
     */
    FormComponent.prototype.ngOnDestroy = function () {
        this.subs
            .filter(function (sub) { return hasValue(sub); })
            .forEach(function (sub) { return sub.unsubscribe(); });
        this.formService.removeForm(this.formId);
    };
    /**
     * Method to check if the form status is valid or not
     */
    FormComponent.prototype.isValid = function () {
        return this.formService.isValid(this.formId);
    };
    /**
     * Method to keep synchronized form controls values with form state
     */
    FormComponent.prototype.keepSync = function () {
        var _this = this;
        this.subs.push(this.formService.getFormData(this.formId)
            .subscribe(function (stateFormData) {
            if (!Object.is(stateFormData, _this.formGroup.value) && _this.formGroup) {
                _this.formGroup.setValue(stateFormData);
            }
        }));
    };
    FormComponent.prototype.onBlur = function (event) {
        this.blur.emit(event);
    };
    FormComponent.prototype.onFocus = function (event) {
        this.focus.emit(event);
    };
    FormComponent.prototype.onChange = function (event) {
        this.formService.changeForm(this.formId, this.formModel);
        this.formGroup.markAsPristine();
        if (this.emitChange) {
            this.change.emit(event);
        }
        var control = event.control;
        var fieldIndex = (event.context && event.context.index) ? event.context.index : 0;
        if (control.valid) {
            this.formService.removeError(this.formId, event.model.id, fieldIndex);
        }
    };
    /**
     * Method called on submit.
     * Emit a new submit Event whether the form is valid, mark fields with error otherwise
     */
    FormComponent.prototype.onSubmit = function () {
        if (this.getFormGroupValidStatus()) {
            this.submitForm.emit(this.formService.getFormData(this.formId));
        }
        else {
            this.formService.validateAllFormFields(this.formGroup);
        }
    };
    /**
     * Method to reset form fields
     */
    FormComponent.prototype.reset = function () {
        this.formGroup.reset();
        this.cancel.emit();
    };
    FormComponent.prototype.isItemReadOnly = function (arrayContext, index) {
        var context = arrayContext.groups[index];
        var model = context.group[0];
        return model.readOnly;
    };
    FormComponent.prototype.removeItem = function ($event, arrayContext, index) {
        var formArrayControl = this.formGroup.get(this.formBuilderService.getPath(arrayContext));
        this.removeArrayItem.emit(this.getEvent($event, arrayContext, index, 'remove'));
        this.formBuilderService.removeFormArrayGroup(index, formArrayControl, arrayContext);
        this.formService.changeForm(this.formId, this.formModel);
    };
    FormComponent.prototype.insertItem = function ($event, arrayContext, index) {
        var formArrayControl = this.formGroup.get(this.formBuilderService.getPath(arrayContext));
        this.formBuilderService.insertFormArrayGroup(index, formArrayControl, arrayContext);
        this.addArrayItem.emit(this.getEvent($event, arrayContext, index, 'add'));
        this.formService.changeForm(this.formId, this.formModel);
    };
    FormComponent.prototype.getEvent = function ($event, arrayContext, index, type) {
        var context = arrayContext.groups[index];
        var itemGroupModel = context.context;
        var group = this.formGroup.get(itemGroupModel.id);
        if (isNull(group)) {
            for (var _i = 0, _a = Object.keys(this.formGroup.controls); _i < _a.length; _i++) {
                var key = _a[_i];
                group = this.formGroup.controls[key].get(itemGroupModel.id);
                if (isNotNull(group)) {
                    break;
                }
            }
        }
        var model = context.group[0];
        var control = group.controls[index];
        return { $event: $event, context: context, control: control, group: group, model: model, type: type };
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], FormComponent.prototype, "displaySubmit", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], FormComponent.prototype, "emitChange", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], FormComponent.prototype, "formId", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Array)
    ], FormComponent.prototype, "formModel", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], FormComponent.prototype, "parentFormModel", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", FormGroup)
    ], FormComponent.prototype, "formGroup", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], FormComponent.prototype, "formLayout", void 0);
    tslib_1.__decorate([
        Output('dfBlur'),
        tslib_1.__metadata("design:type", EventEmitter)
    ], FormComponent.prototype, "blur", void 0);
    tslib_1.__decorate([
        Output('dfChange'),
        tslib_1.__metadata("design:type", EventEmitter)
    ], FormComponent.prototype, "change", void 0);
    tslib_1.__decorate([
        Output('dfFocus'),
        tslib_1.__metadata("design:type", EventEmitter)
    ], FormComponent.prototype, "focus", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], FormComponent.prototype, "addArrayItem", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], FormComponent.prototype, "removeArrayItem", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], FormComponent.prototype, "cancel", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], FormComponent.prototype, "submitForm", void 0);
    FormComponent = tslib_1.__decorate([
        Component({
            exportAs: 'formComponent',
            selector: 'ds-form',
            styleUrls: ['form.component.scss'],
            templateUrl: 'form.component.html'
        }),
        tslib_1.__metadata("design:paramtypes", [FormService,
            ChangeDetectorRef,
            FormBuilderService])
    ], FormComponent);
    return FormComponent;
}());
export { FormComponent };
//# sourceMappingURL=form.component.js.map