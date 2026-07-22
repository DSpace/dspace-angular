import { AsyncPipe } from '@angular/common';
import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { BitstreamDataService } from '@dspace/core/data/bitstream-data.service';
import { FindListOptions } from '@dspace/core/data/find-list-options.model';
import {
  buildPaginatedList,
  PaginatedList,
} from '@dspace/core/data/paginated-list.model';
import { RemoteData } from '@dspace/core/data/remote-data';
import { LayoutField } from '@dspace/core/layout/models/box.model';
import { Bitstream } from '@dspace/core/shared/bitstream.model';
import { followLink } from '@dspace/core/shared/follow-link-config.model';
import { Item } from '@dspace/core/shared/item.model';
import { getFirstCompletedRemoteData } from '@dspace/core/shared/operators';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../../../../../../environments/environment';
import { AttachmentComponent } from '../attachment/attachment.component';
import { BitstreamAttachmentComponent } from './bitstream-attachment/bitstream-attachment.component';

@Component({
  selector: 'ds-advanced-attachment',
  templateUrl: './advanced-attachment.component.html',
  styleUrls: ['./advanced-attachment.component.scss'],
  imports: [
    AsyncPipe,
    BitstreamAttachmentComponent,
    TranslateModule,
  ],
})
/**
 * This component renders the attachment with an advanced layout.
 */
export class AdvancedAttachmentComponent extends AttachmentComponent implements OnInit {

  /**
   * Environment variables configuring the fields to be viewed
   */
  envMetadata = environment.layout.advancedAttachmentRendering.metadata;

  /**
   * Environment variables configuring pagination
   */
  envPagination = environment.layout.advancedAttachmentRendering.pagination;

  constructor(
    @Inject('fieldProvider') public fieldProvider: LayoutField,
    @Inject('itemProvider') public itemProvider: Item,
    @Inject('renderingSubTypeProvider') public renderingSubTypeProvider: string,
    @Inject('tabNameProvider') public tabNameProvider: string,
    protected bitstreamDataService: BitstreamDataService,
    protected translateService: TranslateService,
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
        }),
      );
  }
}
