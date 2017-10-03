import { Directive, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormState } from './form.reducers';
import { Store } from '@ngrx/store';
import { FormInitAction } from './form.actions';

@Directive({
  selector: 'form[dsFormState][formGroup]',
  exportAs: 'panelRef'
})
export class FormStateDirective implements OnInit {
  /* tslint:disable:no-input-rename */
  @Input('dsFormState') formId: string;
  @Input('formGroup') formObject: FormGroup;
  /* tslint:enable:no-input-rename */

  constructor(private store:Store<FormState>) {}

  ngOnChanges(): void {
    this.formObject.valueChanges.subscribe((val) => {
      // console.log(val);
    });
  }

  ngOnInit() {
    this.store.dispatch(new FormInitAction('testform', this.formObject.value, this.formObject.valid));
  }
}
