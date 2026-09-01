import { NgModule } from '@angular/core';

import { ItemVersionsComponent } from '../item-page/versions/item-versions.component';
import { DynamicLayoutHorizontalComponent } from './dynamic-layout-loader/dynamic-layout-horizontal/dynamic-layout-horizontal.component';
import { DynamicLayoutVerticalComponent } from './dynamic-layout-loader/dynamic-layout-vertical/dynamic-layout-vertical.component';
import { DynamicLayoutCollectionBoxComponent } from './dynamic-layout-matrix/dynamic-layout-box-container/boxes/dynamic-layout-collection-box/dynamic-layout-collection-box.component';
import { DynamicLayoutIiifViewerBoxComponent } from './dynamic-layout-matrix/dynamic-layout-box-container/boxes/iiif-viewer/dynamic-layout-iiif-viewer-box.component';
import { DynamicLayoutMetadataBoxComponent } from './dynamic-layout-matrix/dynamic-layout-box-container/boxes/metadata/dynamic-layout-metadata-box.component';
import { AdvancedAttachmentComponent } from './dynamic-layout-matrix/dynamic-layout-box-container/boxes/metadata/rendering-types/advanced-attachment/advanced-attachment.component';
import { FileDownloadButtonComponent } from './dynamic-layout-matrix/dynamic-layout-box-container/boxes/metadata/rendering-types/advanced-attachment/bitstream-attachment/attachment-render/types/file-download-button/file-download-button.component';
import { AttachmentComponent } from './dynamic-layout-matrix/dynamic-layout-box-container/boxes/metadata/rendering-types/attachment/attachment.component';
import { CcLicenseLargeComponent } from './dynamic-layout-matrix/dynamic-layout-box-container/boxes/metadata/rendering-types/cc-license-large/cc-license-large.component';
import { CcLicenseSmallComponent } from './dynamic-layout-matrix/dynamic-layout-box-container/boxes/metadata/rendering-types/cc-license-small/cc-license-small.component';
import { DateComponent } from './dynamic-layout-matrix/dynamic-layout-box-container/boxes/metadata/rendering-types/date/date.component';
import { DynamicrefComponent } from './dynamic-layout-matrix/dynamic-layout-box-container/boxes/metadata/rendering-types/dynamicref/dynamicref.component';
import { HeadingComponent } from './dynamic-layout-matrix/dynamic-layout-box-container/boxes/metadata/rendering-types/heading/heading.component';
import { HtmlComponent } from './dynamic-layout-matrix/dynamic-layout-box-container/boxes/metadata/rendering-types/html/html.component';
import { IdentifierComponent } from './dynamic-layout-matrix/dynamic-layout-box-container/boxes/metadata/rendering-types/identifier/identifier.component';
import { LinkComponent } from './dynamic-layout-matrix/dynamic-layout-box-container/boxes/metadata/rendering-types/link/link.component';
import { LinkAuthorityComponent } from './dynamic-layout-matrix/dynamic-layout-box-container/boxes/metadata/rendering-types/link-authority/link-authority.component';
import { LonghtmlComponent } from './dynamic-layout-matrix/dynamic-layout-box-container/boxes/metadata/rendering-types/longhtml/longhtml.component';
import { LongtextComponent } from './dynamic-layout-matrix/dynamic-layout-box-container/boxes/metadata/rendering-types/longtext/longtext.component';
import { InlineComponent } from './dynamic-layout-matrix/dynamic-layout-box-container/boxes/metadata/rendering-types/metadataGroup/inline/inline.component';
import { TableComponent } from './dynamic-layout-matrix/dynamic-layout-box-container/boxes/metadata/rendering-types/metadataGroup/table/table.component';
import { OrcidComponent } from './dynamic-layout-matrix/dynamic-layout-box-container/boxes/metadata/rendering-types/orcid/orcid.component';
import { OsmapComponent } from './dynamic-layout-matrix/dynamic-layout-box-container/boxes/metadata/rendering-types/osmap/osmap.component';
import { TagComponent } from './dynamic-layout-matrix/dynamic-layout-box-container/boxes/metadata/rendering-types/tag/tag.component';
import { TextComponent } from './dynamic-layout-matrix/dynamic-layout-box-container/boxes/metadata/rendering-types/text/text.component';
import { ThumbnailRenderingComponent } from './dynamic-layout-matrix/dynamic-layout-box-container/boxes/metadata/rendering-types/thumbnail/thumbnail.component';
import { ValuepairComponent } from './dynamic-layout-matrix/dynamic-layout-box-container/boxes/metadata/rendering-types/valuepair/valuepair.component';
import { DynamicLayoutRelationBoxComponent } from './dynamic-layout-matrix/dynamic-layout-box-container/boxes/relation/dynamic-layout-relation-box.component';

/**
 * Metadata field rendering-type components that register themselves through the
 * {@link metadataBoxFieldRendering} decorator.
 *
 * They are instantiated dynamically (via {@link getMetadataBoxFieldRenderOptionsFn}), so they are
 * never referenced statically in an `imports` array. Listing them here guarantees their classes are
 * evaluated - and therefore their decorators run - when the application bootstraps (including SSR).
 */
const RENDERING_TYPE_ENTRY_COMPONENTS = [
  TextComponent,
  HeadingComponent,
  LongtextComponent,
  DateComponent,
  LinkComponent,
  IdentifierComponent,
  DynamicrefComponent,
  ThumbnailRenderingComponent,
  AttachmentComponent,
  TableComponent,
  InlineComponent,
  OrcidComponent,
  TagComponent,
  ValuepairComponent,
  AdvancedAttachmentComponent,
  LinkAuthorityComponent,
  HtmlComponent,
  LonghtmlComponent,
  CcLicenseLargeComponent,
  CcLicenseSmallComponent,
  OsmapComponent,
];

/**
 * Components that register themselves through the {@link renderDynamicLayoutBoxFor} and
 * {@link dynamicLayoutPage} and {@link attachmentTypeRendering} decorators.
 *
 * They are dynamically instantiated (via {@link getDynamicLayoutBox} /
 * {@link getDynamicLayoutPage} / {@link getAttachmentTypeRendering}), so they are never referenced statically in an
 * `imports` array. Listing them here guarantees their classes are evaluated -
 * and therefore their decorators run - when the application bootstraps.
 */
const ENTRY_COMPONENTS = [
  DynamicLayoutHorizontalComponent,
  DynamicLayoutVerticalComponent,
  DynamicLayoutMetadataBoxComponent,
  DynamicLayoutRelationBoxComponent,
  DynamicLayoutCollectionBoxComponent,
  DynamicLayoutIiifViewerBoxComponent,
  ItemVersionsComponent,
  FileDownloadButtonComponent,
  ...RENDERING_TYPE_ENTRY_COMPONENTS,
];

@NgModule({
  imports: [
    ...ENTRY_COMPONENTS,
  ],
  exports: [
    ...ENTRY_COMPONENTS,
  ],
})
export class DynamicLayoutModule {
  /**
   * NOTE: this method allows to resolve the issue with the dynamic layout components using a custom
   * decorator ({@link renderDynamicLayoutBoxFor} / {@link dynamicLayoutPage} / {@link attachmentTypeRendering}) which are not loaded during SSR otherwise.
   */
  static withEntryComponents() {
    return {
      ngModule: DynamicLayoutModule,
      providers: ENTRY_COMPONENTS.map((component) => ({ provide: component })),
    };
  }
}
