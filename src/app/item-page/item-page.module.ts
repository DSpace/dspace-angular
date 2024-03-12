import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

import { DsoPageModule } from '../shared/dso-page/dso-page.module';
import { UploadModule } from '../shared/upload/upload.module';
import { StatisticsModule } from '../statistics/statistics.module';
import { ItemAlertsComponent } from './alerts/item-alerts.component';
import { ThemedItemAlertsComponent } from './alerts/themed-item-alerts.component';
import { BitstreamRequestACopyPageComponent } from './bitstreams/request-a-copy/bitstream-request-a-copy-page.component';
import { UploadBitstreamComponent } from './bitstreams/upload/upload-bitstream.component';
import { EditItemPageModule } from './edit-item-page/edit-item-page.module';
import { CollectionsComponent } from './field-components/collections/collections.component';
import { MetadataUriValuesComponent } from './field-components/metadata-uri-values/metadata-uri-values.component';
import { FullFileSectionComponent } from './full/field-components/file-section/full-file-section.component';
import { ThemedFullFileSectionComponent } from './full/field-components/file-section/themed-full-file-section.component';
import { FullItemPageComponent } from './full/full-item-page.component';
import { ThemedFullItemPageComponent } from './full/themed-full-item-page.component';
import { ItemSharedModule } from './item-shared.module';
import { MediaViewerComponent } from './media-viewer/media-viewer.component';
import { MediaViewerImageComponent } from './media-viewer/media-viewer-image/media-viewer-image.component';
import { ThemedMediaViewerImageComponent } from './media-viewer/media-viewer-image/themed-media-viewer-image.component';
import { MediaViewerVideoComponent } from './media-viewer/media-viewer-video/media-viewer-video.component';
import { ThemedMediaViewerVideoComponent } from './media-viewer/media-viewer-video/themed-media-viewer-video.component';
import { ThemedMediaViewerComponent } from './media-viewer/themed-media-viewer.component';
import { MiradorViewerComponent } from './mirador-viewer/mirador-viewer.component';
import { OrcidAuthComponent } from './orcid-page/orcid-auth/orcid-auth.component';
import { OrcidPageComponent } from './orcid-page/orcid-page.component';
import { OrcidQueueComponent } from './orcid-page/orcid-queue/orcid-queue.component';
import { OrcidSyncSettingsComponent } from './orcid-page/orcid-sync-settings/orcid-sync-settings.component';
import { AbstractIncrementalListComponent } from './simple/abstract-incremental-list/abstract-incremental-list.component';
import { FileSectionComponent } from './simple/field-components/file-section/file-section.component';
import { ThemedFileSectionComponent } from './simple/field-components/file-section/themed-file-section.component';
import { ItemPageAbstractFieldComponent } from './simple/field-components/specific-field/abstract/item-page-abstract-field.component';
import { ItemPageAuthorFieldComponent } from './simple/field-components/specific-field/author/item-page-author-field.component';
import { ItemPageDateFieldComponent } from './simple/field-components/specific-field/date/item-page-date-field.component';
import { ItemPageFieldComponent } from './simple/field-components/specific-field/item-page-field.component';
import { ItemPageUriFieldComponent } from './simple/field-components/specific-field/uri/item-page-uri-field.component';
import { ItemPageComponent } from './simple/item-page.component';
import { ItemComponent } from './simple/item-types/shared/item.component';
import { NotifyRequestsStatusComponent } from './simple/notify-requests-status/notify-requests-status-component/notify-requests-status.component';
import { RequestStatusAlertBoxComponent } from './simple/notify-requests-status/request-status-alert-box/request-status-alert-box.component';
import { QaEventNotificationComponent } from './simple/qa-event-notification/qa-event-notification.component';
import { ThemedItemPageComponent } from './simple/themed-item-page.component';
import { VersionPageComponent } from './version-page/version-page/version-page.component';
import { ItemVersionsModule } from './versions/item-versions.module';


const DECLARATIONS = [
  FileSectionComponent,
  ThemedFileSectionComponent,
  ItemPageComponent,
  ThemedItemPageComponent,
  FullItemPageComponent,
  ThemedFullItemPageComponent,
  MetadataUriValuesComponent,
  ItemPageAuthorFieldComponent,
  ItemPageDateFieldComponent,
  ItemPageAbstractFieldComponent,
  ItemPageUriFieldComponent,
  ItemPageFieldComponent,
  CollectionsComponent,
  FullFileSectionComponent,
  ThemedFullFileSectionComponent,
  ItemComponent,
  UploadBitstreamComponent,
  AbstractIncrementalListComponent,
  MediaViewerComponent,
  ThemedMediaViewerComponent,
  MediaViewerVideoComponent,
  ThemedMediaViewerVideoComponent,
  MediaViewerImageComponent,
  ThemedMediaViewerImageComponent,
  MiradorViewerComponent,
  VersionPageComponent,
  OrcidPageComponent,
  OrcidAuthComponent,
  OrcidSyncSettingsComponent,
  OrcidQueueComponent,
  ItemAlertsComponent,
  ThemedItemAlertsComponent,
  BitstreamRequestACopyPageComponent,
  QaEventNotificationComponent,
  NotifyRequestsStatusComponent,
  RequestStatusAlertBoxComponent,
];

@NgModule({
  imports: [
    CommonModule,
    EditItemPageModule,
    ItemVersionsModule,
    ItemSharedModule,
    StatisticsModule.forRoot(),
    NgxGalleryModule,
    NgbAccordionModule,
    UploadModule,
    DsoPageModule,
    ...DECLARATIONS,
  ],
  exports: [
    ...DECLARATIONS,
  ],
})
export class ItemPageModule {

}
