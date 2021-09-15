import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { CrisLayoutLoaderDirective } from './directives/cris-layout-loader.directive';
import { CrisPageLoaderComponent } from './cris-page-loader.component';
import { CrisLayoutDefaultComponent } from './default-layout/cris-layout-default.component';
import { CrisLayoutDefaultSidebarComponent } from './default-layout/sidebar/cris-layout-default-sidebar.component';
import { CrisLayoutDefaultTabComponent } from './default-layout/tab/cris-layout-default-tab.component';
import { CrisLayoutMetadataBoxComponent } from './default-layout/boxes/metadata/cris-layout-metadata-box.component';
import { RowComponent } from './default-layout/boxes/metadata/row/row.component';
import { TextComponent } from './default-layout/boxes/components/text/text.component';
import { HeadingComponent } from './default-layout/boxes/components/heading/heading.component';
import { CrisLayoutSearchBoxComponent } from './default-layout/boxes/search/cris-layout-search-box.component';
import { SearchPageModule } from '../search-page/search-page.module';
import { MyDSpacePageModule } from '../my-dspace-page/my-dspace-page.module';
import { LongtextComponent } from './default-layout/boxes/components/longtext/longtext.component';
import { DateComponent } from './default-layout/boxes/components/date/date.component';
import { DsDatePipe } from './pipes/ds-date.pipe';
import { LinkComponent } from './default-layout/boxes/components/link/link.component';
import { IdentifierComponent } from './default-layout/boxes/components/identifier/identifier.component';
import { CrisrefComponent } from './default-layout/boxes/components/crisref/crisref.component';
import { ThumbnailComponent } from './default-layout/boxes/components/thumbnail/thumbnail.component';
import { AttachmentComponent } from './default-layout/boxes/components/attachment/attachment.component';
import { OrcidSyncQueueComponent } from './custom-layout/orcid-sync-queue/orcid-sync-queue.component';
import { OrcidAuthorizationsComponent } from './custom-layout/orcid-authorizations/orcid-authorizations.component';
import { OrcidSyncSettingsComponent } from './custom-layout/orcid-sync-settings/orcid-sync-settings.component';
import { CrisLayoutMetricsBoxComponent } from './default-layout/boxes/metrics/cris-layout-metrics-box.component';
import { MetricRowComponent } from './default-layout/boxes/components/metric-row/metric-row.component';
import { ContextMenuModule } from '../shared/context-menu/context-menu.module';
import { TableComponent } from './default-layout/boxes/components/table/table.component';
import { InlineComponent } from './default-layout/boxes/components/inline/inline.component';
import { OrcidComponent } from './default-layout/boxes/components/orcid/orcid.component';
import { ValuepairComponent } from './default-layout/boxes/components/valuepair/valuepair.component';
import { CrisLayoutSidebarItemComponent } from './default-layout/sidebar/sidebar-item/cris-layout-sidebar-item.component';
import { TagComponent } from './default-layout/boxes/components/tag/tag.component';

const ENTRY_COMPONENTS = [
  // put only entry components that use custom decorator
  CrisLayoutDefaultComponent,
  CrisLayoutDefaultTabComponent,
  CrisLayoutMetadataBoxComponent,
  CrisLayoutMetricsBoxComponent,
  CrisLayoutSearchBoxComponent,
  TextComponent,
  OrcidComponent,
  HeadingComponent,
  LongtextComponent,
  DateComponent,
  LinkComponent,
  IdentifierComponent,
  CrisrefComponent,
  ThumbnailComponent,
  AttachmentComponent,
  OrcidSyncSettingsComponent,
  OrcidSyncQueueComponent,
  OrcidAuthorizationsComponent,
  TagComponent,
  ValuepairComponent,
];
@NgModule({
  declarations: [
    CrisLayoutLoaderDirective,
    CrisPageLoaderComponent,
    CrisLayoutDefaultSidebarComponent,
    CrisLayoutDefaultComponent,
    CrisLayoutDefaultTabComponent,
    CrisLayoutMetadataBoxComponent,
    CrisLayoutMetricsBoxComponent,
    RowComponent,
    TextComponent,
    OrcidComponent,
    HeadingComponent,
    CrisLayoutSearchBoxComponent,
    LongtextComponent,
    DateComponent,
    DsDatePipe,
    LinkComponent,
    IdentifierComponent,
    CrisrefComponent,
    ThumbnailComponent,
    AttachmentComponent,
    OrcidSyncSettingsComponent,
    OrcidSyncQueueComponent,
    OrcidAuthorizationsComponent,
    MetricRowComponent,
    TableComponent,
    InlineComponent,
    CrisLayoutSidebarItemComponent,
    TagComponent,
    ValuepairComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    SearchPageModule,
    MyDSpacePageModule,
    ContextMenuModule,
  ],
  exports: [
    CrisPageLoaderComponent,
    CrisLayoutDefaultComponent,
    CrisLayoutDefaultTabComponent,
    CrisLayoutMetadataBoxComponent
  ]
})
export class LayoutModule {
  /**
   * NOTE: this method allows to resolve issue with components that using a custom decorator
   * which are not loaded during CSR otherwise
   */
  static withEntryComponents() {
    return {
      ngModule: LayoutModule,
      providers: ENTRY_COMPONENTS.map((component) => ({provide: component}))
    };
  }
}
