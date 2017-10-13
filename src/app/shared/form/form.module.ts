import { NgModule } from '@angular/core';
import { BaseRequestOptions } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { NgbDatepickerModule, NgbModule, NgbTimepickerModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { DynamicFormsCoreModule, DynamicFormService, DynamicFormValidationService } from '@ng-dynamic-forms/core';
import { TextMaskModule } from 'angular2-text-mask';
import { DynamicFormsNGBootstrapUIModule } from '@ng-dynamic-forms/ui-ng-bootstrap';

import { FormComponent } from './form.component';
import {
  DsDynamicFormControlComponent
} from './ds-ui-ng-bootstrap/ds-dynamic-form-control.component';
import {
  DsDynamicFormComponent
} from './ds-ui-ng-bootstrap/ds-dynamic-form.component';
import { DsDynamicTypeaheadComponent } from './model/typeahead/dynamic-typeahead.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    NgbDatepickerModule.forRoot(),
    NgbTimepickerModule.forRoot(),
    NgbTypeaheadModule.forRoot(),
    DynamicFormsCoreModule.forRoot(),
    DynamicFormsNGBootstrapUIModule,
    TextMaskModule
  ],
  declarations: [
    DsDynamicFormComponent,
    DsDynamicFormControlComponent,
    DsDynamicTypeaheadComponent,
    FormComponent,
  ],
  exports: [
    DsDynamicFormComponent,
    DsDynamicFormControlComponent,
    DsDynamicTypeaheadComponent,
    FormComponent
  ],
  providers: [
    BaseRequestOptions,
    DynamicFormService,
    DynamicFormValidationService,
  ]
})
export class FormModule {}
