import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  NgbAccordionModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { MiradorViewerComponent } from '../item-page/mirador-viewer/mirador-viewer.component';
import { ThemedConfigurationSearchPageComponent } from '../search-page/themed-configuration-search-page.component';
import { ComcolPageHeaderComponent } from '../shared/comcol/comcol-page-header/comcol-page-header.component';
import { ContextMenuModule } from '../shared/context-menu/context-menu.module';
import { ThemedFileDownloadLinkComponent } from '../shared/file-download-link/themed-file-download-link.component';
import { ChipsComponent } from '../shared/form/chips/chips.component';
import { ThemedLoadingComponent } from '../shared/loading/themed-loading.component';
import { MetadataLinkViewComponent } from '../shared/metadata-link-view/metadata-link-view.component';
import { MetricsModule } from '../shared/metric/metrics.module';
import { TruncatableComponent } from '../shared/truncatable/truncatable.component';
import { TruncatablePartComponent } from '../shared/truncatable/truncatable-part/truncatable-part.component';
import { FileSizePipe } from '../shared/utils/file-size-pipe';
import { ThemedThumbnailComponent } from '../thumbnail/themed-thumbnail.component';
import { CrisLayoutComponent } from './cris-layout.component';
import { CrisLayoutLeadingComponent } from './cris-layout-leading/cris-layout-leading.component';
import { CrisLayoutHorizontalComponent } from './cris-layout-loader/cris-layout-horizontal/cris-layout-horizontal.component';
import { CrisLayoutNavbarComponent } from './cris-layout-loader/cris-layout-horizontal/cris-layout-navbar/cris-layout-navbar.component';
import { CrisLayoutLoaderComponent } from './cris-layout-loader/cris-layout-loader.component';
import { CrisLayoutSidebarComponent } from './cris-layout-loader/cris-layout-vertical/cris-layout-sidebar/cris-layout-sidebar.component';
import { CrisLayoutVerticalComponent } from './cris-layout-loader/cris-layout-vertical/cris-layout-vertical.component';
import { CrisLayoutSidebarItemComponent } from './cris-layout-loader/shared/sidebar-item/cris-layout-sidebar-item.component';
import { CrisLayoutCollectionBoxComponent } from './cris-layout-matrix/cris-layout-box-container/boxes/cris-layout-collection-box/cris-layout-collection-box.component';
import { CrisLayoutIIIFViewerBoxComponent } from './cris-layout-matrix/cris-layout-box-container/boxes/iiif-viewer/cris-layout-iiif-viewer-box.component';
import { CrisLayoutMetadataBoxComponent } from './cris-layout-matrix/cris-layout-box-container/boxes/metadata/cris-layout-metadata-box.component';
import { AdvancedAttachmentComponent } from './cris-layout-matrix/cris-layout-box-container/boxes/metadata/rendering-types/advanced-attachment/advanced-attachment.component';
import { AttachmentRenderComponent } from './cris-layout-matrix/cris-layout-box-container/boxes/metadata/rendering-types/advanced-attachment/bitstream-attachment/attachment-render/attachment-render.component';
import { AttachmentRenderingModule } from './cris-layout-matrix/cris-layout-box-container/boxes/metadata/rendering-types/advanced-attachment/bitstream-attachment/attachment-render/attachment-rendering.module';
import { BitstreamAttachmentComponent } from './cris-layout-matrix/cris-layout-box-container/boxes/metadata/rendering-types/advanced-attachment/bitstream-attachment/bitstream-attachment.component';
import { AttachmentComponent } from './cris-layout-matrix/cris-layout-box-container/boxes/metadata/rendering-types/attachment/attachment.component';
import { CrisrefComponent } from './cris-layout-matrix/cris-layout-box-container/boxes/metadata/rendering-types/crisref/crisref.component';
import { DateComponent } from './cris-layout-matrix/cris-layout-box-container/boxes/metadata/rendering-types/date/date.component';
import { HeadingComponent } from './cris-layout-matrix/cris-layout-box-container/boxes/metadata/rendering-types/heading/heading.component';
import { IdentifierComponent } from './cris-layout-matrix/cris-layout-box-container/boxes/metadata/rendering-types/identifier/identifier.component';
import { LinkComponent } from './cris-layout-matrix/cris-layout-box-container/boxes/metadata/rendering-types/link/link.component';
import { LinkAuthorityComponent } from './cris-layout-matrix/cris-layout-box-container/boxes/metadata/rendering-types/link-authority/link-authority.component';
import { LongtextComponent } from './cris-layout-matrix/cris-layout-box-container/boxes/metadata/rendering-types/longtext/longtext.component';
import { InlineComponent } from './cris-layout-matrix/cris-layout-box-container/boxes/metadata/rendering-types/metadataGroup/inline/inline.component';
import { TableComponent } from './cris-layout-matrix/cris-layout-box-container/boxes/metadata/rendering-types/metadataGroup/table/table.component';
import { OrcidComponent } from './cris-layout-matrix/cris-layout-box-container/boxes/metadata/rendering-types/orcid/orcid.component';
import { TagComponent } from './cris-layout-matrix/cris-layout-box-container/boxes/metadata/rendering-types/tag/tag.component';
import { TextComponent } from './cris-layout-matrix/cris-layout-box-container/boxes/metadata/rendering-types/text/text.component';
import { ValuepairComponent } from './cris-layout-matrix/cris-layout-box-container/boxes/metadata/rendering-types/valuepair/valuepair.component';
import { MetadataContainerComponent } from './cris-layout-matrix/cris-layout-box-container/boxes/metadata/row/metadata-container/metadata-container.component';
import { MetadataRenderComponent } from './cris-layout-matrix/cris-layout-box-container/boxes/metadata/row/metadata-container/metadata-render/metadata-render.component';
import { RowComponent } from './cris-layout-matrix/cris-layout-box-container/boxes/metadata/row/row.component';
import { CrisLayoutMetricsBoxComponent } from './cris-layout-matrix/cris-layout-box-container/boxes/metrics/cris-layout-metrics-box.component';
import { MetricRowComponent } from './cris-layout-matrix/cris-layout-box-container/boxes/metrics/metric-row/metric-row.component';
import { CrisLayoutRelationBoxComponent } from './cris-layout-matrix/cris-layout-box-container/boxes/relation/cris-layout-relation-box.component';
import { CrisLayoutBoxContainerComponent } from './cris-layout-matrix/cris-layout-box-container/cris-layout-box-container.component';
import { CrisLayoutMatrixComponent } from './cris-layout-matrix/cris-layout-matrix.component';
import { CrisLayoutLoaderDirective } from './directives/cris-layout-loader.directive';
import { DsDatePipe } from './pipes/ds-date.pipe';

