import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormControl, UntypedFormArray, UntypedFormControl, UntypedFormGroup } from '@angular/forms';

import { Observable, Subscription } from 'rxjs';
import {
  DynamicFormArrayGroupModel,
  DynamicFormArrayModel,
  DynamicFormControlEvent,
  DynamicFormControlModel,
  DynamicFormGroupModel,
  DynamicFormLayout,
} from '@ng-dynamic-forms/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import findIndex from 'lodash/findIndex';

import { FormBuilderService } from './builder/form-builder.service';
import { hasValue, isNotEmpty, isNotNull, isNull } from '../empty.util';
import { FormService } from './form.service';
import { FormEntry, FormError } from './form.reducer';
import { FormFieldMetadataValueObject } from './builder/models/form-field-metadata-value.model';
import cloneDeep from 'lodash/cloneDeep';
import {
  DynamicScrollableDropdownModel
} from './builder/ds-dynamic-form-ui/models/scrollable-dropdown/dynamic-scrollable-dropdown.model';
import isEqual from 'lodash/isEqual';
import { DynamicRowGroupModel } from './builder/ds-dynamic-form-ui/models/ds-dynamic-row-group-model';
import {
  DynamicRelationGroupModel
} from './builder/ds-dynamic-form-ui/models/relation-group/dynamic-relation-group.model';
import { DynamicLinkModel } from './builder/ds-dynamic-form-ui/models/ds-dynamic-link.model';
import { DynamicConcatModel } from './builder/ds-dynamic-form-ui/models/ds-dynamic-concat.model';

export interface MetadataFields {
  [key: string]: FormFieldMetadataValueObject[]
}

/**
 * The default form component.
 */
@Component({
  exportAs: 'formComponent',
  selector: 'ds-form',
  styleUrls: ['form.component.scss'],
  templateUrl: 'form.component.html'
})
export class FormComponent implements OnDestroy, OnInit {

  private formErrors: FormError[] = [];
  private formValid: boolean;

  /**
   * A boolean that indicate if to display form's submit button
   */
  @Input() displaySubmit = true;

  /**
   * A boolean that indicate if to display form's reset button
   */
  @Input() displayReset = true;

  /**
   * A String that indicate the entity type of the item
   */
  @Input() entityType;

  /**
   * A boolean that indicate if to emit a form change event
   */
  @Input() emitChange = true;

  /**
   * The form unique ID
   */
  @Input() formId: string;

  /**
   * i18n key for the submit button
   */
  @Input() submitLabel = 'form.submit';

  /**
   * i18n key for the cancel button
   */
  @Input() resetLabel = 'form.reset';

  /**
   * An array of DynamicFormControlModel type
   */
  @Input() formModel: DynamicFormControlModel[];
  @Input() parentFormModel: DynamicRowGroupModel | DynamicFormGroupModel | DynamicFormGroupModel[];
  @Input() formGroup: UntypedFormGroup;
  @Input() formLayout = null as DynamicFormLayout;
  @Input() arrayButtonsStyle: string;
  @Input() isInlineGroupForm: boolean;

  /* eslint-disable @angular-eslint/no-output-rename */
  @Output('dfBlur') blur: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output('dfChange') change: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output('dfFocus') focus: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output('ngbEvent') customEvent: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  /* eslint-enable @angular-eslint/no-output-rename */
  @Output() addArrayItem: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output() removeArrayItem: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();

  /**
   * An event fired when form is valid and submitted .
   * Event's payload equals to the form content.
   */
  @Output() cancel: EventEmitter<Observable<any>> = new EventEmitter<Observable<any>>();

  /**
   * An event fired when form is valid and submitted .
   * Event's payload equals to the form content.
   */
  @Output() submitForm: EventEmitter<Observable<any>> = new EventEmitter<Observable<any>>();

  /**
   * Reference to NgbModal
   */
  modalRef: NgbModalRef;

  /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   * @type {Array}
   */
  private subs: Subscription[] = [];

