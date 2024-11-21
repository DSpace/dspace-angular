import { AdvancedAttachmentComponent } from './advanced-attachment/advanced-attachment.component';
import { AttachmentComponent } from './attachment/attachment.component';
import { CrisrefComponent } from './crisref/crisref.component';
import { DateComponent } from './date/date.component';
import { FieldRenderingType } from './field-rendering-type';
import { HeadingComponent } from './heading/heading.component';
import { IdentifierComponent } from './identifier/identifier.component';
import { LinkComponent } from './link/link.component';
import { LinkAuthorityComponent } from './link-authority/link-authority.component';
import { LongtextComponent } from './longtext/longtext.component';
import { InlineComponent } from './metadataGroup/inline/inline.component';
import { TableComponent } from './metadataGroup/table/table.component';
import { OrcidComponent } from './orcid/orcid.component';
import { MetadataBoxFieldRenderOptions } from './rendering-type.model';
import { TagComponent } from './tag/tag.component';
import { TextComponent } from './text/text.component';
import { ThumbnailRenderingComponent } from './thumbnail/thumbnail.component';
import { ValuepairComponent } from './valuepair/valuepair.component';

export const layoutBoxesMap = new Map<FieldRenderingType, MetadataBoxFieldRenderOptions>([
  [FieldRenderingType.TEXT, { componentRef: TextComponent, structured: false } as MetadataBoxFieldRenderOptions],
  [FieldRenderingType.HEADING, { componentRef: HeadingComponent, structured: false } as MetadataBoxFieldRenderOptions],
  [FieldRenderingType.LONGTEXT, {
    componentRef: LongtextComponent,
    structured: false,
  } as MetadataBoxFieldRenderOptions],
  [FieldRenderingType.DATE, { componentRef: DateComponent, structured: false } as MetadataBoxFieldRenderOptions],
  [FieldRenderingType.LINK, { componentRef: LinkComponent, structured: false } as MetadataBoxFieldRenderOptions],
  [FieldRenderingType.IDENTIFIER, {
    componentRef: IdentifierComponent,
    structured: false,
  } as MetadataBoxFieldRenderOptions],
  [FieldRenderingType.CRISREF, { componentRef: CrisrefComponent, structured: false } as MetadataBoxFieldRenderOptions],
  [FieldRenderingType.THUMBNAIL, {
    componentRef: ThumbnailRenderingComponent,
    structured: true,
  } as MetadataBoxFieldRenderOptions],
  [FieldRenderingType.ATTACHMENT, {
    componentRef: AttachmentComponent,
    structured: true,
  } as MetadataBoxFieldRenderOptions],
  [FieldRenderingType.TABLE, { componentRef: TableComponent, structured: true } as MetadataBoxFieldRenderOptions],
  [FieldRenderingType.INLINE, { componentRef: InlineComponent, structured: true } as MetadataBoxFieldRenderOptions],
  [FieldRenderingType.ORCID, { componentRef: OrcidComponent, structured: false } as MetadataBoxFieldRenderOptions],
  [FieldRenderingType.TAG, { componentRef: TagComponent, structured: true } as MetadataBoxFieldRenderOptions],
  [FieldRenderingType.VALUEPAIR, {
    componentRef: ValuepairComponent,
    structured: false,
  } as MetadataBoxFieldRenderOptions],
  [FieldRenderingType.ADVANCEDATTACHMENT, {
    componentRef: AdvancedAttachmentComponent,
    structured: true,
  } as MetadataBoxFieldRenderOptions],
  [FieldRenderingType.AUTHORITYLINK, {
    componentRef: LinkAuthorityComponent,
    structured: false,
  } as MetadataBoxFieldRenderOptions],
]);
