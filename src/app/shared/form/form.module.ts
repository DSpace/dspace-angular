import { NgModule } from '@angular/core';
import { BaseRequestOptions } from '@angular/http';

import { ReactiveFormsModule } from '@angular/forms';

import { NgbDatepickerModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { DynamicFormsCoreModule, DynamicFormService, DynamicFormValidationService } from '@ng-dynamic-forms/core';
import { DynamicFormsNGBootstrapUIModule } from '@ng-dynamic-forms/ui-ng-bootstrap';

import { FormComponent } from './form.component';

@NgModule({
  imports: [
    ReactiveFormsModule,
    NgbDatepickerModule.forRoot(),
    NgbTimepickerModule.forRoot(),
    DynamicFormsCoreModule.forRoot(),
    DynamicFormsNGBootstrapUIModule,
  ],
  declarations: [
    FormComponent,
  ],
  exports: [
    FormComponent
  ],
  providers: [
    BaseRequestOptions,
    DynamicFormService,
    DynamicFormValidationService,
  ]
})
export class FormModule {}
