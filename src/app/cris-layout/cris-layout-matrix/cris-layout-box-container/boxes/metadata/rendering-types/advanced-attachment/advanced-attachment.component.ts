import {
  AsyncPipe,
  NgFor,
  NgIf,
} from '@angular/common';
import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../../../../../../environments/environment';
import { BitstreamDataService } from '../../../../../../../core/data/bitstream-data.service';
import { FindListOptions } from '../../../../../../../core/data/find-list-options.model';
import {
  buildPaginatedList,
  PaginatedList,
} from '../../../../../../../core/data/paginated-list.model';
import { RemoteData } from '../../../../../../../core/data/remote-data';
import { LayoutField } from '../../../../../../../core/layout/models/box.model';
import { Bitstream } from '../../../../../../../core/shared/bitstream.model';
import { Item } from '../../../../../../../core/shared/item.model';
import { getFirstCompletedRemoteData } from '../../../../../../../core/shared/operators';
import { followLink } from '../../../../../../../shared/utils/follow-link-config.model';
import { AttachmentComponent } from '../attachment/attachment.component';
import { BitstreamAttachmentComponent } from './bitstream-attachment/bitstream-attachment.component';

@Component({
  selector: 'ds-advanced-attachment',
  templateUrl: './advanced-attachment.component.html',
  styleUrls: ['./advanced-attachment.component.scss'],
  standalone: true,
  imports: [
    NgFor,
    BitstreamAttachmentComponent,
    NgIf,
    AsyncPipe,
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