const ENTRY_COMPONENTS = [
  // put only entry components that use custom decorator
  CrisLayoutVerticalComponent,
  CrisLayoutHorizontalComponent,
  CrisLayoutMetadataBoxComponent,
  CrisLayoutCollectionBoxComponent,
  TextComponent,
  HeadingComponent,
  CrisLayoutRelationBoxComponent,
  CrisLayoutIIIFViewerBoxComponent,
  LongtextComponent,
  DateComponent,
  LinkComponent,
  IdentifierComponent,
  CrisrefComponent,
  AttachmentComponent,
  CrisLayoutMetricsBoxComponent,
  TableComponent,
  InlineComponent,
  OrcidComponent,
  ValuepairComponent,
  TagComponent,
  AdvancedAttachmentComponent,
  LinkAuthorityComponent,
];

@NgModule({
  imports: [
    CommonModule,
    ContextMenuModule.withEntryComponents(),
    NgbAccordionModule,
    MetricsModule,
    AttachmentRenderingModule,
    TranslateModule,
    RouterLink,
    MiradorViewerComponent,
    ThemedThumbnailComponent,
    TruncatableComponent,
    TruncatablePartComponent,
    FileSizePipe,
    ThemedConfigurationSearchPageComponent,
    ThemedLoadingComponent,
    ChipsComponent,
    NgbTooltipModule,
    MetadataLinkViewComponent,
    ThemedFileDownloadLinkComponent,
    ComcolPageHeaderComponent,
    ...ENTRY_COMPONENTS,
    CrisLayoutLoaderDirective,
    CrisLayoutComponent,
    CrisLayoutLeadingComponent,
    CrisLayoutLoaderComponent,
    CrisLayoutMatrixComponent,
    CrisLayoutSidebarComponent,
    CrisLayoutNavbarComponent,
    CrisLayoutSidebarItemComponent,
    CrisLayoutBoxContainerComponent,
    MetricRowComponent,
    TableComponent,
    InlineComponent,
    OrcidComponent,
    ValuepairComponent,
    TagComponent,
    DsDatePipe,
    RowComponent,
    MetadataContainerComponent,
    MetadataRenderComponent,
    BitstreamAttachmentComponent,
    AttachmentRenderComponent,
  ],
  exports: [
    CrisLayoutComponent,
    CrisrefComponent,
  ],
})
export class CrisLayoutModule {
  /**
   * NOTE: this method allows to resolve issue with components that using a custom decorator
   * which are not loaded during CSR otherwise
   */
  static withEntryComponents() {
    return {
      ngModule: CrisLayoutModule,
      providers: ENTRY_COMPONENTS.map((component) => ({ provide: component })),
    };
  }
}
