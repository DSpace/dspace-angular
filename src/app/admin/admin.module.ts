import { NgModule } from '@angular/core';
import { UiSwitchModule } from 'ngx-ui-switch';

import { AccessControlModule } from '../access-control/access-control.module';
import { SharedModule } from '../shared/shared.module';
import { UploadModule } from '../shared/upload/upload.module';
import { AdminCurationTasksComponent } from './admin-curation-tasks/admin-curation-tasks.component';
import { BatchImportPageComponent } from './admin-import-batch-page/batch-import-page.component';
import { MetadataImportPageComponent } from './admin-import-metadata-page/metadata-import-page.component';
import { ThemedMetadataImportPageComponent } from './admin-import-metadata-page/themed-metadata-import-page.component';
import { AdminRegistriesModule } from './admin-registries/admin-registries.module';
import { AdminReportsModule } from './admin-reports/admin-reports.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminSearchModule } from './admin-search-page/admin-search.module';
import { AdminSidebarSectionComponent } from './admin-sidebar/admin-sidebar-section/admin-sidebar-section.component';
import { ExpandableAdminSidebarSectionComponent } from './admin-sidebar/expandable-admin-sidebar-section/expandable-admin-sidebar-section.component';
import { AdminWorkflowModuleModule } from './admin-workflow-page/admin-workflow.module';

const ENTRY_COMPONENTS = [
  // put only entry components that use custom decorator
  AdminSidebarSectionComponent,
  ExpandableAdminSidebarSectionComponent,
];

const DECLARATIONS = [
  AdminCurationTasksComponent,
  MetadataImportPageComponent,
  ThemedMetadataImportPageComponent,
  BatchImportPageComponent,
];

@NgModule({
  imports: [
    AdminRoutingModule,
    AdminRegistriesModule,
    AdminReportsModule,
    AccessControlModule,
    AdminSearchModule.withEntryComponents(),
    AdminWorkflowModuleModule.withEntryComponents(),
    SharedModule,
    UiSwitchModule,
    UploadModule,
  ],
  declarations: [
    ...DECLARATIONS,
  ],
})
export class AdminModule {
  /**
   * NOTE: this method allows to resolve issue with components that using a custom decorator
   * which are not loaded during SSR otherwise
   */
  static withEntryComponents() {
    return {
      ngModule: AdminModule,
      providers: ENTRY_COMPONENTS.map((component) => ({ provide: component })),
    };
  }
}
