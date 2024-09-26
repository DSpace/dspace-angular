import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExternalLoginPageRoutingModule } from './external-login-page-routing.module';
import { ExternalLoginPageComponent } from './external-login-page.component';
import { ThemedExternalLoginPageComponent } from './themed-external-login-page.component';
import { SharedModule } from '../shared/shared.module';
import { ExternalLoginModule } from '../external-log-in/external-login.module';

const COMPONENTS = [
  ExternalLoginPageComponent,
  ThemedExternalLoginPageComponent,
];

@NgModule({
  declarations: [
    ...COMPONENTS
  ],
  imports: [
    CommonModule,
    ExternalLoginPageRoutingModule,
    SharedModule,
    ExternalLoginModule
  ]
})
export class ExternalLoginPageModule { }
