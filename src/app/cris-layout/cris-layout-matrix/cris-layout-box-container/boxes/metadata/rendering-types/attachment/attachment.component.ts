import { Component, Inject, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { FieldRenderingType, MetadataBoxFieldRendering } from '../metadata-box.decorator';
import { BitstreamRenderingModelComponent } from '../bitstream-rendering-model';
import { BitstreamDataService } from '../../../../../../../core/data/bitstream-data.service';
import { Bitstream } from '../../../../../../../core/shared/bitstream.model';
import { Item } from '../../../../../../../core/shared/item.model';
import { LayoutField } from '../../../../../../../core/layout/models/box.model';
import { environment } from '../../../../../../../../environments/environment';
import { FindListOptions } from '../../../../../../../core/data/request.models';

@Component({
  selector: 'ds-attachment',
  templateUrl: './attachment.component.html',
  styleUrls: ['./attachment.component.scss']
})
@MetadataBoxFieldRendering(FieldRenderingType.ATTACHMENT, true)
/**
 * The component for displaying a thumbnail rendered metadata box
 */
export class AttachmentComponent extends BitstreamRenderingModelComponent implements OnInit {

  /**
   * List of bitstreams to show in the list
   */
  bitstreams$: Observable<Bitstream[]>;

  /**
   * Envoirment variables configuring pagination
   */
  envPagination = environment.attachmentRendering.pagination;
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