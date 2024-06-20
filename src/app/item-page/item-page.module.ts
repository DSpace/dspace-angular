import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';

import { ItemPageComponent } from './simple/item-page.component';
import { ItemPageRoutingModule } from './item-page-routing.module';
import { MetadataUriValuesComponent } from './field-components/metadata-uri-values/metadata-uri-values.component';
import {
  ItemPageAuthorFieldComponent
} from './simple/field-components/specific-field/author/item-page-author-field.component';
import {
  ItemPageDateFieldComponent
} from './simple/field-components/specific-field/date/item-page-date-field.component';
import {
  ItemPageAbstractFieldComponent
} from './simple/field-components/specific-field/abstract/item-page-abstract-field.component';
import {
  ItemPageCitationFieldComponent
} from './simple/field-components/specific-field/citation/item-page-citation.component';
import { ItemPageUriFieldComponent } from './simple/field-components/specific-field/uri/item-page-uri-field.component';
import { ItemPageFieldComponent } from './simple/field-components/specific-field/item-page-field.component';
import { CollectionsComponent } from './field-components/collections/collections.component';
import { FullItemPageComponent } from './full/full-item-page.component';
import { FullFileSectionComponent } from './full/field-components/file-section/full-file-section.component';
import { PublicationComponent } from './simple/item-types/publication/publication.component';
import { ItemComponent } from './simple/item-types/shared/item.component';
import { EditItemPageModule } from './edit-item-page/edit-item-page.module';
import { UploadBitstreamComponent } from './bitstreams/upload/upload-bitstream.component';
import { StatisticsModule } from '../statistics/statistics.module';
import {
  AbstractIncrementalListComponent
} from './simple/abstract-incremental-list/abstract-incremental-list.component';
import { UntypedItemComponent } from './simple/item-types/untyped-item/untyped-item.component';
import { JournalEntitiesModule } from '../entity-groups/journal-entities/journal-entities.module';
import { ResearchEntitiesModule } from '../entity-groups/research-entities/research-entities.module';
import { ThemedItemPageComponent } from './simple/themed-item-page.component';
import { ThemedFullItemPageComponent } from './full/themed-full-item-page.component';
import { MediaViewerComponent } from './media-viewer/media-viewer.component';
import { ThemedMediaViewerComponent } from './media-viewer/themed-media-viewer.component';
import { MediaViewerVideoComponent } from './media-viewer/media-viewer-video/media-viewer-video.component';
import { ThemedMediaViewerVideoComponent } from './media-viewer/media-viewer-video/themed-media-viewer-video.component';
import { MediaViewerImageComponent } from './media-viewer/media-viewer-image/media-viewer-image.component';
import { ThemedMediaViewerImageComponent } from './media-viewer/media-viewer-image/themed-media-viewer-image.component';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import { MiradorViewerComponent } from './mirador-viewer/mirador-viewer.component';
import { VersionPageComponent } from './version-page/version-page/version-page.component';
import { ThemedFileSectionComponent } from './simple/field-components/file-section/themed-file-section.component';
import { OrcidAuthComponent } from './orcid-page/orcid-auth/orcid-auth.component';
import { OrcidPageComponent } from './orcid-page/orcid-page.component';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { OrcidSyncSettingsComponent } from './orcid-page/orcid-sync-settings/orcid-sync-settings.component';
import { OrcidQueueComponent } from './orcid-page/orcid-queue/orcid-queue.component';
import { UploadModule } from '../shared/upload/upload.module';
import { ResultsBackButtonModule } from '../shared/results-back-button/results-back-button.module';
import { ItemAlertsComponent } from './alerts/item-alerts.component';
import { ItemVersionsModule } from './versions/item-versions.module';
import { BitstreamRequestACopyPageComponent } from './bitstreams/request-a-copy/bitstream-request-a-copy-page.component';
import { FileSectionComponent } from './simple/field-components/file-section/file-section.component';
import { ItemSharedModule } from './item-shared.module';
import { DsoPageModule } from '../shared/dso-page/dso-page.module';
import { ThemedItemAlertsComponent } from './alerts/themed-item-alerts.component';
import {
  ThemedFullFileSectionComponent
} from './full/field-components/file-section/themed-full-file-section.component';
import { TombstoneComponent } from './tombstone/tombstone.component';
import { ReplacedTombstoneComponent } from './tombstone/replaced-tombstone/replaced-tombstone.component';
import { WithdrawnTombstoneComponent } from './tombstone/withdrawn-tombstone/withdrawn-tombstone.component';
import { ClarinLicenseInfoComponent } from './clarin-license-info/clarin-license-info.component';
import { ClarinRefBoxComponent } from './clarin-ref-box/clarin-ref-box.component';
import { ClarinRefCitationComponent } from './clarin-ref-citation/clarin-ref-citation.component';
import { ClarinRefFeaturedServicesComponent } from './clarin-ref-featured-services/clarin-ref-featured-services.component';
import { ClarinRefCitationModalComponent } from './clarin-ref-citation-modal/clarin-ref-citation-modal.component';
import { ClarinMatomoStatisticsComponent } from './clarin-matomo-statistics/clarin-matomo-statistics.component';
import { ClarinStatisticsButtonComponent } from './clarin-statistics-button/clarin-statistics-button.component';
import { NgChartsModule } from 'ng2-charts';
import { ClarinGenericItemFieldComponent } from './simple/field-components/clarin-generic-item-field/clarin-generic-item-field.component';
import { ClarinCollectionsItemFieldComponent } from './simple/field-components/clarin-collections-item-field/clarin-collections-item-field.component';
import { ClarinFilesItemFieldComponent } from './simple/field-components/clarin-files-item-field/clarin-files-item-field.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {PreviewSectionComponent} from './simple/field-components/preview-section/preview-section.component';
import {
  FileDescriptionComponent
} from './simple/field-components/preview-section/file-description/file-description.component';
import {
  FileTreeViewComponent
} from './simple/field-components/preview-section/file-description/file-tree-view/file-tree-view.component';
import { ClarinSponsorItemFieldComponent } from './simple/field-components/clarin-sponsor-item-field/clarin-sponsor-item-field.component';
import { ClarinIdentifierItemFieldComponent } from './simple/field-components/clarin-identifier-item-field/clarin-identifier-item-field.component';
import { ClarinDateItemFieldComponent } from './simple/field-components/clarin-date-item-field/clarin-date-item-field.component';
import { ClarinDescriptionItemFieldComponent } from './simple/field-components/clarin-description-item-field/clarin-description-item-field.component';
import { ClarinFilesSectionComponent } from './clarin-files-section/clarin-files-section.component';

