import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { PaginatedList } from '../data/paginated-list.model';
import { RemoteData } from '../data/remote-data';
import { Item } from '../shared/item.model';
import { getFirstSucceededRemoteData } from '../shared/operators';
import { BrowseEntrySearchOptions } from './browse-entry-search-options.model';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { ItemDataService } from '../data/item-data.service';
import { of } from 'rxjs/internal/observable/of';
import { BrowseService } from './browse.service';
import { environment } from '../../../environments/environment';
import { BrowseByFollowMetadata } from '../../../config/browse-by-follow-metadata.interface';


/**
 * The service aims to manage browse requests and subsequent extra fetch requests.
 */
@Injectable({providedIn: 'root'})
export class BrowseManager {

  constructor(
    protected itemService: ItemDataService,
    protected browseService: BrowseService
  ) {
  }

  /**
   * Get all items linked to a certain metadata value
   * @param {string} filterValue      metadata value to filter by (e.g. author's name)
   * @param options                   Options to narrow down your search
   * @param linksToFollow             The array of [[FollowLinkConfig]]
   * @returns {Observable<RemoteData<PaginatedList<Item>>>}
   */
  getBrowseItemsFor(filterValue: string, options: BrowseEntrySearchOptions, ...linksToFollow: FollowLinkConfig<any>[]): Observable<RemoteData<PaginatedList<Item>>> {
    return this.browseService.getBrowseItemsFor(filterValue, options, ...linksToFollow).pipe(this.completeWithExtraData());
  }

  /**
   * Get all items linked to a certain metadata authority
   * @param {string} filterAuthority      metadata authority to filter by (e.g. author's authority)
   * @param options                   Options to narrow down your search
   * @param linksToFollow             The array of [[FollowLinkConfig]]
   * @returns {Observable<RemoteData<PaginatedList<Item>>>}
   */
  getBrowseItemsForAuthority(filterAuthority: string, options: BrowseEntrySearchOptions, ...linksToFollow: FollowLinkConfig<any>[]): Observable<RemoteData<PaginatedList<Item>>> {
    return this.browseService.getBrowseItemsForAuthority(filterAuthority, options, ...linksToFollow).pipe(this.completeWithExtraData());
  }



  protected completeWithExtraData() {
    return switchMap((itemsRD: RemoteData<PaginatedList<Item>>) => {
      if (itemsRD.isSuccess) {
        return this.fetchExtraData(itemsRD.payload.page).pipe(map(() => {
          return itemsRD;
        }));
      }
      return of(itemsRD);
    });
  }

  protected fetchExtraData(items: Item[]): Observable<any> {

    const uuidList = this.extractUUID(items, environment.browseBy.followMetadata);

    return uuidList.length > 0 ? this.itemService.searchByObjects(uuidList).pipe(getFirstSucceededRemoteData()) : of(null);
  }

  protected extractUUID(items: Item[], metadataToFollow: BrowseByFollowMetadata[]): string[] {
    const uuidMap = {};

    items.forEach((item) => {
      metadataToFollow.forEach((followMetadata: BrowseByFollowMetadata) => {
        if (item.entityType === followMetadata.type) {
          followMetadata.metadata.forEach((metadata) => {
            item.allMetadata(metadata)
              .filter((value) => value.authority).forEach((value) => uuidMap[value.authority] = value);
          });
        }
      });
    });

    return Object.keys(uuidMap);
  }
}
