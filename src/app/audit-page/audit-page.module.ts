import { NgModule } from '@angular/core';

import { AuditPageRoutingModule } from './audit-page-routing.module';
import { AuditDetailComponent } from './detail/audit-detail.component';
import { ObjectAuditOverviewComponent } from './object-audit-overview/object-audit-overview.component';
import { AuditOverviewComponent } from './overview/audit-overview.component';

@NgModule({
  imports: [
    AuditPageRoutingModule,
  ],
  declarations: [
    AuditOverviewComponent,
    AuditDetailComponent,
    ObjectAuditOverviewComponent,
  ],
  providers: [
    // TODO breadcrumbs resolvers
  ],
})

export class AuditPageModule {

}
