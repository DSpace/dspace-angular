import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output, ViewEncapsulation
} from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';

import {
  DynamicFormArrayModel,
  DynamicFormControlEvent,
  DynamicFormControlModel,
  DynamicFormGroupModel,
  DynamicFormLayout,
} from '@ng-dynamic-forms/core';
import { findIndex } from 'lodash';
import { FormBuilderService } from './builder/form-builder.service';
import { Observable, Subscription } from 'rxjs';
import { hasValue, isNotEmpty, isNotNull, isNull } from '../empty.util';
import { FormService } from './form.service';
import { FormEntry, FormError } from './form.reducer';

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
   * A boolean that indicate if to display form's submit and cancel buttons
   */
  @Input() displaySubmit = true;

  /**
   * A boolean that indicate if to emit a form change event
   */
  @Input() emitChange = true;

  /**
   * The form unique ID
   */
  @Input() formId: string;

  /**
   * An array of DynamicFormControlModel type
   */
  @Input() formModel: DynamicFormControlModel[];
  @Input() parentFormModel: DynamicFormGroupModel | DynamicFormGroupModel[];
  @Input() formGroup: FormGroup;
  @Input() formLayout = null as DynamicFormLayout;

  /* tslint:disable:no-output-rename */
  @Output('dfBlur') blur: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output('dfChange') change: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output('dfFocus') focus: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  /* tslint:enable:no-output-rename */
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
   * An object of FormGroup type
   */
  // public formGroup: FormGroup;

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

  private getFormGroup(): FormGroup {
    if (!!this.parentFormModel) {
      return this.formGroup.parent as FormGroup;
    }

    return this.formGroup;
  }

  private getFormGroupValue() {
    return this.getFormGroup().value;
  }

  private getFormGroupValidStatus() {
    return this.getFormGroup().valid;
  }

  /**
   * Method provided by Angular. Invoked after the constructor
   */
  ngOnInit() {
    if (!this.formGroup) {
      this.formGroup = this.formBuilderService.createFormGroup(this.formModel);

    } else {
      this.formModel.forEach((model) => {
        if (this.parentFormModel) {
          this.formBuilderService.addFormGroupControl(this.formGroup, this.parentFormModel, model);
        }
      });
    }

    this.formService.initForm(this.formId, this.formModel, this.getFormGroupValidStatus());

    // TODO: take a look to the following method:
    // this.keepSync();

    this.formValid = this.getFormGroupValidStatus();

    this.subs.push(this.formGroup.statusChanges.pipe(
      filter((currentStatus) => this.formValid !== this.getFormGroupValidStatus()))
      .subscribe((currentStatus) => {
        this.formService.setStatusChanged(this.formId, this.getFormGroupValidStatus());
        this.formValid = this.getFormGroupValidStatus();
      }));

    this.subs.push(
      this.formService.getForm(this.formId).pipe(
        filter((formState: FormEntry) => !!formState && (isNotEmpty(formState.errors) || isNotEmpty(this.formErrors))),
        map((formState) => formState.errors),
        distinctUntilChanged())
      // .delay(100) // this terrible delay is here to prevent the detection change error
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
                field = this.formBuilderService.getFormControlById(fieldId, formGroup.parent as FormGroup, formModel, fieldIndex);
              } else {
                field = this.formBuilderService.getFormControlById(fieldId, formGroup, formModel, fieldIndex);
              }

              if (field) {
                const model: DynamicFormControlModel = this.formBuilderService.findById(fieldId, formModel);
                this.formService.addErrorToField(field, model, error.message);
                // this.formService.validateAllFormFields(formGroup);
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
                field = this.formBuilderService.getFormControlById(fieldId, formGroup.parent as FormGroup, formModel, fieldIndex);
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
    this.formService.removeForm(this.formId)
  }

  /**
   * Method to check if the form status is valid or not
   */
  public isValid(): Observable<boolean> {
    return this.formService.isValid(this.formId)
  }

  /**
   * Method to keep synchronized form controls values with form state
   */
  private keepSync(): void {
    this.subs.push(this.formService.getFormData(this.formId)
      .subscribe((stateFormData) => {
        if (!Object.is(stateFormData, this.formGroup.value) && this.formGroup) {
          this.formGroup.setValue(stateFormData);
        }
      }));
  }

  onBlur(event: DynamicFormControlEvent): void {
    this.blur.emit(event);
  }

  onFocus(event: DynamicFormControlEvent): void {
    this.focus.emit(event);
  }

  onChange(event: DynamicFormControlEvent): void {
    this.formService.changeForm(this.formId, this.formModel);
    this.formGroup.markAsPristine();

    if (this.emitChange) {
      this.change.emit(event);
    }

    const control: FormControl = event.control;
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
    const formArrayControl = this.formGroup.get(this.formBuilderService.getPath(arrayContext)) as FormArray;
    this.removeArrayItem.emit(this.getEvent($event, arrayContext, index, 'remove'));
    this.formBuilderService.removeFormArrayGroup(index, formArrayControl, arrayContext);
    this.formService.changeForm(this.formId, this.formModel);
  }

  insertItem($event, arrayContext: DynamicFormArrayModel, index: number): void {
    const formArrayControl = this.formGroup.get(this.formBuilderService.getPath(arrayContext)) as FormArray;
    this.formBuilderService.insertFormArrayGroup(index, formArrayControl, arrayContext);
    this.addArrayItem.emit(this.getEvent($event, arrayContext, index, 'add'));
    this.formService.changeForm(this.formId, this.formModel);
  }

  protected getEvent($event: any, arrayContext: DynamicFormArrayModel, index: number, type: string): DynamicFormControlEvent {
    const context = arrayContext.groups[index];
    const itemGroupModel = context.context;
    let group = this.formGroup.get(itemGroupModel.id) as FormGroup;
    if (isNull(group)) {
      for (const key of Object.keys(this.formGroup.controls)) {
        group = this.formGroup.controls[key].get(itemGroupModel.id) as FormGroup;
        if (isNotNull(group)) {
          break;
        }
      }
    }
    const model = context.group[0] as DynamicFormControlModel;
    const control = group.controls[index] as FormControl;
    return { $event, context, control, group, model, type };
  }
}
