import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest as observableCombineLatest, Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { hasValue, isNotEmpty } from '../../shared/empty.util';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { dataService } from '../cache/builders/build-decorators';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { CoreState } from '../core.reducers';
import { Bitstream } from '../shared/bitstream.model';
import { BITSTREAM } from '../shared/bitstream.resource-type';
import { Bundle } from '../shared/bundle.model';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { Item } from '../shared/item.model';
import { BundleDataService } from './bundle-data.service';
import { DataService } from './data.service';
import { DSOChangeAnalyzer } from './dso-change-analyzer.service';
import { PaginatedList, buildPaginatedList } from './paginated-list.model';
import { RemoteData } from './remote-data';
import { FindListOptions, PutRequest } from './request.models';
import { RequestService } from './request.service';
import { BitstreamFormatDataService } from './bitstream-format-data.service';
import { BitstreamFormat } from '../shared/bitstream-format.model';
import { HttpOptions } from '../dspace-rest/dspace-rest.service';
import { configureRequest } from '../shared/operators';
import { createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';
import { PageInfo } from '../shared/page-info.model';
import { RequestEntryState } from './request.reducer';

/**
 * A service to retrieve {@link Bitstream}s from the REST API
 */
@Injectable({
  providedIn: 'root'
})
@dataService(BITSTREAM)
export class BitstreamDataService extends DataService<Bitstream> {

  /**
   * The HAL path to the bitstream endpoint
   */
  protected linkPath = 'bitstreams';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DSOChangeAnalyzer<Bitstream>,
    protected bundleService: BundleDataService,
    protected bitstreamFormatService: BitstreamFormatDataService
  ) {
    super();
  }

  /**
   * Retrieves the {@link Bitstream}s in a given bundle
   *
   * @param bundle            the bundle to retrieve bitstreams from
   * @param options           options for the find all request
   * @param reRequestOnStale  Whether or not the request should automatically be re-requested after
   *                          the response becomes stale
   * @param linksToFollow     List of {@link FollowLinkConfig} that indicate which {@link HALLink}s
   *                          should be automatically resolved
   */
  findAllByBundle(bundle: Bundle, options?: FindListOptions, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<Bitstream>[]): Observable<RemoteData<PaginatedList<Bitstream>>> {
    return this.findAllByHref(bundle._links.bitstreams.href, options, reRequestOnStale, ...linksToFollow);
  }

  /**
   * Retrieves the thumbnail for the given item
   * @returns {Observable<RemoteData<{@link Bitstream}>>} the first bitstream in the THUMBNAIL bundle
   */
  // TODO should be implemented rest side. {@link Item} should get a thumbnail link
  public getThumbnailFor(item: Item): Observable<RemoteData<Bitstream>> {
    return this.bundleService.findByItemAndName(item, 'THUMBNAIL').pipe(
      switchMap((bundleRD: RemoteData<Bundle>) => {
        if (isNotEmpty(bundleRD.payload)) {
          return this.findAllByBundle(bundleRD.payload, { elementsPerPage: 1 }).pipe(
            map((bitstreamRD: RemoteData<PaginatedList<Bitstream>>) => {
              if (hasValue(bitstreamRD.payload) && hasValue(bitstreamRD.payload.page)) {
                return new RemoteData(
                  bitstreamRD.timeCompleted,
                  bitstreamRD.msToLive,
                  bitstreamRD.lastUpdated,
                  bitstreamRD.state,
                  bitstreamRD.errorMessage,
                  bitstreamRD.payload.page[0],
                  bitstreamRD.statusCode
                );
              } else {
                return bitstreamRD as any;
              }
            })
          );
        } else {
          return [bundleRD as any];
        }
      })
    );
  }

  /**
   * Retrieve the matching thumbnail for a {@link Bitstream}.
   *
   * The {@link Item} is technically redundant, but is available
   * in all current use cases, and having it simplifies this method
   *
   * @param item The {@link Item} the {@link Bitstream} and its thumbnail are a part of
   * @param bitstreamInOriginal The original {@link Bitstream} to find the thumbnail for
   */
  // TODO should be implemented rest side
  public getMatchingThumbnail(item: Item, bitstreamInOriginal: Bitstream): Observable<RemoteData<Bitstream>> {
    return this.bundleService.findByItemAndName(item, 'THUMBNAIL').pipe(
      switchMap((bundleRD: RemoteData<Bundle>) => {
        if (isNotEmpty(bundleRD.payload)) {
          return this.findAllByBundle(bundleRD.payload, { elementsPerPage: Number.MAX_SAFE_INTEGER }).pipe(
            map((bitstreamRD: RemoteData<PaginatedList<Bitstream>>) => {
              if (hasValue(bitstreamRD.payload) && hasValue(bitstreamRD.payload.page)) {
                const matchingThumbnail = bitstreamRD.payload.page.find((thumbnail: Bitstream) =>
                  thumbnail.name.startsWith(bitstreamInOriginal.name)
                );
                if (hasValue(matchingThumbnail)) {
                  return new RemoteData(
                    bitstreamRD.timeCompleted,
                    bitstreamRD.msToLive,
                    bitstreamRD.lastUpdated,
                    bitstreamRD.state,
                    bitstreamRD.errorMessage,
                    matchingThumbnail,
                    bitstreamRD.statusCode
                  );
                } else {
                  return new RemoteData(
                    bitstreamRD.timeCompleted,
                    bitstreamRD.msToLive,
                    bitstreamRD.lastUpdated,
                    RequestEntryState.Error,
                    'No matching thumbnail found',
                    undefined,
                    404
                  );
                }
              } else {
                return bitstreamRD as any;
              }
            })
          );
        } else {
          return [bundleRD as any];
        }
      })
    );
  }

  /**
   * Retrieve all {@link Bitstream}s in a certain {@link Bundle}.
   *
   * The {@link Item} is technically redundant, but is available
   * in all current use cases, and having it simplifies this method
   *
   * @param item              the {@link Item} the {@link Bundle} is a part of
   * @param bundleName        the name of the {@link Bundle} we want to find {@link Bitstream}s for
   * @param options the {@link FindListOptions} for the request
   * @param reRequestOnStale  Whether or not the request should automatically be re-requested after
   *                          the response becomes stale
   * @param linksToFollow     List of {@link FollowLinkConfig} that indicate which {@link HALLink}s
   *                          should be automatically resolved
   */
  public findAllByItemAndBundleName(item: Item, bundleName: string, options?: FindListOptions, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<Bitstream>[]): Observable<RemoteData<PaginatedList<Bitstream>>> {
    return this.bundleService.findByItemAndName(item, bundleName).pipe(
      switchMap((bundleRD: RemoteData<Bundle>) => {
        if (bundleRD.hasSucceeded && hasValue(bundleRD.payload)) {
          return this.findAllByBundle(bundleRD.payload, options, reRequestOnStale, ...linksToFollow);
        } else if (!bundleRD.hasSucceeded && bundleRD.statusCode === 404) {
          return createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo(), []), new Date().getTime());
        } else {
          return [bundleRD as any];
        }
      })
    );
  }

  /**
   * Set the format of a bitstream
   * @param bitstream
   * @param format
   */
  updateFormat(bitstream: Bitstream, format: BitstreamFormat): Observable<RemoteData<Bitstream>> {
    const requestId = this.requestService.generateRequestId();
    const bitstreamHref$ = this.getBrowseEndpoint().pipe(
      map((href: string) => `${href}/${bitstream.id}`),
      switchMap((href: string) => this.halService.getEndpoint('format', href))
    );
    const formatHref$ = this.bitstreamFormatService.getBrowseEndpoint().pipe(
      map((href: string) => `${href}/${format.id}`)
    );
    observableCombineLatest([bitstreamHref$, formatHref$]).pipe(
      map(([bitstreamHref, formatHref]) => {
        const options: HttpOptions = Object.create({});
        let headers = new HttpHeaders();
        headers = headers.append('Content-Type', 'text/uri-list');
        options.headers = headers;
        return new PutRequest(requestId, bitstreamHref, formatHref, options);
      }),
      configureRequest(this.requestService),
      take(1)
    ).subscribe(() => {
      this.requestService.removeByHrefSubstring(bitstream.self + '/format');
    });

    return this.rdbService.buildFromRequestUUID(requestId);
  }

}
