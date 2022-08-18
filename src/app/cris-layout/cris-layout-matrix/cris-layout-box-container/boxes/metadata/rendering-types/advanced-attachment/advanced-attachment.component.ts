import { AdvancedAttachmentElementType } from '../../../../../../../../config/advanced-attachment-rendering.config';
import { environment } from '../../../../../../../../environments/environment';
import { Component, Inject, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { FieldRenderingType, MetadataBoxFieldRendering } from '../metadata-box.decorator';
import { BitstreamRenderingModelComponent } from '../bitstream-rendering-model';
import { BitstreamDataService } from '../../../../../../../core/data/bitstream-data.service';
import { Bitstream } from '../../../../../../../core/shared/bitstream.model';
import { Item } from '../../../../../../../core/shared/item.model';
import { LayoutField } from '../../../../../../../core/layout/models/box.model';
import { FindListOptions } from '../../../../../../../core/data/request.models';

@Component({
  selector: 'ds-advanced-attachment',
  templateUrl: './advanced-attachment.component.html',
  styleUrls: ['./advanced-attachment.component.scss']
})
/**
 * This component renders the attachment with an advanced layout.
 */
@MetadataBoxFieldRendering(FieldRenderingType.ADVANCEDATTACHMENT, true)
export class AdvancedAttachmentComponent extends BitstreamRenderingModelComponent implements OnInit {

  /**
   * List of bitstreams to show in the list
   */
  bitstreams$: Observable<Bitstream[]>;

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

  /**
  * On init check if we want to show the attachment list with pagination or show all attachments
  */
  ngOnInit() {
    this.pageOptions = Object.assign(new FindListOptions(), {
      elementsPerPage: this.envPagination.elementsPerPage,
      currentPage: 1
    });
    if (this.envPagination.enabled) {
      this.startWithPagination();
      this.getVisibleBitstreams();
    } else {
      this.startWithAll();
    }
  }

  /**
   * Start the list with all the attachments
   */
  startWithAll() {
    this.bitstreams$ = this.getBitstreams();
  }

  /**
   * Get the bitstreams until a specific page
   */
  getVisibleBitstreams() {
    this.bitstreams$ = this.getPaginatedBitstreams();
  }

}
