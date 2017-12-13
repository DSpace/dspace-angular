import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

import {
  DynamicFormArrayModel,
  DynamicFormControlEvent,
  DynamicFormControlModel, DynamicFormGroupModel
} from '@ng-dynamic-forms/core';
import { Store } from '@ngrx/store';

import { AppState } from '../../app.reducer';
import {
  FormChangeAction,
  FormInitAction,
  FormRemoveAction,
  FormStatusChangeAction
} from './form.actions';
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

  private formValid: boolean;

  /**
   * A boolean that indicate if to display form's submit and cancel buttons
   */
  @Input() displaySubmit = true;

  /**
   * The form unique ID
   */
  @Input() formId: string;

  /**
   * An array of DynamicFormControlModel type
   */
  @Input() formModel: DynamicFormControlModel[];

  @Output() blur: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output() change: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output() focus: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output() addArrayItem: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output() removeArrayItem: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();

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
    this.subs.push(this.formGroup.valueChanges
      .filter((formGroup) => this.formGroup.dirty)
      .subscribe(() => {
        // Dispatch a FormChangeAction if the user has changed the value in the UI
        this.store.dispatch(new FormChangeAction(this.formId, this.formGroup.value));
        this.formGroup.markAsPristine();
      }));
  }

  /**
   * Method provided by Angular. Invoked after the constructor
   */
  ngOnInit() {
    this.formGroup = this.formBuilderService.createFormGroup(this.formModel);
    this.store.dispatch(new FormInitAction(this.formId, this.formGroup.value, this.formGroup.valid));
    this.keepSync();

    this.formValid = this.formGroup.valid;

    this.subs.push(this.formGroup.statusChanges
      .filter((currentStatus) => this.formValid !== currentStatus)
      .subscribe((currentStatus) => {
        // Dispatch a FormStatusChangeAction if the form status has changed
        this.store.dispatch(new FormStatusChangeAction(this.formId, currentStatus));
        this.formValid = currentStatus;
      }));
  }

  /**
   * Method provided by Angular. Invoked when the instance is destroyed
   */
  ngOnDestroy() {
    this.store.dispatch(new FormRemoveAction(this.formId));
    this.subs
      .filter((sub) => hasValue(sub))
      .forEach((sub) => sub.unsubscribe());
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
  private keepSync() {
    this.subs.push(this.formService.getFormData(this.formId)
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
      this.submit.emit(this.formService.getFormData(this.formId));
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

  removeItem($event, arrayContext: DynamicFormArrayModel, index: number) {
    this.formGroup.markAsDirty();
    const formArrayControl = this.formGroup.get(arrayContext.id) as FormArray;
    this.removeArrayItem.emit(this.getEvent($event, arrayContext, index, 'remove'));
    this.formBuilderService.removeFormArrayGroup(index, formArrayControl, arrayContext);
  }

  insertItem($event, arrayContext: DynamicFormArrayModel, index: number) {
    this.formGroup.markAsDirty();
    const formArrayControl = this.formGroup.get(arrayContext.id) as FormArray;
    this.formBuilderService.insertFormArrayGroup(index, formArrayControl, arrayContext);
    this.addArrayItem.emit(this.getEvent($event, arrayContext, index, 'add'));
  }

  protected getEvent($event: any, arrayContext: DynamicFormArrayModel, index: number, type: string): DynamicFormControlEvent {
    const context = arrayContext.groups[ index ];
    const itemGroupModel = context.context;
    const group = this.formGroup.get(itemGroupModel.id) as FormGroup;
    const model = context.group[ 0 ] as DynamicFormControlModel;
    const control = group.controls[ index ] as FormControl;
    return { $event, context, control, group, model, type };
  }

}
