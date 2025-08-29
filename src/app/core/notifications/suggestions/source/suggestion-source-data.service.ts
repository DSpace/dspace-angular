import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RemoteDataBuildService } from '@dspace/core/cache/builders/remote-data-build.service';
import { ObjectCacheService } from '@dspace/core/cache/object-cache.service';
import { CoreState } from '@dspace/core/core-state.model';
import {
  FindAllData,
  FindAllDataImpl,
} from '@dspace/core/data/base/find-all-data';
import { IdentifiableDataService } from '@dspace/core/data/base/identifiable-data.service';
import { DefaultChangeAnalyzer } from '@dspace/core/data/default-change-analyzer.service';
import { FindListOptions } from '@dspace/core/data/find-list-options.model';
import { PaginatedList } from '@dspace/core/data/paginated-list.model';
import { RemoteData } from '@dspace/core/data/remote-data';
import { RequestService } from '@dspace/core/data/request.service';
import { FollowLinkConfig } from '@dspace/core/shared/follow-link-config.model';
import { HALEndpointService } from '@dspace/core/shared/hal-endpoint.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { NotificationsService } from '../../../notification-system/notifications.service';
import { SuggestionSource } from '../models/suggestion-source.model';

/**
 * Service that retrieves Suggestion Source data
 */
@Injectable({ providedIn: 'root' })
export class SuggestionSourceDataService extends IdentifiableDataService<SuggestionSource> {

  protected linkPath = 'suggestionsources';

  private findAllData: FindAllData<SuggestionSource>;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DefaultChangeAnalyzer<SuggestionSource>) {
    super('suggestionsources', requestService, rdbService, objectCache, halService);
    this.findAllData = new FindAllDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);
  }
  /**
   * Return the list of Suggestion source.
   *
   * @param options                     Find list options object.
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
   *                                    no valid cached version. Defaults to true
   * @param reRequestOnStale            Whether or not the request should automatically be re-
   *                                    requested after the response becomes stale
   * @param linksToFollow               List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved.
   *
   * @return Observable<RemoteData<PaginatedList<QualityAssuranceSourceObject>>>
   *    The list of Quality Assurance source.
   */
  public getSources(options: FindListOptions = {}, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<SuggestionSource>[]): Observable<RemoteData<PaginatedList<SuggestionSource>>> {
    return this.findAll(options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }

  /**
   * Return a single Suggestoin source.
   *
   * @param id                          The Quality Assurance source id
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
   *                                    no valid cached version. Defaults to true
   * @param reRequestOnStale            Whether or not the request should automatically be re-
   *                                    requested after the response becomes stale
   * @param linksToFollow               List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved.
   *
   * @return Observable<RemoteData<QualityAssuranceSourceObject>>    The Quality Assurance source.
   */
  public getSource(id: string, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<SuggestionSource>[]): Observable<RemoteData<SuggestionSource>> {
    return this.findById(id, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
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
  findAll(options: FindListOptions = {}, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<SuggestionSource>[]): Observable<RemoteData<PaginatedList<SuggestionSource>>> {
    return this.findAllData.findAll(options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }
}
