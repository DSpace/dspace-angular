import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../shared/shared.module';
import { AdminAccessControlRoutingModule } from './admin-access-control-routing.module';
import { EPeopleRegistryComponent } from './epeople-registry/epeople-registry.component';
import { EPersonFormComponent } from './epeople-registry/eperson-form/eperson-form.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    TranslateModule,
    AdminAccessControlRoutingModule
  ],
  declarations: [
    EPeopleRegistryComponent,
    EPersonFormComponent
  ],
  entryComponents: []
})
/**
 * This module handles all components related to the access control pages
 */
export class AdminAccessControlModule {

}
