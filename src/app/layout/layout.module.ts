import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { CrisLayoutLoaderDirective } from './directives/cris-layout-loader.directive';
import { CrisPageLoaderComponent } from './cris-page-loader.component';
import { CrisLayoutDefaultComponent } from './default-layout/cris-layout-default.component';
import { CrisLayoutDefaultSidebarComponent } from './default-layout/sidebar/cris-layout-default-sidebar.component';
import { CrisLayoutDefaultTabComponent } from './default-layout/tab/cris-layout-default-tab.component';
import { CrisLayoutMetadataBoxComponent } from './default-layout/boxes/metadata/cris-layout-metadata-box.component';
import { RowComponent } from './default-layout/boxes/components/row/row.component';
import { TextComponent } from './default-layout/boxes/components/text/text.component';
import { HeadingComponent } from './default-layout/boxes/components/heading/heading.component';
import { CrisLayoutSearchBoxComponent } from './default-layout/boxes/search/cris-layout-search-box.component';
import { SearchPageModule } from '../+search-page/search-page.module';
import { MyDSpacePageModule } from '../+my-dspace-page/my-dspace-page.module';
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
import { MetricComponent } from './default-layout/boxes/components/metric/metric.component';
import { ContextMenuModule } from '../shared/context-menu/context-menu.module';

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
    MetricComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    SearchPageModule,
    MyDSpacePageModule,
    ContextMenuModule
  ],
  entryComponents: [
    CrisLayoutDefaultComponent,
    CrisLayoutDefaultTabComponent,
    CrisLayoutMetadataBoxComponent,
    CrisLayoutMetricsBoxComponent,
    CrisLayoutSearchBoxComponent,
    TextComponent,
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
    OrcidAuthorizationsComponent
  ],
  exports: [
    CrisPageLoaderComponent,
    CrisLayoutDefaultComponent,
    CrisLayoutDefaultTabComponent,
    CrisLayoutMetadataBoxComponent
  ]
})
export class LayoutModule { }
