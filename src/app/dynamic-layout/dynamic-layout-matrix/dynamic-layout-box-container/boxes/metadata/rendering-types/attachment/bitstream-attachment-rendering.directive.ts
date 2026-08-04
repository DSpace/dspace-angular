import {
  Directive,
  Inject,
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
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BitstreamRenderingDirective } from '../bitstream-rendering.directive';

/**
 * This class defines the basic model to extends for create a new
 * bitstream-attachment field render component.
 * This will render all bitstreams that aren't marked hidden.
 */
@Directive()
export abstract class BitstreamAttachmentRenderingDirective extends BitstreamRenderingDirective {
  constructor(
    @Inject('fieldProvider') fieldProvider: LayoutField,
    @Inject('itemProvider') itemProvider: Item,
    @Inject('renderingSubTypeProvider') renderingSubTypeProvider: string,
    @Inject('tabNameProvider') public tabNameProvider: string,
    bitstreamDataService: BitstreamDataService,
    translateService: TranslateService,
  ) {
    super(fieldProvider, itemProvider, renderingSubTypeProvider, tabNameProvider, bitstreamDataService, translateService);
  }

  getBitstreamsByItem(options?: FindListOptions): Observable<PaginatedList<Bitstream>> {
    return this.bitstreamDataService
      .findShowableBitstreamsByItem(this.item.uuid, this.field.bitstream.bundle, this.getMetadataFilters(), options,
        false, false, followLink('thumbnail'), followLink('format'))
      .pipe(
        getFirstCompletedRemoteData(),
        map((response: RemoteData<PaginatedList<Bitstream>>) => {
          return response.hasSucceeded ? response.payload : buildPaginatedList(null, []);
        }),
      );
  }
}
