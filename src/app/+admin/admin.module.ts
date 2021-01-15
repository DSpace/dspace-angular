import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AdminAccessControlModule } from './admin-access-control/admin-access-control.module';
import { MetadataImportPageComponent } from './admin-import-metadata-page/metadata-import-page.component';
import { AdminRegistriesModule } from './admin-registries/admin-registries.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminCurationTasksComponent } from './admin-curation-tasks/admin-curation-tasks.component';
import { AdminWorkflowModuleModule } from './admin-workflow-page/admin-workflow.module';
import { AdminSearchModule } from './admin-search-page/admin-search.module';

@NgModule({
  imports: [
    AdminRoutingModule,
    AdminRegistriesModule,
    AdminAccessControlModule,
    AdminSearchModule.withEntryComponents(),
    AdminWorkflowModuleModule.withEntryComponents(),
    SharedModule,
  ],
  declarations: [
    AdminCurationTasksComponent,
    MetadataImportPageComponent
  ]
})
export class AdminModule {

}
