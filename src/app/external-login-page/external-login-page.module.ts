import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ExternalLoginModule } from '../external-log-in/external-login.module';
import { ExternalLoginPageComponent } from './external-login-page.component';
import { ExternalLoginPageRoutingModule } from './external-login-page-routing.module';
import { ThemedExternalLoginPageComponent } from './themed-external-login-page.component';

const COMPONENTS = [
  ExternalLoginPageComponent,
  ThemedExternalLoginPageComponent,
];

@NgModule({
  declarations: [
    ...COMPONENTS,
  ],
  imports: [
    CommonModule,
    ExternalLoginPageRoutingModule,
    ExternalLoginModule,
  ],
})
export class ExternalLoginPageModule { }
