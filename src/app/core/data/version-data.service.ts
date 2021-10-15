import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Version } from '../shared/version.model';
import { RequestService } from './request.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { Store } from '@ngrx/store';
import { CoreState } from '../core.reducers';
import { ObjectCacheService } from '../cache/object-cache.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { HttpClient } from '@angular/common/http';
import { DefaultChangeAnalyzer } from './default-change-analyzer.service';
import { FindListOptions } from './request.models';
import { EMPTY, Observable } from 'rxjs';
import { dataService } from '../cache/builders/build-decorators';
import { VERSION } from '../shared/version.resource-type';
import { VersionHistory } from '../shared/version-history.model';
import { followLink } from '../../shared/utils/follow-link-config.model';
import { getFirstSucceededRemoteDataPayload } from '../shared/operators';
import { map, switchMap } from 'rxjs/operators';

/**
 * Service responsible for handling requests related to the Version object
 */
@Injectable()
@dataService(VERSION)
export class VersionDataService extends DataService<Version> {
  protected linkPath = 'versions';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DefaultChangeAnalyzer<Version>) {
    super();
  }

  /**
   * Get the endpoint for browsing versions
   */
  getBrowseEndpoint(options: FindListOptions = {}, linkPath?: string): Observable<string> {
    return this.halService.getEndpoint(this.linkPath);
  }

  /**
   * Get the version history for the given version
   * @param version
   */
  getHistoryFromVersion$(version: Version): Observable<VersionHistory> {
    return version ? this.findById(version.id, false, true, followLink('versionhistory')).pipe(
      getFirstSucceededRemoteDataPayload(),
      switchMap((res) => res.versionhistory),
      getFirstSucceededRemoteDataPayload(),
    ) : EMPTY;
  }

  /**
   * Get the ID of the version history for the given version
   * @param version
   */
  getHistoryIdFromVersion$(version: Version): Observable<string> {
    return this.getHistoryFromVersion$(version).pipe(
      map((versionHistory) => versionHistory.id),
    );
  }

}
