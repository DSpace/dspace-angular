import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LogoutPageRoutingModule } from './logout-page-routing.module';
import { LogoutPageComponent } from './logout-page.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    LogoutPageRoutingModule,
    CommonModule,
    SharedModule,
  ],
  declarations: [
    LogoutPageComponent
  ]
})
export class LogoutPageModule {

}
