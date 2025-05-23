import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { RegisterEmailFormComponent } from './register-email-form.component';
import { ThemedRegisterEmailFormComponent } from './themed-registry-email-form.component';

const DECLARATIONS = [
  RegisterEmailFormComponent,
  ThemedRegisterEmailFormComponent,
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    ...DECLARATIONS,
  ],
  providers: [],
  exports: [
    ...DECLARATIONS,
  ]
})

/**
 * The module that contains the components related to the email registration
 */
export class RegisterEmailFormModule {

}
