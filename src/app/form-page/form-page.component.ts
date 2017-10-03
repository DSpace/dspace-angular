import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

import { MY_DYNAMIC_FORM_MODEL, MY_DYNAMIC_FORM_MODEL2 } from './form-page.model';
import {
  DynamicFormArrayModel,
  DynamicFormControlModel,
  DynamicFormService,
  DynamicInputModel
} from '@ng-dynamic-forms/core';

@Component({
  selector: 'ds-forms',
  styleUrls: ['./form-page.component.scss'],
  templateUrl: './form-page.component.html',
  encapsulation: ViewEncapsulation.None
})
export class FormPageComponent implements OnInit {

  formModel: DynamicFormControlModel[] = MY_DYNAMIC_FORM_MODEL;
  formModel2: DynamicFormControlModel[] = MY_DYNAMIC_FORM_MODEL2;
  formGroup: FormGroup;
  formGroup2: FormGroup;

  exampleControl: FormControl;
  exampleControl2: FormControl;
  exampleModel: DynamicInputModel;
  exampleModel2: DynamicInputModel;

  arrayControl: FormArray;
  arrayControl2: FormArray;
  arrayModel: DynamicFormArrayModel;
  arrayModel2: DynamicFormArrayModel;

  constructor(private formService: DynamicFormService) {}

  ngOnInit() {

    this.formGroup = this.formService.createFormGroup(this.formModel);
   // this.formGroup2 = this.formService.createFormGroup(this.formModel2);
/*
    this.exampleControl = this.formGroup.get('bootstrapFormGroup1').get('bootstrapInput') as FormControl;
    this.exampleModel = this.formService.findById('bootstrapInput', this.formModel) as DynamicInputModel;

    this.arrayControl = this.formGroup.get('bootstrapFormGroup2').get('bootstrapFormArray') as FormArray;
    this.arrayModel = this.formService.findById('bootstrapFormArray', this.formModel) as DynamicFormArrayModel;

    /* this.exampleControl2 = this.formGroup2.get('bootstrapFormGroup1').get('bootstrapInput') as FormControl;
    this.exampleModel2 = this.formService.findById('bootstrapInput', this.formModel2) as DynamicInputModel;

    this.arrayControl2 = this.formGroup2.get('bootstrapFormGroup2').get('bootstrapFormArray') as FormArray;
    this.arrayModel2 = this.formService.findById('bootstrapFormArray', this.formModel) as DynamicFormArrayModel;
    */
  }

  add() {
    this.formService.addFormArrayGroup(this.arrayControl, this.arrayModel);
  }

  insert(context: DynamicFormArrayModel, index: number) {
    this.formService.insertFormArrayGroup(index, this.arrayControl, context);
    console.log(this.formModel);
  }

  remove(context: DynamicFormArrayModel, index: number) {
    this.formService.removeFormArrayGroup(index, this.arrayControl, context);
  }

  move(context: DynamicFormArrayModel, index: number, step: number) {
    this.formService.moveFormArrayGroup(index, step, this.arrayControl, context);
  }

  clear() {
    this.formService.clearFormArray(this.arrayControl, this.arrayModel);
  }

  onBlur($event) {
    // console.log(`BLUR event on ${$event.model.id}: `, $event);
  }

  onChange($event) {
    // console.log(`CHANGE event on ${$event.model.id}: `, $event);
  }

  onFocus($event) {
    // console.log(`FOCUS event on ${$event.model.id}: `, $event);
  }
}
