import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AuditPageRoutingModule } from './audit-page-routing.module';
import { AuditDetailComponent } from './detail/audit-detail.component';
import { AuditOverviewComponent } from './overview/audit-overview.component';
import { ObjectAuditOverviewComponent } from './object-audit-overview/object-audit-overview.component';

@NgModule({
  imports: [
    AuditPageRoutingModule,
    SharedModule,
  ],
  declarations: [
    AuditOverviewComponent,
    AuditDetailComponent,
    ObjectAuditOverviewComponent
  ],
  providers: [
    // TODO breadcrumbs resolvers
  ],
  entryComponents: []
})

export class AuditPageModule {

}
