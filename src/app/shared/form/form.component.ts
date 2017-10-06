import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective } from '@angular/forms';

import { DynamicFormControlModel } from '@ng-dynamic-forms/core';
import { Store } from '@ngrx/store';

import * as _ from 'lodash';

import { AppState } from '../../app.reducer';
import { FormChangeAction, FormInitAction, FormStatusChangeAction } from './form.actions';
import { FormService } from './form.service';
import { formObjectFromIdSelector } from './selectors';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { hasValue } from '../empty.util';

/**
 * The default form component.
 */
@Component({
  exportAs: 'paginationComponent',
  selector: 'ds-form',
  styleUrls: ['form.component.scss'],
  templateUrl: 'form.component.html',
})
export class FormComponent implements OnDestroy, OnInit {
  @Input() formId: string;
  @Input() formModel: DynamicFormControlModel[];

  public formGroup: FormGroup;

  /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   * @type {Array}
   */
  private subs: Subscription[] = [];

  @ViewChild('formRef') formRef: FormGroupDirective;

  constructor(private formService: FormService, private store:Store<AppState>) {}

  ngAfterViewInit(): void {
    this.subs.push(this.formRef.control.valueChanges.subscribe((val) => {
      if (this.formRef.control.dirty) {
        this.store.dispatch(new FormChangeAction(this.formId, this.formRef.value));
        this.formRef.control.markAsPristine();
      }
    }));
    this.subs.push(this.formRef.control.statusChanges
      .flatMap(() => this.isValid())
      .subscribe((currentStatus) => {
        if (this.formRef.valid !== currentStatus) {
          this.store.dispatch(new FormStatusChangeAction(this.formId, this.formRef.valid));
        }
    }));
  }

  ngOnInit() {
    this.formId = _.uniqueId() + '_' + this.formId;
    this.formGroup = this.formService.createFormGroup(this.formModel);
    this.store.dispatch(new FormInitAction(this.formId, this.formGroup.value, this.formGroup.valid));
    /*Object.keys(this.formGroup.controls).forEach((key) => {
      this.formGroup.get(key).markAsDirty();
      if (key === 'zipCode') {
        this.formGroup.controls[key].setValue('test');
      }
      console.log(key);
    });*/
    this.keepSync();
  }

  /**
   * Method provided by Angular. Invoked when the instance is destroyed.
   */
  ngOnDestroy() {
    this.subs
      .filter((sub) => hasValue(sub))
      .forEach((sub) => sub.unsubscribe());
  }

  public isValid(): Observable<boolean> {
    return this.store.select(formObjectFromIdSelector(this.formId))
      .map((state) =>  state.valid)
      .distinctUntilChanged();
  }

  private getFormData(): Observable<FormControl> {
    return this.store.select(formObjectFromIdSelector(this.formId))
      .map((state) => state.data)
      .distinctUntilChanged();
  }

  private keepSync() {
    this.subs.push(this.getFormData()
      .subscribe((stateFormData) => {
        if (!Object.is(stateFormData, this.formRef.value) && this.formRef.control) {
          this.formRef.control.setValue(stateFormData);
        }
    }));
  }
}
