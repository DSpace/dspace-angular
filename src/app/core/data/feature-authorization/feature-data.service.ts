import { Observable } from 'rxjs/internal/Observable';
import { Injectable } from '@angular/core';
import { FEATURE } from '../../shared/feature.resource-type';
import { dataService } from '../../cache/builders/build-decorators';
import { DataService } from '../data.service';
import { Feature } from '../../shared/feature.model';
import { RequestService } from '../request.service';
import { RemoteDataBuildService } from '../../cache/builders/remote-data-build.service';
import { Store } from '@ngrx/store';
import { CoreState } from '../../core.reducers';
import { ObjectCacheService } from '../../cache/object-cache.service';
import { HALEndpointService } from '../../shared/hal-endpoint.service';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { HttpClient } from '@angular/common/http';
import { DSOChangeAnalyzer } from '../dso-change-analyzer.service';
import { FindListOptions, FindListRequest } from '../request.models';
import { FollowLinkConfig } from '../../../shared/utils/follow-link-config.model';
import { RemoteData } from '../remote-data';
import { PaginatedList } from '../paginated-list';
import { find, skipWhile, switchMap, tap } from 'rxjs/operators';
import { hasValue } from '../../../shared/empty.util';

/**
 * A service to retrieve {@link Feature}s from the REST API
 */
@Injectable()
@dataService(FEATURE)
export class FeatureDataService extends DataService<Feature> {
  protected linkPath = 'features';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DSOChangeAnalyzer<Feature>
  ) {
    super();
  }

  /**
   * Make a new FindListRequest with given search method
   *
   * @param searchMethod The search method for the object
   * @param options The [[FindListOptions]] object
   * @param linksToFollow The array of [[FollowLinkConfig]]
   * @return {Observable<RemoteData<PaginatedList<Feature>>}
   *    Return an observable that emits response from the server
   */
  searchBy(searchMethod: string, options: FindListOptions = {}, ...linksToFollow: Array<FollowLinkConfig<Feature>>): Observable<RemoteData<PaginatedList<Feature>>> {
    const hrefObs = this.getSearchByHref(searchMethod, options, ...linksToFollow);

    return hrefObs.pipe(
      find((href: string) => hasValue(href)),
      tap((href: string) => {
          this.requestService.removeByHrefSubstring(href);
          const request = new FindListRequest(this.requestService.generateRequestId(), href, options);

          this.requestService.configure(request);
        }
      ),
      switchMap((href) => this.requestService.getByHref(href)),
      skipWhile((requestEntry) => hasValue(requestEntry) && requestEntry.completed),
      switchMap((href) =>
        this.rdbService.buildList<Feature>(hrefObs, ...linksToFollow) as Observable<RemoteData<PaginatedList<Feature>>>
      )
    );
  }
}
