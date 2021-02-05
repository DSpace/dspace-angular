import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { hasValue } from '../../shared/empty.util';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { dataService } from '../cache/builders/build-decorators';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { CoreState } from '../core.reducers';
import { Bundle } from '../shared/bundle.model';
import { BUNDLE } from '../shared/bundle.resource-type';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { Item } from '../shared/item.model';
import { DataService } from './data.service';
import { DefaultChangeAnalyzer } from './default-change-analyzer.service';
import { PaginatedList } from './paginated-list.model';
import { RemoteData } from './remote-data';
import { FindListOptions, GetRequest } from './request.models';
import { RequestService } from './request.service';
import { PaginatedSearchOptions } from '../../shared/search/paginated-search-options.model';
import { Bitstream } from '../shared/bitstream.model';
import { RequestEntryState } from './request.reducer';

/**
 * A service to retrieve {@link Bundle}s from the REST API
 */
@Injectable(
  {providedIn: 'root'}
)
@dataService(BUNDLE)
export class BundleDataService extends DataService<Bundle> {
  protected linkPath = 'bundles';
  protected bitstreamsEndpoint = 'bitstreams';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DefaultChangeAnalyzer<Bundle>) {
    super();
  }

  /**
   * Retrieve all {@link Bundle}s in the given {@link Item}
   *
   * @param item                        the {@link Item} the {@link Bundle}s are a part of
   * @param options                     the {@link FindListOptions} for the request
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
   *                                    no valid cached version. Defaults to true
   * @param reRequestOnStale            Whether or not the request should automatically be re-
   *                                    requested after the response becomes stale
   * @param linksToFollow               List of {@link FollowLinkConfig} that indicate which
   *                                    {@link HALLink}s should be automatically resolved
   */
  findAllByItem(item: Item, options?: FindListOptions, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<Bundle>[]): Observable<RemoteData<PaginatedList<Bundle>>> {
    return this.findAllByHref(item._links.bundles.href, options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }

  /**
   * Retrieve a {@link Bundle} in the given {@link Item} by name
   *
   * @param item                        the {@link Item} the {@link Bundle}s are a part of
   * @param bundleName                  the name of the {@link Bundle} to retrieve
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
   *                                    no valid cached version. Defaults to true
   * @param reRequestOnStale            Whether or not the request should automatically be re-
   *                                    requested after the response becomes stale
   * @param linksToFollow               List of {@link FollowLinkConfig} that indicate which
   *                                    {@link HALLink}s should be automatically resolved
   */
  // TODO should be implemented rest side
  findByItemAndName(item: Item, bundleName: string, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<Bundle>[]): Observable<RemoteData<Bundle>> {
    return this.findAllByItem(item, { elementsPerPage: 9999 }, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow).pipe(
      map((rd: RemoteData<PaginatedList<Bundle>>) => {
        if (hasValue(rd.payload) && hasValue(rd.payload.page)) {
          const matchingBundle = rd.payload.page.find((bundle: Bundle) =>
            bundle.name === bundleName);
          if (hasValue(matchingBundle)) {
            return new RemoteData(
              rd.timeCompleted,
              rd.msToLive,
              rd.lastUpdated,
              RequestEntryState.Success,
              null,
              matchingBundle,
              200
            );
          } else {
            return new RemoteData(
              rd.timeCompleted,
              rd.msToLive,
              rd.lastUpdated,
              RequestEntryState.Error,
              `The bundle with name ${bundleName} was not found.`,
              null,
              404
            );
          }
        } else {
          return rd as any;
        }
      }),
    );
  }

  /**
   * Get the bitstreams endpoint for a bundle
   * @param bundleId
   * @param searchOptions
   */
  getBitstreamsEndpoint(bundleId: string, searchOptions?: PaginatedSearchOptions): Observable<string> {
    return this.getBrowseEndpoint().pipe(
      switchMap((href: string) => this.halService.getEndpoint(this.bitstreamsEndpoint, `${href}/${bundleId}`)),
      map((href) => searchOptions ? searchOptions.toRestUrl(href) : href)
    );
  }

  /**
   * Get a bundle's bitstreams using paginated search options
   * @param bundleId        The bundle's ID
   * @param searchOptions   The search options to use
   * @param linksToFollow   The {@link FollowLinkConfig}s for the request
   */
  getBitstreams(bundleId: string, searchOptions?: PaginatedSearchOptions, ...linksToFollow: FollowLinkConfig<Bitstream>[]): Observable<RemoteData<PaginatedList<Bitstream>>> {
    const hrefObs = this.getBitstreamsEndpoint(bundleId, searchOptions);

    hrefObs.pipe(
      take(1)
    ).subscribe((href) => {
      const request = new GetRequest(this.requestService.generateRequestId(), href);
      this.requestService.send(request, true);
    });

    return this.rdbService.buildList<Bitstream>(hrefObs, ...linksToFollow);
  }
}
