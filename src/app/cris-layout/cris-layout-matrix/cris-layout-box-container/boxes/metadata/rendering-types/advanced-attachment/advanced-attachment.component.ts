import { Type } from './../../../../../../../../config/advanced-attachment.config';
import { environment } from './../../../../../../../../environments/environment';
import { AuthorizationDataService } from './../../../../../../../core/data/feature-authorization/authorization-data.service';
import { Component, Inject, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { FieldRenderingType, MetadataBoxFieldRendering } from '../metadata-box.decorator';
import { BitstreamRenderingModelComponent } from '../bitstream-rendering-model';
import { BitstreamDataService } from '../../../../../../../core/data/bitstream-data.service';
import { Bitstream } from '../../../../../../../core/shared/bitstream.model';
import { Item } from '../../../../../../../core/shared/item.model';
import { LayoutField } from '../../../../../../../core/layout/models/box.model';

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
   * Envoirment variables configuring the fields to be viewed
   */
  envData = environment.advancedAttachment;

  /**
   * Envoirment variables configuring pagination
   */
  envPagination = environment.attachmentPagination;
  /**
   * Configuration type enum
   */
  Type = Type;

  constructor(
    private authorizationService: AuthorizationDataService,
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
    if (this.envPagination.pagination) {
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
