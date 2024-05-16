/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { FollowLinkConfig } from '../../../shared/utils/follow-link-config.model';
import { RemoteDataBuildService } from '../../cache/builders/remote-data-build.service';
import { RequestParam } from '../../cache/models/request-param.model';
import { ObjectCacheService } from '../../cache/object-cache.service';
import {
  FindAllData,
  FindAllDataImpl,
} from '../../data/base/find-all-data';
import { IdentifiableDataService } from '../../data/base/identifiable-data.service';
import { SearchDataImpl } from '../../data/base/search-data';
import { FindListOptions } from '../../data/find-list-options.model';
import { PaginatedList } from '../../data/paginated-list.model';
import { RemoteData } from '../../data/remote-data';
import { RequestService } from '../../data/request.service';
import { HALEndpointService } from '../../shared/hal-endpoint.service';
import { Vocabulary } from './models/vocabulary.model';

/**
 * Data service to retrieve vocabularies from the REST server.
 */
@Injectable({ providedIn: 'root' })
export class VocabularyDataService extends IdentifiableDataService<Vocabulary> implements FindAllData<Vocabulary> {
  protected searchByMetadataAndCollectionPath = 'byMetadataAndCollection';

  private findAllData: FindAllData<Vocabulary>;
  private searchData: SearchDataImpl<Vocabulary>;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
  ) {
    super('vocabularies', requestService, rdbService, objectCache, halService);

    this.findAllData = new FindAllDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);
    this.searchData = new SearchDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);
  }

  /**
   * Returns {@link RemoteData} of all object with a list of {@link FollowLinkConfig}, to indicate which embedded
   * info should be added to the objects
   *
   * @param options                     Find list options object
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
   *                                    no valid cached version. Defaults to true
   * @param reRequestOnStale            Whether or not the request should automatically be re-
   *                                    requested after the response becomes stale
   * @param linksToFollow               List of {@link FollowLinkConfig} that indicate which
   *                                    {@link HALLink}s should be automatically resolved
   * @return {Observable<RemoteData<PaginatedList<T>>>}
   *    Return an observable that emits object list
   */
  public findAll(options?: FindListOptions, useCachedVersionIfAvailable?: boolean, reRequestOnStale?: boolean, ...linksToFollow: FollowLinkConfig<Vocabulary>[]): Observable<RemoteData<PaginatedList<Vocabulary>>> {
    return this.findAllData.findAll(options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }

  /**
   * Return the controlled vocabulary configured for the specified metadata and collection if any (/submission/vocabularies/search/{@link searchByMetadataAndCollectionPath}?metadata=<>&collection=<>)
   * @param metadataField               metadata field to search
   * @param collectionUUID              collection UUID where is configured the vocabulary
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
   *                                    no valid cached version. Defaults to true
   * @param reRequestOnStale            Whether or not the request should automatically be re-
   *                                    requested after the response becomes stale
   * @param linksToFollow               List of {@link FollowLinkConfig} that indicate which
   *                                    {@link HALLink}s should be automatically resolved
   */
  public getVocabularyByMetadataAndCollection(metadataField: string, collectionUUID: string, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<Vocabulary>[]): Observable<RemoteData<Vocabulary>> {
    const findListOptions = new FindListOptions();
    findListOptions.searchParams = [new RequestParam('metadata', metadataField),
      new RequestParam('collection', collectionUUID)];
    const href$ = this.searchData.getSearchByHref(this.searchByMetadataAndCollectionPath, findListOptions, ...linksToFollow);
    return this.findByHref(href$, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }
}
