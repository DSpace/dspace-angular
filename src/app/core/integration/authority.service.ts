import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Store } from '@ngrx/store';

import { RequestService } from '../data/request.service';
import { IntegrationService } from './integration.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { AuthorityEntry } from './models/authority-entry.model';
import { NormalizedObjectBuildService } from '../cache/builders/normalized-object-build.service';
import { CoreState } from '../core.reducers';
import { ObjectCacheService } from '../cache/object-cache.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { IntegrationSearchOptions } from './models/integration-options.model';
import { DefaultChangeAnalyzer } from '../data/default-change-analyzer.service';
import { SearchParam } from '../cache/models/search-param.model';
import { Observable } from 'rxjs/internal/Observable';
import { IntegrationData } from './integration-data';

/**
 * A service that provides methods to make REST requests with authorities endpoint.
 */
@Injectable()
export class AuthorityService extends IntegrationService<AuthorityEntry> {
  protected forceBypassCache = false;
  protected linkPath = 'authorities';
  protected entriesEndpoint = 'entries';
  protected entryValueEndpoint = 'entryValues';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected dataBuildService: NormalizedObjectBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DefaultChangeAnalyzer<AuthorityEntry>
  ) {
    super();
  }

  /**
   * Find top entries for a hierarchical authority
   *
   * @param options The [[IntegrationSearchOptions]] object
   * @return {Observable<IntegrationData>}
   *    Return an observable that emits results
   */
  public findTopEntries(options: IntegrationSearchOptions): Observable<IntegrationData> {
    const searchHref = 'top';

    return this.searchEntriesBy(searchHref, options);
  }

  /**
   * Find entries for a hierarchical authority by parent
   *
   * @param parentId The parent id
   * @param options The [[IntegrationSearchOptions]] object
   * @return {Observable<IntegrationData>}
   *    Return an observable that emits results
   */
  public findEntriesByParent(parentId: string, options: IntegrationSearchOptions): Observable<IntegrationData> {
    const searchHref = 'byParent';

    options.searchParams.push(new SearchParam('id', parentId));
    return this.searchEntriesBy(searchHref, options);
  }

}
