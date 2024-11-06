import { Component } from '@angular/core';

import { Observable, of } from 'rxjs';

import { focusShadow } from '../../../../animations/focus';
import { ViewMode } from '../../../../../core/shared/view-mode.model';
import {
  listableObjectComponent
} from '../../../../object-collection/shared/listable-object/listable-object.decorator';
import { SearchResultGridElementComponent } from '../../search-result-grid-element.component';
import { Item } from '../../../../../core/shared/item.model';
import { ItemSearchResult } from '../../../../object-collection/shared/item-search-result.model';
import { getItemPageRoute } from '../../../../../item-page/item-page-routing-paths';
import { DSONameService } from '../../../../../core/breadcrumbs/dso-name.service';
import { TruncatableService } from '../../../../truncatable/truncatable.service';
import { BitstreamDataService } from '../../../../../core/data/bitstream-data.service';
import { Bitstream } from '../../../../../core/shared/bitstream.model';
import { getFirstCompletedRemoteData, getRemoteDataPayload } from '../../../../../core/shared/operators';
import { map, switchMap } from 'rxjs/operators';
import { RemoteData } from '../../../../../core/data/remote-data';
import { ConfigurationProperty } from '../../../../../core/shared/configuration-property.model';
import { isEmpty, isNotNull, isUndefined } from '../../../../empty.util';
import { PaginatedList } from '../../../../../core/data/paginated-list.model';
import { ThumbnailService } from '../../../../thumbnail/thumbnail.service';
import { environment } from '../../../../../../environments/environment';

@listableObjectComponent('PublicationSearchResult', ViewMode.GridElement)
@listableObjectComponent(ItemSearchResult, ViewMode.GridElement)
@Component({
  selector: 'ds-item-search-result-grid-element',
  styleUrls: ['./item-search-result-grid-element.component.scss'],
  templateUrl: './item-search-result-grid-element.component.html',
  animations: [focusShadow]
})
/**
 * The component for displaying a grid element for an item search result of the type Publication
 */
export class ItemSearchResultGridElementComponent extends SearchResultGridElementComponent<ItemSearchResult, Item> {
  /**
   * Route to the item's page
   */
  itemPageRoute: string;

  dsoTitle: string;

  /**
   * The thumbnail of item as an Observable due its dynamic property
   */
  thumbnail$: Observable<Bitstream> = of(null);

  authorMetadata = environment.searchResult.authorMetadata;

  constructor(
    public dsoNameService: DSONameService,
    protected truncatableService: TruncatableService,
    protected bitstreamDataService: BitstreamDataService,
    protected thumbnailService: ThumbnailService
  ) {
    super(dsoNameService, truncatableService, bitstreamDataService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.itemPageRoute = getItemPageRoute(this.dso);
    this.dsoTitle = this.dsoNameService.getHitHighlights(this.object, this.dso);
    this.thumbnail$ = this.getThumbnail();
  }

  /**
   * Returns the valid thumbnail or original bitstream depending on item and max size
   */
  getThumbnail(): Observable<Bitstream> {
    return this.dso?.thumbnail?.pipe(
      getFirstCompletedRemoteData(),
      getRemoteDataPayload(),
      switchMap((thumbnail: Bitstream) => this.thumbnailService.getConfig().pipe(
        switchMap((remoteData: RemoteData<ConfigurationProperty>) => {
          // make sure we got a success response from the backend
          if (!remoteData.hasSucceeded) { return of(null); }

          let maxSize;
          if (!isUndefined(remoteData.payload) && isNotNull(remoteData.payload) && isNotNull(remoteData.payload.values)) {
            maxSize = parseInt(remoteData.payload.values[0], 10);
          }

          if (!isEmpty(maxSize)) {
            // max size is in KB so we need to multiply with 1000
            if (!isEmpty(thumbnail) && thumbnail.sizeBytes <= maxSize * 1000) {
              return of(thumbnail);
            } else {
              return this.getOriginalBitstreams(maxSize);
            }
          }
          return of(thumbnail);
        }))
      )
    );
  }

  /**
   * Returns the list of original bitstreams
   */
  getOriginalBitstreams(maxSize): Observable<Bitstream> {
    return this.bitstreamDataService
      .findAllByItemAndBundleName(this.dso, 'ORIGINAL', {}, true, false)
      .pipe(
        getFirstCompletedRemoteData(),
        map((response: RemoteData<PaginatedList<Bitstream>>) => {
          return response.hasSucceeded ? response.payload.page : [];
        }),
        map((bitstreams: Bitstream[]) => {
          return bitstreams.find(bitstream => bitstream.sizeBytes <= maxSize * 1000);
        }),
      );
  }
}
