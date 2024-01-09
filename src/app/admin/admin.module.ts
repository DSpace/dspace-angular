import { NgModule } from '@angular/core';
import { AccessControlModule } from '../access-control/access-control.module';
import { MetadataImportPageComponent } from './admin-import-metadata-page/metadata-import-page.component';
import { AdminRegistriesModule } from './admin-registries/admin-registries.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminCurationTasksComponent } from './admin-curation-tasks/admin-curation-tasks.component';
import { AdminSidebarSectionComponent } from './admin-sidebar/admin-sidebar-section/admin-sidebar-section.component';
import {
  ExpandableAdminSidebarSectionComponent
} from './admin-sidebar/expandable-admin-sidebar-section/expandable-admin-sidebar-section.component';
import { BatchImportPageComponent } from './admin-import-batch-page/batch-import-page.component';
import { UiSwitchModule } from 'ngx-ui-switch';
import { UploadModule } from '../shared/upload/upload.module';

const ENTRY_COMPONENTS = [
  // put only entry components that use custom decorator
  AdminSidebarSectionComponent,
  ExpandableAdminSidebarSectionComponent,
];


@NgModule({
    imports: [
        AdminRoutingModule,
        AdminRegistriesModule,
        AccessControlModule,
        UiSwitchModule,
        UploadModule,
        AdminCurationTasksComponent,
        MetadataImportPageComponent,
        BatchImportPageComponent
    ]
})
export class AdminModule {
  /**
   * NOTE: this method allows to resolve issue with components that using a custom decorator
   * which are not loaded during SSR otherwise
   */
  static withEntryComponents() {
    return {
      ngModule: AdminModule,
      providers: ENTRY_COMPONENTS.map((component) => ({provide: component}))
    };
  }
}
