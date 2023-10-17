import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminLdnServicesRoutingModule } from './admin-ldn-services-routing.module';
import { LdnServicesOverviewComponent } from './ldn-services-directory/ldn-services-directory.component';
import { SharedModule } from '../../shared/shared.module';
import { LdnServiceNewComponent } from './ldn-service-new/ldn-service-new.component';
import { LdnServiceFormComponent } from './ldn-service-form/ldn-service-form.component';
import { LdnServiceFormEditComponent } from './ldn-service-form-edit/ldn-service-form-edit.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    AdminLdnServicesRoutingModule,
    FormsModule
  ],
  declarations: [
    LdnServicesOverviewComponent,
    LdnServiceNewComponent,
    LdnServiceFormComponent,
    LdnServiceFormEditComponent,
  ]
})
export class AdminLdnServicesModule { }
