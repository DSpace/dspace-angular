import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';
import { AdminLdnServicesRoutingModule } from './admin-ldn-services-routing.module';
import { LdnServiceFormComponent } from './ldn-service-form/ldn-service-form.component';
import { LdnItemfiltersService } from './ldn-services-data/ldn-itemfilters-data.service';
import { LdnServicesOverviewComponent } from './ldn-services-directory/ldn-services-directory.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    AdminLdnServicesRoutingModule,
    FormsModule,
  ],
  declarations: [
    LdnServicesOverviewComponent,
    LdnServiceFormComponent,
  ],
  providers: [LdnItemfiltersService],
})
export class AdminLdnServicesModule {
}
