import { NgModule } from '@angular/core';
import { BaseRequestOptions } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { LocationStrategy, HashLocationStrategy, CommonModule } from '@angular/common';
import { ReactiveFormsModule, NG_VALIDATORS } from '@angular/forms';
import { NgbDatepickerModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';

import { DynamicFormsCoreModule } from '@ng-dynamic-forms/core';
import { DynamicFormsNGBootstrapUIModule } from '@ng-dynamic-forms/ui-ng-bootstrap';

import { SharedModule } from '../shared/shared.module';
import { FormPageRoutingModule } from './form-page-routing.module';
import { RouterModule } from '@angular/router';
import { DynamicFormService } from '@ng-dynamic-forms/core';
import { DynamicFormValidationService } from '@ng-dynamic-forms/core';
import { FormPageComponent } from './form-page.component';
import { customValidator } from './app.validators';
import { ValidationMessageComponent } from './validation-message/validation-message.component';
import { FormStateDirective } from '../core/form/form-state.directive';

@NgModule({

  imports: [
    FormPageRoutingModule,
    BrowserModule,
    ReactiveFormsModule,
    NgbDatepickerModule.forRoot(),
    NgbTimepickerModule.forRoot(),
    DynamicFormsCoreModule.forRoot(),
    DynamicFormsNGBootstrapUIModule,
    CommonModule,
    RouterModule,
    SharedModule,
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
