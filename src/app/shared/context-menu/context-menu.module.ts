import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { ContextMenuComponent } from './context-menu.component';
import { RequestCorrectionMenuComponent } from './request-correction/request-correction-menu.component';
import { EditItemMenuComponent } from './edit-item/edit-item-menu.component';
import { ExportItemMenuComponent } from './export-item/export-item-menu.component';
import { AuditItemMenuComponent } from './audit-item/audit-item-menu.component';
import { DsoPageEditMenuComponent } from './dso-page-edit/dso-page-edit-menu.component';
import { ExportCollectionMenuComponent } from './export-collection/export-collection-menu.component';
import { BulkImportMenuComponent } from './bulk-import/bulk-import-menu.component';
import { EditItemRelationshipsMenuComponent } from './edit-item-relationships/edit-item-relationships-menu.component';
import { ClaimItemMenuComponent } from './claim-item/claim-item-menu.component';
import { StatisticsMenuComponent } from './statistics/statistics-menu.component';
import { SubscriptionMenuComponent } from './subscription/subscription-menu.component';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { ItemVersionMenuComponent } from './item-version/item-version-menu.component';
import { FullItemMenuComponent } from './full-item/full-item-menu.component';
import { OrcidViewPageMenuComponent } from './orcid-view-page/orcid-view-page-menu.component';
import { SharedModule } from '../shared.module';
import { BrowserOnlyDirective } from '../utils/browser-only.directive';

const COMPONENTS = [
  BulkImportMenuComponent,
  DsoPageEditMenuComponent,
  AuditItemMenuComponent,
  ContextMenuComponent,
  EditItemMenuComponent,
  ExportItemMenuComponent,
  ExportCollectionMenuComponent,
  EditItemRelationshipsMenuComponent,
  RequestCorrectionMenuComponent,
  ClaimItemMenuComponent,
  StatisticsMenuComponent,
  SubscriptionMenuComponent,
  ItemVersionMenuComponent,
  FullItemMenuComponent,
  OrcidViewPageMenuComponent
];

const ENTRY_COMPONENTS = [
  BulkImportMenuComponent,
  DsoPageEditMenuComponent,
  AuditItemMenuComponent,
  EditItemMenuComponent,
  ExportItemMenuComponent,
  ExportCollectionMenuComponent,
  EditItemRelationshipsMenuComponent,
  RequestCorrectionMenuComponent,
  ClaimItemMenuComponent,
  StatisticsMenuComponent,
  SubscriptionMenuComponent,
  ItemVersionMenuComponent,
  FullItemMenuComponent,
  OrcidViewPageMenuComponent
];

const MODULE = [
  CommonModule,
  NgbDropdownModule,
  RouterModule,
  TranslateModule,
  SubscriptionsModule,
  SharedModule,
  BrowserOnlyDirective
];
@NgModule({
  imports: [
    MODULE,
  ],
  declarations: [
    COMPONENTS
  ],
  exports: [
    COMPONENTS
  ]
})
export class ContextMenuModule {
  /**
   * NOTE: this method allows to resolve issue with components that using a custom decorator
   * which are not loaded during CSR otherwise
   */
  static withEntryComponents() {
    return {
      ngModule: ContextMenuModule,
      providers: ENTRY_COMPONENTS.map((component) => ({ provide: component }))
    };
  }
}
