import { CommonModule } from '@angular/common';
import { RegisterEmailFormComponent } from './register-email-form.component';
import { ThemedRegisterEmailFormComponent } from './themed-registry-email-form.component';
import { NgModule } from '@angular/core';

const DECLARATIONS = [
  RegisterEmailFormComponent,
  ThemedRegisterEmailFormComponent,
];

@NgModule({
    imports: [
        CommonModule,
        ...DECLARATIONS,
    ],
    providers: [],
    exports: [
      ...DECLARATIONS,
  ],
})

/**
 * The module that contains the components related to the email registration
 */
export class RegisterEmailFormModule {

}
