import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminLdnServicesRoutingModule } from './admin-ldn-services-routing.module';
import { LdnServicesOverviewComponent } from './ldn-services-directory/ldn-services-directory.component';
import { SharedModule } from '../../shared/shared.module';
import { LdnServiceFormComponent } from './ldn-service-form/ldn-service-form.component';
import { FormsModule } from '@angular/forms';
import { LdnItemfiltersService } from './ldn-services-data/ldn-itemfilters-data.service';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    AdminLdnServicesRoutingModule,
    FormsModule
  ],
  declarations: [
    LdnServicesOverviewComponent,
    LdnServiceFormComponent,
  ],
  providers: [LdnItemfiltersService]
})
export class AdminLdnServicesModule {
}
