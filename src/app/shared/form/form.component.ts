import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective } from '@angular/forms';

import { DynamicFormControlModel } from '@ng-dynamic-forms/core';
import { Store } from '@ngrx/store';

import * as _ from 'lodash';

import { AppState } from '../../app.reducer';
import { FormChangeAction, FormInitAction, FormStatusChangeAction } from './form.actions';
import { FormBuilderService } from './builder/form-builder.service';
import { formObjectFromIdSelector } from './selectors';
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
  styleUrls: ['form.component.scss'],
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

  @ViewChild('formRef') formRef: FormGroupDirective;

  constructor(private formService: FormService, private formBuilderService: FormBuilderService, private store: Store<AppState>) {}

  /**
   * Method provided by Angular. Invoked after the view has been initialized.
   */
  ngAfterViewInit(): void {
    this.subs.push(this.formRef.control.valueChanges.subscribe((val) => {
      // Dispatch a FormChangeAction if the user has changed the value in the UI
      if (this.formRef.control.dirty) {
        this.store.dispatch(new FormChangeAction(this.formUniqueId, this.formRef.value));
        this.formRef.control.markAsPristine();
      }
    }));
    this.subs.push(this.formRef.control.statusChanges
      .flatMap(() => this.isValid())
      .subscribe((currentStatus) => {
        // Dispatch a FormStatusChangeAction if the form status has changed
        if (this.formRef.valid !== currentStatus) {
          this.store.dispatch(new FormStatusChangeAction(this.formUniqueId, this.formRef.valid));
        }
    }));
  }

  /**
   * Method provided by Angular. Invoked after the constructor
   */
  ngOnInit() {
    this.formUniqueId = _.uniqueId() + '_' + this.formId;
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
        if (!Object.is(stateFormData, this.formRef.value) && this.formRef.control) {
          this.formRef.control.setValue(stateFormData);
        }
    }));
  }

  /**
   * Method called on submit.
   * Emit a new submit Event whether the form is valid, mark fileds with error otherwise
   */
  onSubmit() {
    if (this.formRef.valid) {
      this.submit.emit(this.formService.getFormData(this.formUniqueId));
    } else {
      this.formService.validateAllFormFields(this.formRef.control);
    }
  }

  /**
   * Method to reset form fields
   */
  reset() {
    this.formRef.reset();
  }

}
