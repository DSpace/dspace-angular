import { FindListOptions } from '../../../../../../../core/data/find-list-options.model';
import { Observable } from 'rxjs';
import { buildPaginatedList, PaginatedList } from '../../../../../../../core/data/paginated-list.model';
import { Bitstream } from '../../../../../../../core/shared/bitstream.model';
import { followLink } from '../../../../../../../shared/utils/follow-link-config.model';
import { getFirstCompletedRemoteData } from '../../../../../../../core/shared/operators';
import { map } from 'rxjs/operators';
import { RemoteData } from '../../../../../../../core/data/remote-data';
import { Component, Inject } from '@angular/core';
import { LayoutField } from '../../../../../../../core/layout/models/box.model';
import { Item } from '../../../../../../../core/shared/item.model';
import { BitstreamDataService } from '../../../../../../../core/data/bitstream-data.service';
import { TranslateService } from '@ngx-translate/core';
import { BitstreamRenderingModelComponent } from '../bitstream-rendering-model';

/**
 * This class defines the basic model to extends for create a new
 * bitstream-attachment field render component.
 * This will render all bitstreams that aren't marked hidden.
 */
@Component({
  template: ''
})
export abstract class BitstreamAttachmentRenderingModelComponent extends BitstreamRenderingModelComponent {
  constructor(
    @Inject('fieldProvider') fieldProvider: LayoutField,
    @Inject('itemProvider') itemProvider: Item,
    @Inject('renderingSubTypeProvider') renderingSubTypeProvider: string,
    @Inject('tabNameProvider') public tabNameProvider: string,
    bitstreamDataService: BitstreamDataService,
    translateService: TranslateService
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
        })
      );
  }
}