  constructor(private formService: FormService,
              protected changeDetectorRef: ChangeDetectorRef,
              private formBuilderService: FormBuilderService) {
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

  private getFormGroup(): UntypedFormGroup {
    if (!!this.parentFormModel) {
      return this.formGroup.parent as UntypedFormGroup;
    }

    return this.formGroup;
  }

  private getFormGroupValue() {
    return this.getFormGroup().value;
  }

  private getFormGroupValidStatus() {
    return this.getFormGroup().valid || this.getFormGroup().disabled;
  }

  /**
   * Method provided by Angular. Invoked after the constructor
   */
  ngOnInit() {
    if (!this.formGroup) {
      this.formGroup = this.formBuilderService.createFormGroup(this.formModel);
      this.formBuilderService.addFormGroups(this.formId, this.formGroup);

    } else {
      this.formModel.forEach((model) => {
        if (this.parentFormModel) {
          this.formBuilderService.addFormGroupControl(this.formGroup, this.parentFormModel, model);
        }
      });
    }

    this.formService.initForm(this.formId, this.formModel, this.getFormGroupValidStatus());

    this.keepSync();

    this.formValid = this.getFormGroupValidStatus();

    this.subs.push(this.formGroup.statusChanges.pipe(
      filter(() => this.formValid !== this.getFormGroupValidStatus()))
      .subscribe(() => {
        this.formService.setStatusChanged(this.formId, this.getFormGroupValidStatus());
        this.formValid = this.getFormGroupValidStatus();
      }));

    this.subs.push(
      this.formService.getForm(this.formId).pipe(
        filter((formState: FormEntry) => !!formState && (isNotEmpty(formState.errors) || isNotEmpty(this.formErrors))),
        map((formState) => formState.errors),
        distinctUntilChanged())
        .subscribe((errors: FormError[]) => {
          const { formGroup, formModel } = this;
          errors
            .filter((error: FormError) => findIndex(this.formErrors, {
              fieldId: error.fieldId,
              fieldIndex: error.fieldIndex
            }) === -1)
            .forEach((error: FormError) => {
              const { fieldId } = error;
              const { fieldIndex } = error;
              let field: AbstractControl;
              if (!!this.parentFormModel) {
                field = this.formBuilderService.getFormControlById(fieldId, formGroup.parent as UntypedFormGroup, formModel, fieldIndex);
              } else {
                field = this.formBuilderService.getFormControlById(fieldId, formGroup, formModel, fieldIndex);
              }

              if (field) {
                const modelArrayIndex = fieldIndex > 0 ? fieldIndex : null;
                const model: DynamicFormControlModel = this.formBuilderService.findById(fieldId, formModel, modelArrayIndex);
                this.formService.addErrorToField(field, model, error.message);
                this.changeDetectorRef.detectChanges();
              }
            });

          this.formErrors
            .filter((error: FormError) => findIndex(errors, {
              fieldId: error.fieldId,
              fieldIndex: error.fieldIndex
            }) === -1)
            .forEach((error: FormError) => {
              const { fieldId } = error;
              const { fieldIndex } = error;
              let field: AbstractControl;
              if (!!this.parentFormModel) {
                field = this.formBuilderService.getFormControlById(fieldId, formGroup.parent as UntypedFormGroup, formModel, fieldIndex);
              } else {
                field = this.formBuilderService.getFormControlById(fieldId, formGroup, formModel, fieldIndex);
              }

              if (field) {
                const model: DynamicFormControlModel = this.formBuilderService.findById(fieldId, formModel);
                this.formService.removeErrorFromField(field, model, error.message);
              }
            });
          this.formErrors = errors;
          this.changeDetectorRef.detectChanges();
        })
    );
  }

  /**
   * Method provided by Angular. Invoked when the instance is destroyed
   */
  ngOnDestroy() {
    this.subs
      .filter((sub) => hasValue(sub))
      .forEach((sub) => sub.unsubscribe());
    this.formService.removeForm(this.formId);
    this.formBuilderService.removeFormGroup(this.formId);
  }

  /**
   * Method to check if the form status is valid or not
   */
  public isValid(): Observable<boolean> {
    return this.formService.isValid(this.formId);
  }

  /**
   * Method to keep synchronized form controls values with form state
   */
  private keepSync(): void {
    this.subs.push(this.formService.getFormData(this.formId)
      .subscribe((stateFormData) => {
        this.updateMetadataValue(stateFormData);
      }));
  }

  onBlur(event: DynamicFormControlEvent): void {
    this.blur.emit(event);
    const control: UntypedFormControl = event.control;
    const fieldIndex: number = (event.context && event.context.index) ? event.context.index : 0;
    if (control.valid) {
      this.formService.removeError(this.formId, event.model.name, fieldIndex);
    } else {
      this.formService.addControlErrors(control, this.formId, event.model.name, fieldIndex);
    }
  }

  onCustomEvent(event: any) {
    if (event?.type === 'authorityEnrichment') {
      event.$event.updatedModels.forEach((model) => {
        const control: FormControl = this.formBuilderService.getFormControlByModel(this.formGroup, model) as FormControl;
        if (control) {
          const changeEvent = this.formBuilderService.createDynamicFormControlEvent(control, control.parent as UntypedFormGroup, model, 'change');
          if (model instanceof  DynamicRelationGroupModel) {
            control.setValue(model.value);
          }
          this.onChange(changeEvent);
        }
      });
    } else {
      this.customEvent.emit(event);
    }
  }

  onFocus(event: DynamicFormControlEvent): void {
    this.formService.setTouched(this.formId, this.formModel, event);
    this.focus.emit(event);
  }

  onChange(event: DynamicFormControlEvent): void {
    this.formService.changeForm(this.formId, this.formModel);
    this.formGroup.markAsPristine();
    if (this.emitChange) {
      this.change.emit(event);
    }

    const control: UntypedFormControl = event.control;
    const fieldIndex: number = (event.context && event.context.index) ? event.context.index : 0;
    if (control.valid) {
      this.formService.removeError(this.formId, event.model.id, fieldIndex);
    }
  }

  /**
   * Method called on submit.
   * Emit a new submit Event whether the form is valid, mark fields with error otherwise
   */
  onSubmit(): void {
    if (this.getFormGroupValidStatus()) {
      this.submitForm.emit(this.formService.getFormData(this.formId));
    } else {
      this.formService.validateAllFormFields(this.formGroup);
    }
  }

  /**
   * Method to reset form fields
   */
  reset(): void {
    this.formGroup.reset();
    this.cancel.emit();
  }

  isItemReadOnly(arrayContext: DynamicFormArrayModel, index: number): boolean {
    const context = arrayContext.groups[index];
    const model = context.group[0] as any;
    return model.readOnly;
  }

  removeItem($event, arrayContext: DynamicFormArrayModel, index: number): void {
    const formArrayControl = this.formGroup.get(this.formBuilderService.getPath(arrayContext)) as UntypedFormArray;
    const event = this.getEvent($event, arrayContext, index, 'remove');
    if (this.formBuilderService.isQualdropGroup(event.model as DynamicFormControlModel) || this.isInlineGroupForm) {
      // In case of qualdrop value or inline-group remove event must be dispatched before removing the control from array
      this.removeArrayItem.emit(event);
    }
    if (index === 0 && formArrayControl.value?.length === 1) {
      event.model = cloneDeep(event.model);
      const fieldId = event.model.id;

      if (event.model instanceof DynamicLinkModel || event.model instanceof DynamicConcatModel) {
        formArrayControl.at(0).get(fieldId).reset();
      } else {
        formArrayControl.at(0).get(fieldId).setValue(null);
      }
    } else {
      this.formBuilderService.removeFormArrayGroup(index, formArrayControl, arrayContext);
    }

    this.formService.changeForm(this.formId, this.formModel);
    if (!this.formBuilderService.isQualdropGroup(event.model as DynamicFormControlModel) && !this.isInlineGroupForm) {
      // dispatch remove event for any field type except for qualdrop value and inline-group
      this.removeArrayItem.emit(event);
    }
  }

  clearScrollableDropdown($event, model: DynamicFormControlModel): void {
    const control = this.formGroup.get(this.formBuilderService.getPath(model)) as FormControl;
    const event = { $event, type: 'remove', model: cloneDeep(model), context: null, control, group: control.parent } as DynamicFormControlEvent;
    control.setValue(null);
    this.formService.changeForm(this.formId, this.formModel);
    this.removeArrayItem.emit(event);
  }

  insertItem($event, arrayContext: DynamicFormArrayModel, index: number): void {
    const formArrayControl = this.formGroup.get(this.formBuilderService.getPath(arrayContext)) as UntypedFormArray;
    this.formBuilderService.insertFormArrayGroup(index, formArrayControl, arrayContext);
    this.addArrayItem.emit(this.getEvent($event, arrayContext, index, 'add'));
    this.formService.changeForm(this.formId, this.formModel);
  }

  copyItem($event, arrayContext: DynamicFormArrayModel, index: number): void {
    const formArrayControl = this.formGroup.get(this.formBuilderService.getPath(arrayContext)) as FormArray;
    const newFormGroup = this.formBuilderService.copyFormArrayGroup(index, formArrayControl, arrayContext);
    this.customEvent.emit(this.getEvent($event, arrayContext, index + 1, 'copy', newFormGroup));
    this.formService.changeForm(this.formId, this.formModel);
    this.formGroup.markAsPristine();
  }


  isVirtual(arrayContext: DynamicFormArrayModel, index: number) {
    const context = arrayContext.groups[index];
    const value: FormFieldMetadataValueObject = (context.group[0] as any).metadataValue;
    return isNotEmpty(value) && value.isVirtual;
  }

  isArrayGroupEmpty(group): boolean {
    return group.context.groups?.length <= 1 && !group.context.groups?.[0]?.group?.[0]?.value;
  }

  isTheOnlyFieldInArrayGroup(model: DynamicScrollableDropdownModel) {
    return model.parent instanceof DynamicFormArrayGroupModel && model.parent?.group?.length === 1;
  }

  protected getEvent($event: any, arrayContext: DynamicFormArrayModel, index: number, type: string, formGroup?: UntypedFormGroup): DynamicFormControlEvent {
    const context = arrayContext.groups[index];
    const itemGroupModel = context.context;
    let group = (formGroup) ? formGroup : this.formGroup.get(itemGroupModel.id) as UntypedFormGroup;
    if (isNull(group)) {
      for (const key of Object.keys(this.formGroup.controls)) {
        group = this.formGroup.controls[key].get(itemGroupModel.id) as UntypedFormGroup;
        if (isNotNull(group)) {
          break;
        }
      }
    }
    const model = context.group[0] as DynamicFormControlModel;
    const control = group.controls[index] as UntypedFormControl;
    return { $event, context, control, group, model, type };
  }

  private updateMetadataValue(metadataFields: MetadataFields): void {
    const metadataKeys = hasValue(metadataFields) ? Object.keys(metadataFields) : [];
    const formKeys = hasValue(this.formGroup.value) ? Object.keys(this.formGroup.value).map(key => key.replace('_array', '')) : [];

    formKeys
      .filter((key) => isNotEmpty(this.formGroup.value[key]))
      .forEach((key) => {
        const innerObjectKeys = (Object.keys(this.formGroup.value[key] ?? {} ) as any[]).map((oldKey) => oldKey.replaceAll('_', '.'));
        const filteredKeys = innerObjectKeys.filter(innerKey => metadataKeys.includes(innerKey));
        const oldValue = this.formGroup.value[key];

        if (filteredKeys.length > 0) {
          filteredKeys.forEach((oldValueKey) => {
            const newValue = {...oldValue};
            const formattedKey = (oldValueKey as any).replaceAll('.', '_');
            const patchValue = {};

            newValue[formattedKey] = metadataFields[oldValueKey][0];
            patchValue[key] = newValue;

            if (!isEqual(oldValue[oldValueKey], newValue[oldValueKey])) {
              this.formGroup.patchValue(patchValue);
            }
          });
        }
    });
  }
}
