import { Component, OnInit } from '@angular/core';
import { listableObjectComponent } from '../../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { ViewMode } from '../../../../../core/shared/view-mode.model';
import { focusShadow } from '../../../../../shared/animations/focus';
import { ItemSearchResultGridElementComponent } from '../../../../../shared/object-grid/search-result-grid-element/item-search-result/item/item-search-result-grid-element.component';
import { isEmpty, isNotEmpty, isNotNull, isUndefined } from '../../../../../shared/empty.util';
import { map, switchMap, tap } from 'rxjs/operators';
import { TruncatableService } from '../../../../../shared/truncatable/truncatable.service';
import { BitstreamDataService } from '../../../../../core/data/bitstream-data.service';
import { ThumbnailService } from '../../../../../shared/thumbnail/thumbnail.service';
import { RemoteData } from '../../../../../core/data/remote-data';
import { ConfigurationProperty } from '../../../../../core/shared/configuration-property.model';
import { Bitstream } from '../../../../../core/shared/bitstream.model';
import { getFirstCompletedRemoteData, getRemoteDataPayload } from '../../../../../core/shared/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { PaginatedList } from '../../../../../core/data/paginated-list.model';

@listableObjectComponent('PersonSearchResult', ViewMode.GridElement)
@Component({
  selector: 'ds-person-search-result-grid-element',
  styleUrls: ['./person-search-result-grid-element.component.scss'],
  templateUrl: './person-search-result-grid-element.component.html',
  animations: [focusShadow]
})
/**
 * The component for displaying a grid element for an item search result of the type Person
 */
export class PersonSearchResultGridElementComponent extends ItemSearchResultGridElementComponent implements OnInit {

  /**
   * The thumbnail of item as an Observable due its dynamic property
   */
  thumbnail$: Observable<Bitstream> = of(null);

  constructor(
    protected truncatableService: TruncatableService,
    protected bitstreamDataService: BitstreamDataService,
    protected thumbnailService: ThumbnailService,
  ) {
    super(truncatableService, bitstreamDataService);
  }

  /**
   * On init get the items thumbnail
   */
  ngOnInit() {
    super.ngOnInit();
    this.thumbnail$ = this.getThumbnail();
  }


  /**
   * Returns the valid thumbnail or original bitstream depending on item and max size
   */
  getThumbnail(): Observable<Bitstream> {
    return this.dso.thumbnail.pipe(
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

  /**
   * Returns the person name
   */
  getPersonName(): string {
    let personName = this.dso.name;
    if (isNotEmpty(this.firstMetadataValue('person.familyName')) && isNotEmpty(this.firstMetadataValue('person.givenName'))) {
      personName = this.firstMetadataValue('person.familyName') + ', ' + this.firstMetadataValue('person.givenName');
    }

    return personName;
  }
}
