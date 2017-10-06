import { Directive, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { FormState } from './form.reducers';
import { Store } from '@ngrx/store';
import { FormChangeAction, FormInitAction } from './form.actions';
import * as _ from 'lodash';

@Directive({
  selector: 'form[dsFormState][formGroup]',
  exportAs: 'panelRef'
})
export class FormStateDirective {
  /* tslint:disable:no-input-rename */
  @Input('dsFormState') formId: string;
  @Input('formGroup') formObject: FormGroup;
  /* tslint:enable:no-input-rename */

  constructor(private store:Store<FormState>) {}
}

export const isFormGroup = (val) =>
  val instanceof FormGroup;

export const paths = (obj) =>
  Object.entries(obj)
    .reduce(
      (product, [key, value]) =>
        isFormGroup(value) ?
          product.concat([
            [key, paths(value.controls)] // adds [root, [children]] list
          ]) :
          product.concat([key]), // adds [child] list
      []
    )