const ENTRY_COMPONENTS = [
  // put only entry components that use custom decorator
  PublicationComponent,
  UntypedItemComponent
];

const DECLARATIONS = [
  FileSectionComponent,
  ThemedFileSectionComponent,
  ItemPageComponent,
  ThemedItemPageComponent,
  FullItemPageComponent,
  ThemedFullItemPageComponent,
  MetadataUriValuesComponent,
  ItemPageAuthorFieldComponent,
  ItemPageCitationFieldComponent,
  ItemPageDateFieldComponent,
  ItemPageAbstractFieldComponent,
  ItemPageUriFieldComponent,
  ItemPageFieldComponent,
  CollectionsComponent,
  FullFileSectionComponent,
  ThemedFullFileSectionComponent,
  PublicationComponent,
  UntypedItemComponent,
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
  TombstoneComponent,
  ReplacedTombstoneComponent,
  WithdrawnTombstoneComponent,
  ClarinLicenseInfoComponent,
  ClarinRefBoxComponent,
  ClarinRefCitationComponent,
  ClarinRefFeaturedServicesComponent,
  ClarinRefCitationModalComponent,
  ClarinMatomoStatisticsComponent,
  ClarinStatisticsButtonComponent,
  ClarinGenericItemFieldComponent,
  ClarinCollectionsItemFieldComponent,
  ClarinFilesItemFieldComponent,
  ClarinSponsorItemFieldComponent,
  PreviewSectionComponent,
  FileDescriptionComponent,
  FileTreeViewComponent,
  ClarinIdentifierItemFieldComponent,
  ClarinDateItemFieldComponent,
  ClarinDescriptionItemFieldComponent,
  ClarinFilesSectionComponent
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule.withEntryComponents(),
    ItemPageRoutingModule,
    EditItemPageModule,
    ItemVersionsModule,
    ItemSharedModule,
    StatisticsModule.forRoot(),
    JournalEntitiesModule.withEntryComponents(),
    ResearchEntitiesModule.withEntryComponents(),
    NgxGalleryModule,
    NgbAccordionModule,
    ResultsBackButtonModule,
    UploadModule,
    DsoPageModule,
    NgChartsModule,
    NgbModule
  ],
  declarations: [
    ...DECLARATIONS,
  ],
  exports: [
    ...DECLARATIONS,
  ]
})
export class ItemPageModule {
  /**
   * NOTE: this method allows to resolve issue with components that using a custom decorator
   * which are not loaded during SSR otherwise
   */
  static withEntryComponents() {
    return {
      ngModule: ItemPageModule,
      providers: ENTRY_COMPONENTS.map((component) => ({provide: component}))
    };
  }

}
