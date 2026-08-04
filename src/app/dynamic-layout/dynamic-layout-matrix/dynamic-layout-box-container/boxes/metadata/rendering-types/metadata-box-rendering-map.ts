import { AdvancedAttachmentComponent } from './advanced-attachment/advanced-attachment.component';
import { AttachmentComponent } from './attachment/attachment.component';
import { CcLicenseLargeComponent } from './cc-license-large/cc-license-large.component';
import { CcLicenseSmallComponent } from './cc-license-small/cc-license-small.component';
import { DateComponent } from './date/date.component';
import { DynamicrefComponent } from './dynamicref/dynamicref.component';
import { FieldRenderingType } from './field-rendering-type';
import { HeadingComponent } from './heading/heading.component';
import { HtmlComponent } from './html/html.component';
import { IdentifierComponent } from './identifier/identifier.component';
import { LinkComponent } from './link/link.component';
import { LinkAuthorityComponent } from './link-authority/link-authority.component';
import { LonghtmlComponent } from './longhtml/longhtml.component';
import { LongtextComponent } from './longtext/longtext.component';
import { InlineComponent } from './metadataGroup/inline/inline.component';
import { TableComponent } from './metadataGroup/table/table.component';
import { OrcidComponent } from './orcid/orcid.component';
import { OsmapComponent } from './osmap/osmap.component';
import { MetadataBoxFieldRenderOptions } from './rendering-type.directive';
import { TagComponent } from './tag/tag.component';
import { TextComponent } from './text/text.component';
import { ThumbnailRenderingComponent } from './thumbnail/thumbnail.component';
import { ValuepairComponent } from './valuepair/valuepair.component';

export const layoutBoxesMap = new Map<FieldRenderingType, MetadataBoxFieldRenderOptions>([
  [FieldRenderingType.TEXT, { componentRef: TextComponent }],
  [FieldRenderingType.HEADING, { componentRef: HeadingComponent }],
  [FieldRenderingType.LONGTEXT, { componentRef: LongtextComponent }],
  [FieldRenderingType.DATE, { componentRef: DateComponent }],
  [FieldRenderingType.LINK, { componentRef: LinkComponent }],
  [FieldRenderingType.IDENTIFIER, { componentRef: IdentifierComponent }],
  [FieldRenderingType.DYNAMICREF, { componentRef: DynamicrefComponent }],
  [FieldRenderingType.THUMBNAIL, { componentRef: ThumbnailRenderingComponent }],
  [FieldRenderingType.ATTACHMENT, { componentRef: AttachmentComponent }],
  [FieldRenderingType.TABLE, { componentRef: TableComponent }],
  [FieldRenderingType.INLINE, { componentRef: InlineComponent }],
  [FieldRenderingType.ORCID, { componentRef: OrcidComponent }],
  [FieldRenderingType.TAG, { componentRef: TagComponent }],
  [FieldRenderingType.VALUEPAIR, { componentRef: ValuepairComponent }],
  [FieldRenderingType.ADVANCEDATTACHMENT, { componentRef: AdvancedAttachmentComponent }],
  [FieldRenderingType.AUTHORITYLINK, { componentRef: LinkAuthorityComponent }],
  [FieldRenderingType.HTML, { componentRef: HtmlComponent }],
  [FieldRenderingType.LONGHTML, { componentRef: LonghtmlComponent }],
  [FieldRenderingType.CCLICENSEFULL, { componentRef: CcLicenseLargeComponent }],
  [FieldRenderingType.CCLICENSE, { componentRef: CcLicenseSmallComponent }],
  [FieldRenderingType.OSMAP, { componentRef: OsmapComponent }],
]);
