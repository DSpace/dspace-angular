import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { LogoutPageComponent } from './logout-page.component';
import { LogoutPageRoutingModule } from './logout-page-routing.module';

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
