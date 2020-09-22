import { of as observableOf } from 'rxjs';
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
import { FindListOptions, FindListRequest } from '../request.models';
import { followLink, FollowLinkConfig } from '../../../shared/utils/follow-link-config.model';
import { Observable } from 'rxjs/internal/Observable';
import { RemoteData } from '../remote-data';
import { PaginatedList } from '../paginated-list';
import { find, map, switchMap, tap } from 'rxjs/operators';
import { hasValue, isNotEmpty } from '../../../shared/empty.util';
import { RequestParam } from '../../cache/models/request-param.model';
import { AuthorizationSearchParams } from './authorization-search-params';
import {
  addSiteObjectUrlIfEmpty,
  oneAuthorizationMatchesFeature
} from './authorization-utils';
import { FeatureID } from './feature-id';

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
   * Checks if an {@link EPerson} (or anonymous) has access to a specific object within a {@link Feature}
   * @param objectUrl     URL to the object to search {@link Authorization}s for.
   *                      If not provided, the repository's {@link Site} will be used.
   * @param ePersonUuid   UUID of the {@link EPerson} to search {@link Authorization}s for.
   *                      If not provided, the UUID of the currently authenticated {@link EPerson} will be used.
   * @param featureId     ID of the {@link Feature} to check {@link Authorization} for
   */
  isAuthorized(featureId?: FeatureID, objectUrl?: string, ePersonUuid?: string): Observable<boolean> {
    return this.searchByObject(featureId, objectUrl, ePersonUuid, {}, followLink('feature')).pipe(
      map((authorizationRD) => {
        if (authorizationRD.statusCode !== 401 && hasValue(authorizationRD.payload) && isNotEmpty(authorizationRD.payload.page)) {
          return authorizationRD.payload.page;
        } else {
          return [];
        }
      }),
      oneAuthorizationMatchesFeature(featureId)
    );
  }

  /**
   * Search for a list of {@link Authorization}s using the "object" search endpoint and providing optional object url,
   * {@link EPerson} uuid and/or {@link Feature} id
   * @param objectUrl     URL to the object to search {@link Authorization}s for.
   *                      If not provided, the repository's {@link Site} will be used.
   * @param ePersonUuid   UUID of the {@link EPerson} to search {@link Authorization}s for.
   *                      If not provided, the UUID of the currently authenticated {@link EPerson} will be used.
   * @param featureId     ID of the {@link Feature} to search {@link Authorization}s for
   * @param options       {@link FindListOptions} to provide pagination and/or additional arguments
   * @param linksToFollow List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved
   */
  searchByObject(featureId?: FeatureID, objectUrl?: string, ePersonUuid?: string, options: FindListOptions = {}, ...linksToFollow: Array<FollowLinkConfig<Authorization>>): Observable<RemoteData<PaginatedList<Authorization>>> {
    return observableOf(new AuthorizationSearchParams(objectUrl, ePersonUuid, featureId)).pipe(
      addSiteObjectUrlIfEmpty(this.siteService),
      switchMap((params: AuthorizationSearchParams) => {
        return this.searchBy(this.searchByObjectPath, this.createSearchOptions(params.objectUrl, options, params.ePersonUuid, params.featureId), ...linksToFollow);
      })
    );
  }

  /**
   * Make a new FindListRequest with given search method
   *
   * @param searchMethod The search method for the object
   * @param options The [[FindListOptions]] object
   * @param linksToFollow The array of [[FollowLinkConfig]]
   * @return {Observable<RemoteData<PaginatedList<Authorization>>}
   *    Return an observable that emits response from the server
   */
  searchBy(searchMethod: string, options: FindListOptions = {}, ...linksToFollow: Array<FollowLinkConfig<Authorization>>): Observable<RemoteData<PaginatedList<Authorization>>> {
    const hrefObs = this.getSearchByHref(searchMethod, options, ...linksToFollow);

    return hrefObs.pipe(
      find((href: string) => hasValue(href)),
      tap((href: string) => {
          const request = new FindListRequest(this.requestService.generateRequestId(), href, options);

          this.requestService.configure(request);
        }
      ),
      switchMap((href) => this.requestService.getByHref(href)),
      switchMap((href) =>
        this.rdbService.buildList<Authorization>(hrefObs, ...linksToFollow) as Observable<RemoteData<PaginatedList<Authorization>>>
      )
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
    params.push(new RequestParam('uri', objectUrl))
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
