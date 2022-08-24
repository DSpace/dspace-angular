import { Component, Inject, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { FieldRenderingType, MetadataBoxFieldRendering } from '../metadata-box.decorator';
import { BitstreamDataService } from '../../../../../../../core/data/bitstream-data.service';
import { Item } from '../../../../../../../core/shared/item.model';
import { LayoutField } from '../../../../../../../core/layout/models/box.model';
import { AttachmentComponent } from '../attachment/attachment.component';
import { AdvancedAttachmentElementType } from '../../../../../../../../config/advanced-attachment-rendering.config';
import { environment } from '../../../../../../../../environments/environment';

@Component({
  selector: 'ds-advanced-attachment',
  templateUrl: './advanced-attachment.component.html',
  styleUrls: ['./advanced-attachment.component.scss']
})
/**
 * This component renders the attachment with an advanced layout.
 */
@MetadataBoxFieldRendering(FieldRenderingType.ADVANCEDATTACHMENT, true)
export class AdvancedAttachmentComponent extends AttachmentComponent implements OnInit {

  /**
   * Environment variables configuring the fields to be viewed
   */
  envMetadata = environment.advancedAttachmentRendering.metadata;

  /**
   * Environment variables configuring pagination
   */
  envPagination = environment.advancedAttachmentRendering.pagination;

  /**
   * Configuration type enum
   */
  AdvancedAttachmentElementType = AdvancedAttachmentElementType;

  constructor(
    @Inject('fieldProvider') public fieldProvider: LayoutField,
    @Inject('itemProvider') public itemProvider: Item,
    @Inject('renderingSubTypeProvider') public renderingSubTypeProvider: string,
    protected bitstreamDataService: BitstreamDataService,
    protected translateService: TranslateService
  ) {
    super(fieldProvider, itemProvider, renderingSubTypeProvider, bitstreamDataService, translateService);
  }

}
