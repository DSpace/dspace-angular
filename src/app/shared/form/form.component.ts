import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormArray, FormGroup, FormGroupDirective } from '@angular/forms';

import {
  DynamicFormArrayModel,
  DynamicFormControlEvent,
  DynamicFormControlModel
} from '@ng-dynamic-forms/core';
import { Store } from '@ngrx/store';

import { uniqueId } from 'lodash';

import { AppState } from '../../app.reducer';
import { FormChangeAction, FormInitAction, FormStatusChangeAction } from './form.actions';
import { FormBuilderService } from './builder/form-builder.service';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { hasValue } from '../empty.util';
import { FormService } from './form.service';

/**
 * The default form component.
 */
@Component({
  exportAs: 'formComponent',
  selector: 'ds-form',
  styleUrls: [ 'form.component.scss' ],
  templateUrl: 'form.component.html',
})
export class FormComponent implements OnDestroy, OnInit {

  /**
   * A boolean that indicate if to display form's submit and cancel buttons
   */
  @Input() displaySubmit = true;

  /**
   * An ID used to generate the form unique ID
   */
  @Input() formId: string;

  /**
   * An array of DynamicFormControlModel type
   */
  @Input() formModel: DynamicFormControlModel[];

  @Output() blur: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output() change: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output() focus: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();

  /**
   * An event fired when form is valid and submitted .
   * Event's payload equals to the form content.
   */
  @Output() submit: EventEmitter<Observable<any>> = new EventEmitter<Observable<any>>();

  /**
   * An object of FormGroup type
   */
  public formGroup: FormGroup;

  /**
   * The form unique ID
   */
  public formUniqueId: string;

  /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   * @type {Array}
   */
  private subs: Subscription[] = [];

  constructor(private formService: FormService, private formBuilderService: FormBuilderService, private store: Store<AppState>) {
  }

  /**
   * Method provided by Angular. Invoked after the view has been initialized.
   */
  ngAfterViewChecked(): void {
    this.subs.push(this.formGroup.valueChanges.subscribe(() => {
      // Dispatch a FormChangeAction if the user has changed the value in the UI
      if (this.formGroup.dirty) {
        this.store.dispatch(new FormChangeAction(this.formUniqueId, this.formGroup.value));
        this.formGroup.markAsPristine();
      }
    }));
    this.subs.push(this.formGroup.statusChanges
      .flatMap(() => this.isValid())
      .subscribe((currentStatus) => {
        // Dispatch a FormStatusChangeAction if the form status has changed
        if (this.formGroup.valid !== currentStatus) {
          this.store.dispatch(new FormStatusChangeAction(this.formUniqueId, this.formGroup.valid));
        }
    }));
  }

  /**
   * Method provided by Angular. Invoked after the constructor
   */
  ngOnInit() {
    this.formUniqueId = uniqueId() + '_' + this.formId;
    this.formGroup = this.formBuilderService.createFormGroup(this.formModel);
    this.store.dispatch(new FormInitAction(this.formUniqueId, this.formGroup.value, this.formGroup.valid));
    this.keepSync();
  }

  /**
   * Method provided by Angular. Invoked when the instance is destroyed
   */
  ngOnDestroy() {
    this.subs
      .filter((sub) => hasValue(sub))
      .forEach((sub) => sub.unsubscribe());
  }

  /**
   * Method to retrieve the form's unique ID
   */
  public getFormUniqueId(): string {
    return this.formUniqueId;
  }

  /**
   * Method to check if the form status is valid or not
   */
  public isValid(): Observable<boolean> {
    return this.formService.isValid(this.formUniqueId)
  }

  /**
   * Method to keep synchronized form controls values with form state
   */
  private keepSync() {
    this.subs.push(this.formService.getFormData(this.formUniqueId)
      .subscribe((stateFormData) => {
        if (!Object.is(stateFormData, this.formGroup.value) && this.formGroup) {
          this.formGroup.setValue(stateFormData);
        }
      }));
  }

  onBlur(event) {
    this.blur.emit(event);
  }

  onFocus(event) {
    this.focus.emit(event);
  }

  onChange(event) {
    this.change.emit(event);
  }

  /**
   * Method called on submit.
   * Emit a new submit Event whether the form is valid, mark fields with error otherwise
   */
  onSubmit() {
    if (this.formGroup.valid) {
      this.submit.emit(this.formService.getFormData(this.formUniqueId));
    } else {
      this.formService.validateAllFormFields(this.formGroup);
    }
  }

  /**
   * Method to reset form fields
   */
  reset() {
    this.formGroup.reset();
  }

  removeItem(context: DynamicFormArrayModel, index: number) {
    this.formGroup.markAsDirty();
    const formArrayControl = this.formGroup.get(context.id) as FormArray;
    this.formBuilderService.removeFormArrayGroup(index, formArrayControl, context);
  }

  insertItem(context: DynamicFormArrayModel, index: number) {
    this.formGroup.markAsDirty();
    const formArrayControl = this.formGroup.get(context.id) as FormArray;
    this.formBuilderService.insertFormArrayGroup(index, formArrayControl, context);
  }

}
