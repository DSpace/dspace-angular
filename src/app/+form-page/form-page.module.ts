import { NgModule } from '@angular/core';
import { LocationStrategy, HashLocationStrategy, CommonModule } from '@angular/common';
import { NG_VALIDATORS } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { FormPageRoutingModule } from './form-page-routing.module';

import { FormPageComponent } from './form-page.component';
import { ValidationMessageComponent } from './validation-message/validation-message.component';

import { customValidator } from './app.validators';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormPageRoutingModule
  ],
  declarations: [
    FormPageComponent,
  ]
})
/*@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormPageRoutingModule,
  ],
  declarations: [
    FormPageComponent,
    ValidationMessageComponent,
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    {
      provide: NG_VALIDATORS,
      useValue: customValidator,
      multi: true
    },
  ]
})*/
export class FormPageModule {}
