import { DataService } from './data.service';
import { VersionHistory } from '../shared/version-history.model';
import { Injectable } from '@angular/core';
import { RequestService } from './request.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { Store } from '@ngrx/store';
import { CoreState } from '../core.reducers';
import { ObjectCacheService } from '../cache/object-cache.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DefaultChangeAnalyzer } from './default-change-analyzer.service';
import { FindListOptions, PostRequest, RestRequest } from './request.models';
import { Observable } from 'rxjs';
import { PaginatedSearchOptions } from '../../shared/search/paginated-search-options.model';
import { RemoteData } from './remote-data';
import { PaginatedList } from './paginated-list.model';
import { Version } from '../shared/version.model';
import { map, switchMap, take } from 'rxjs/operators';
import { dataService } from '../cache/builders/build-decorators';
import { VERSION_HISTORY } from '../shared/version-history.resource-type';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { VersionDataService } from './version-data.service';
import { HttpOptions } from '../dspace-rest/dspace-rest.service';
import { getFirstCompletedRemoteData, sendRequest } from '../shared/operators';

/**
 * Service responsible for handling requests related to the VersionHistory object
 */
@Injectable()
@dataService(VERSION_HISTORY)
export class VersionHistoryDataService extends DataService<VersionHistory> {
  protected linkPath = 'versionhistories';
  protected versionsEndpoint = 'versions';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected versionDataService: VersionDataService,
    protected http: HttpClient,
    protected comparator: DefaultChangeAnalyzer<VersionHistory>) {
    super();
  }

  /**
   * Get the endpoint for browsing versions
   */
  getBrowseEndpoint(options: FindListOptions = {}, linkPath?: string): Observable<string> {
    return this.halService.getEndpoint(this.linkPath);
  }

  /**
   * Get the versions endpoint for a version history
   * @param versionHistoryId
   */
  getVersionsEndpoint(versionHistoryId: string): Observable<string> {
    return this.getBrowseEndpoint().pipe(
      switchMap((href: string) => this.halService.getEndpoint(this.versionsEndpoint, `${href}/${versionHistoryId}`))
    );
  }

  /**
   * Get a version history's versions using paginated search options
   * @param versionHistoryId            The version history's ID
   * @param searchOptions               The search options to use
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
   *                                    no valid cached version. Defaults to true
   * @param reRequestOnStale            Whether or not the request should automatically be re-
   *                                    requested after the response becomes stale
   * @param linksToFollow               List of {@link FollowLinkConfig} that indicate which
   *                                    {@link HALLink}s should be automatically resolved
   */
  getVersions(versionHistoryId: string, searchOptions?: PaginatedSearchOptions, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<Version>[]): Observable<RemoteData<PaginatedList<Version>>> {
    const hrefObs = this.getVersionsEndpoint(versionHistoryId).pipe(
      map((href) => searchOptions ? searchOptions.toRestUrl(href) : href)
    );

    return this.versionDataService.findAllByHref(hrefObs, undefined, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }

  public createVersion(itemHref: string, summary: string): Observable<RemoteData<Version>> {
    const requestOptions: HttpOptions = Object.create({});
    let requestHeaders = new HttpHeaders();
    requestHeaders = requestHeaders.append('Content-Type', 'text/uri-list');
    requestOptions.headers = requestHeaders;

    // TODO fix switchmap

    return this.halService.getEndpoint(this.versionsEndpoint).pipe(
      take(1),
      map((endpointUrl: string) => {
        return (summary?.length > 0 ) ? `${endpointUrl}?summary=${summary}` : `${endpointUrl}`;
      }),
      map((endpointURL: string) => new PostRequest(this.requestService.generateRequestId(), endpointURL, itemHref, requestOptions)),
      sendRequest(this.requestService),
      /*switchMap((res: string) => {
        const requestId = this.requestService.generateRequestId();
        const href = res + ( (summary?.length > 0 ) ? ('?summary=' + summary) : '');
        const body = itemHref;
        const request = new PostRequest(requestId, href, body, requestOptions);
        this.requestService.send(request);
        return this.rdbService.buildFromRequestUUID<Version>(requestId);
      }),*/
      switchMap((restRequest: RestRequest) => this.rdbService.buildFromRequestUUID(restRequest.uuid)),
      getFirstCompletedRemoteData()
    ) as Observable<RemoteData<Version>>;
  }
}
