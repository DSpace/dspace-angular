import { Injectable } from '@angular/core';
import { FollowAuthorityMetadata } from '@dspace/config/search-follow-metadata.interface';
import {
  hasValue,
  isNotEmpty,
} from '@dspace/shared/utils/empty.util';
import isArray from 'lodash/isArray';
import {
  Observable,
  of,
} from 'rxjs';
import {
  map,
  switchMap,
} from 'rxjs/operators';
import { SearchService } from 'src/app/shared/search/search.service';

import { environment } from '../../../environments/environment';
import { ItemDataService } from '../data/item-data.service';
import { PaginatedList } from '../data/paginated-list.model';
import { RemoteData } from '../data/remote-data';
import { WORKFLOWITEM } from '../eperson/models/workflowitem.resource-type';
import { WORKSPACEITEM } from '../eperson/models/workspaceitem.resource-type';
import { DSpaceObject } from '../shared/dspace-object.model';
import { FollowLinkConfig } from '../shared/follow-link-config.model';
import { Item } from '../shared/item.model';
import { ITEM } from '../shared/item.resource-type';
import { MetadataValue } from '../shared/metadata.models';
import { Metadata } from '../shared/metadata.utils';
import { getFirstCompletedRemoteData } from '../shared/operators';
import { PaginatedSearchOptions } from '../shared/search/models/paginated-search-options.model';
import { SearchObjects } from '../shared/search/models/search-objects.model';
import { BrowseService } from './browse.service';

/**
 * The service aims to manage browse requests and subsequent extra fetch requests.
 */
@Injectable({ providedIn: 'root' })
export class SearchManager {

  constructor(
    protected itemService: ItemDataService,
    protected browseService: BrowseService,
    protected searchService: SearchService,
  ) {
  }

  /**
   * Method to retrieve a paginated list of search results from the server
   * @param {PaginatedSearchOptions} searchOptions The configuration necessary to perform this search
   * @param responseMsToLive The amount of milliseconds for the response to live in cache
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
   * no valid cached version. Defaults to true
   * @param reRequestOnStale Whether or not the request should automatically be re-requested after
   * the response becomes stale
   * @param linksToFollow List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved
   * @returns {Observable<RemoteData<SearchObjects<T>>>} Emits a paginated list with all search results found
   */
  search<T extends DSpaceObject>(
    searchOptions?: PaginatedSearchOptions,
    responseMsToLive?: number,
    useCachedVersionIfAvailable = true,
    reRequestOnStale = true,
    ...linksToFollow: FollowLinkConfig<T>[]): Observable<RemoteData<SearchObjects<T>>> {
    return this.searchService.search(searchOptions, responseMsToLive, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow)
      .pipe(this.completeSearchObjectsWithExtraData());
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

  protected completeSearchObjectsWithExtraData<T extends DSpaceObject>() {
    return switchMap((searchObjectsRD: RemoteData<SearchObjects<T>>) => {
      if (searchObjectsRD.isSuccess) {
        const items: Item[] = searchObjectsRD.payload.page
          .map((searchResult) => isNotEmpty(searchResult?._embedded?.indexableObject) ? searchResult._embedded.indexableObject : searchResult.indexableObject) as any;
        return this.fetchExtraData(items).pipe(map(() => {
          return searchObjectsRD;
        }));
      }
      return of(searchObjectsRD);
    });
  }

  protected fetchExtraData<T extends DSpaceObject>(objects: T[]): Observable<any> {

    const items: Item[] = objects
      .map((object: any) => {
        if (object.type === ITEM.value) {
          return object as Item;
        } else if (object.type === WORKSPACEITEM.value || object.type === WORKFLOWITEM.value) {
          return object?._embedded?.item as Item;
        } else {
          // Handle workflow task here, where the item is embedded in a workflowitem
          return object?._embedded?.workflowitem?._embedded?.item as Item;
        }

      })
      .filter((item) => hasValue(item));

    const uuidList = this.extractUUID(items, environment.searchResult.followAuthorityMetadata, environment.searchResult.followAuthorityMaxItemLimit);

    return uuidList.length > 0 ? this.itemService.findAllById(uuidList).pipe(
      getFirstCompletedRemoteData(),
      map(data => {
        if (data.hasSucceeded) {
          return of(data);
        } else {
          of(null);
        }
      }),
    ) : of(null);
  }

  protected extractUUID(items: Item[], metadataToFollow: FollowAuthorityMetadata[], numberOfElementsToReturn?: number): string[] {
    const uuidMap = {};

    items.forEach((item) => {
      metadataToFollow.forEach((followMetadata: FollowAuthorityMetadata) => {
        if (item.entityType === followMetadata.type) {
          if (isArray(followMetadata.metadata)) {
            followMetadata.metadata.forEach((metadata) => {
              Metadata.all(item.metadata, metadata, null, null, false, environment.searchResult.followAuthorityMetadataValuesLimit)
                .filter((metadataValue: MetadataValue) => Metadata.hasValidItemAuthority(metadataValue.authority))
                .forEach((metadataValue: MetadataValue) => uuidMap[metadataValue.authority] = metadataValue);
            });
          } else {
            Metadata.all(item.metadata, followMetadata.metadata, null, null, false, environment.searchResult.followAuthorityMetadataValuesLimit)
              .filter((metadataValue: MetadataValue) => Metadata.hasValidItemAuthority(metadataValue.authority))
              .forEach((metadataValue: MetadataValue) => uuidMap[metadataValue.authority] = metadataValue);
          }
        }
      });
    });

    if (hasValue(numberOfElementsToReturn) && numberOfElementsToReturn > 0) {
      return Object.keys(uuidMap).slice(0, numberOfElementsToReturn);
    }

    return Object.keys(uuidMap);
  }
}
