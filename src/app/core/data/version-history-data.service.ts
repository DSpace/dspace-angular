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
import { HttpClient } from '@angular/common/http';
import { DefaultChangeAnalyzer } from './default-change-analyzer.service';
import { FindListOptions, GetRequest } from './request.models';
import { Observable } from 'rxjs/internal/Observable';
import { PaginatedSearchOptions } from '../../shared/search/paginated-search-options.model';
import { RemoteData } from './remote-data';
import { PaginatedList } from './paginated-list';
import { Version } from '../shared/version.model';
import { map, switchMap, take } from 'rxjs/operators';
import { dataService } from '../cache/builders/build-decorators';
import { VERSION_HISTORY } from '../shared/version-history.resource-type';
import { followLink, FollowLinkConfig } from '../../shared/utils/follow-link-config.model';

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
   * @param versionHistoryId  The version history's ID
   * @param searchOptions     The search options to use
   * @param linksToFollow     HAL Links to follow on the Versions
   */
  getVersions(versionHistoryId: string, searchOptions?: PaginatedSearchOptions, ...linksToFollow: Array<FollowLinkConfig<Version>>): Observable<RemoteData<PaginatedList<Version>>> {
    const hrefObs = this.getVersionsEndpoint(versionHistoryId).pipe(
      map((href) => searchOptions ? searchOptions.toRestUrl(href) : href)
    );
    hrefObs.pipe(
      take(1)
    ).subscribe((href) => {
      const request = new GetRequest(this.requestService.generateRequestId(), href);
      this.requestService.configure(request);
    });

    return this.rdbService.buildList<Version>(hrefObs, ...linksToFollow);
  }
}
