import { NgModule } from '@angular/core';
import { BaseRequestOptions } from '@angular/http';
import { LocationStrategy, HashLocationStrategy, CommonModule } from '@angular/common';
import { ReactiveFormsModule, NG_VALIDATORS } from '@angular/forms';

import { NgbDatepickerModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';

import { DynamicFormsCoreModule, DynamicFormService, DynamicFormValidationService } from '@ng-dynamic-forms/core';
import { DynamicFormsNGBootstrapUIModule } from '@ng-dynamic-forms/ui-ng-bootstrap';

import { SharedModule } from '../shared/shared.module';
import { FormPageRoutingModule } from './form-page-routing.module';

import { FormPageComponent } from './form-page.component';
import { ValidationMessageComponent } from './validation-message/validation-message.component';

import { FormStateDirective } from '../core/form/form-state.directive';

import { customValidator } from './app.validators';

@NgModule({
  imports: [
    FormPageRoutingModule,
    ReactiveFormsModule,
    NgbDatepickerModule.forRoot(),
    NgbTimepickerModule.forRoot(),
    DynamicFormsCoreModule.forRoot(),
    DynamicFormsNGBootstrapUIModule,
    SharedModule
  ],
  declarations: [
    FormPageComponent,
    FormStateDirective,
    ValidationMessageComponent,
  ],
  providers: [
    BaseRequestOptions,
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    {
      provide: NG_VALIDATORS,
      useValue: customValidator,
      multi: true
    },
    DynamicFormService,
    DynamicFormValidationService,
  ]
})
export class FormPageModule {}
