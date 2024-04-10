import { Component, Inject, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { FieldRenderingType, MetadataBoxFieldRendering } from '../metadata-box.decorator';
import { BitstreamDataService } from '../../../../../../../core/data/bitstream-data.service';
import { Item } from '../../../../../../../core/shared/item.model';
import { LayoutField } from '../../../../../../../core/layout/models/box.model';
import { AttachmentComponent } from '../attachment/attachment.component';
import { environment } from '../../../../../../../../environments/environment';
import { FindListOptions } from '../../../../../../../core/data/find-list-options.model';
import { Observable } from 'rxjs';
import { buildPaginatedList, PaginatedList } from '../../../../../../../core/data/paginated-list.model';
import { Bitstream } from '../../../../../../../core/shared/bitstream.model';
import { followLink } from '../../../../../../../shared/utils/follow-link-config.model';
import { getFirstCompletedRemoteData } from '../../../../../../../core/shared/operators';
import { map } from 'rxjs/operators';
import { RemoteData } from '../../../../../../../core/data/remote-data';

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

  constructor(
    @Inject('fieldProvider') public fieldProvider: LayoutField,
    @Inject('itemProvider') public itemProvider: Item,
    @Inject('renderingSubTypeProvider') public renderingSubTypeProvider: string,
    @Inject('tabNameProvider') public tabNameProvider: string,
    protected bitstreamDataService: BitstreamDataService,
    protected translateService: TranslateService
  ) {
    super(fieldProvider, itemProvider, renderingSubTypeProvider, tabNameProvider, bitstreamDataService, translateService);
  }

  getBitstreamsByItem(options?: FindListOptions): Observable<PaginatedList<Bitstream>> {
    return this.bitstreamDataService
      .showableByItem(this.item.uuid, this.field.bitstream.bundle, this.getMetadataFilters(), options, false, false, followLink('thumbnail'), followLink('format'))
      .pipe(
        getFirstCompletedRemoteData(),
        map((response: RemoteData<PaginatedList<Bitstream>>) => {
          return response.hasSucceeded ? response.payload : buildPaginatedList(null, []);
        })
      );
  }
}
