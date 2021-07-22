import { Observable, of as observableOf } from 'rxjs';
import { Injectable } from '@angular/core';
import { AUTHORIZATION } from '../../shared/authorization.resource-type';
import { dataService } from '../../cache/builders/build-decorators';
import { DataService } from '../data.service';
import { Authorization } from '../../shared/authorization.model';
import { RequestService } from '../request.service';
import { RemoteDataBuildService } from '../../cache/builders/remote-data-build.service';
import { Store } from '@ngrx/store';
import { CoreState } from '../../core.reducers';
import { ObjectCacheService } from '../../cache/object-cache.service';
import { HALEndpointService } from '../../shared/hal-endpoint.service';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { HttpClient } from '@angular/common/http';
import { DSOChangeAnalyzer } from '../dso-change-analyzer.service';
import { AuthService } from '../../auth/auth.service';
import { SiteDataService } from '../site-data.service';
import { FindListOptions } from '../request.models';
import { followLink, FollowLinkConfig } from '../../../shared/utils/follow-link-config.model';
import { RemoteData } from '../remote-data';
import { PaginatedList } from '../paginated-list.model';
import { catchError, map, switchMap } from 'rxjs/operators';
import { hasValue, isNotEmpty } from '../../../shared/empty.util';
import { RequestParam } from '../../cache/models/request-param.model';
import { AuthorizationSearchParams } from './authorization-search-params';
import { addSiteObjectUrlIfEmpty, oneAuthorizationMatchesFeature } from './authorization-utils';
import { FeatureID } from './feature-id';
import { getFirstCompletedRemoteData } from '../../shared/operators';

/**
 * A service to retrieve {@link Authorization}s from the REST API
 */
@Injectable()
@dataService(AUTHORIZATION)
export class AuthorizationDataService extends DataService<Authorization> {
  protected linkPath = 'authorizations';
  protected searchByObjectPath = 'object';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DSOChangeAnalyzer<Authorization>,
    protected authService: AuthService,
    protected siteService: SiteDataService
  ) {
    super();
  }

  /**
   * Set all authorization requests to stale
   */
  invalidateAuthorizationsRequestCache() {
    this.requestService.setStaleByHrefSubstring(this.linkPath);
  }

  /**
   * Checks if an {@link EPerson} (or anonymous) has access to a specific object within a {@link Feature}
   * @param objectUrl     URL to the object to search {@link Authorization}s for.
   *                      If not provided, the repository's {@link Site} will be used.
   * @param ePersonUuid   UUID of the {@link EPerson} to search {@link Authorization}s for.
   *                      If not provided, the UUID of the currently authenticated {@link EPerson} will be used.
   * @param featureId     ID of the {@link Feature} to check {@link Authorization} for
   */
  isAuthorized(featureId?: FeatureID, objectUrl?: string, ePersonUuid?: string): Observable<boolean> {
    return this.searchByObject(featureId, objectUrl, ePersonUuid, {}, true, true, followLink('feature')).pipe(
      getFirstCompletedRemoteData(),
      map((authorizationRD) => {
        if (authorizationRD.statusCode !== 401 && hasValue(authorizationRD.payload) && isNotEmpty(authorizationRD.payload.page)) {
          return authorizationRD.payload.page;
        } else {
          return [];
        }
      }),
      catchError(() => observableOf(false)),
      oneAuthorizationMatchesFeature(featureId)
    );
  }

  /**
   * Search for a list of {@link Authorization}s using the "object" search endpoint and providing optional object url,
   * {@link EPerson} uuid and/or {@link Feature} id
   * @param objectUrl                   URL to the object to search {@link Authorization}s for.
   *                                    If not provided, the repository's {@link Site} will be used.
   * @param ePersonUuid                 UUID of the {@link EPerson} to search {@link Authorization}s for.
   *                                    If not provided, the UUID of the currently authenticated {@link EPerson} will be used.
   * @param featureId                   ID of the {@link Feature} to search {@link Authorization}s for
   * @param options                     {@link FindListOptions} to provide pagination and/or additional arguments
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
   *                                    no valid cached version. Defaults to true
   * @param reRequestOnStale            Whether or not the request should automatically be re-
   *                                    requested after the response becomes stale
   * @param linksToFollow               List of {@link FollowLinkConfig} that indicate which
   *                                    {@link HALLink}s should be automatically resolved
   */
  searchByObject(featureId?: FeatureID, objectUrl?: string, ePersonUuid?: string, options: FindListOptions = {}, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<Authorization>[]): Observable<RemoteData<PaginatedList<Authorization>>> {
    return observableOf(new AuthorizationSearchParams(objectUrl, ePersonUuid, featureId)).pipe(
      addSiteObjectUrlIfEmpty(this.siteService),
      switchMap((params: AuthorizationSearchParams) => {
        return this.searchBy(this.searchByObjectPath, this.createSearchOptions(params.objectUrl, options, params.ePersonUuid, params.featureId), useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
      })
    );
  }

  /**
   * Create {@link FindListOptions} with {@link RequestParam}s containing a "uri", "feature" and/or "eperson" parameter
   * @param objectUrl   Required parameter value to add to {@link RequestParam} "uri"
   * @param options     Optional initial {@link FindListOptions} to add parameters to
   * @param ePersonUuid Optional parameter value to add to {@link RequestParam} "eperson"
   * @param featureId   Optional parameter value to add to {@link RequestParam} "feature"
   */
  private createSearchOptions(objectUrl: string, options: FindListOptions = {}, ePersonUuid?: string, featureId?: FeatureID): FindListOptions {
    let params = [];
    if (isNotEmpty(options.searchParams)) {
      params = [...options.searchParams];
    }
    params.push(new RequestParam('uri', objectUrl));
    if (hasValue(featureId)) {
      params.push(new RequestParam('feature', featureId));
    }
    if (hasValue(ePersonUuid)) {
      params.push(new RequestParam('eperson', ePersonUuid));
    }
    return Object.assign(new FindListOptions(), options, {
      searchParams: [...params]
    });
  }
}
