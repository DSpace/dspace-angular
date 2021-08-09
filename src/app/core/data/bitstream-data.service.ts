import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest as observableCombineLatest, Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { hasValue } from '../../shared/empty.util';
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
import { buildPaginatedList, PaginatedList } from './paginated-list.model';
import { RemoteData } from './remote-data';
import { FindListOptions, PutRequest } from './request.models';
import { RequestService } from './request.service';
import { BitstreamFormatDataService } from './bitstream-format-data.service';
import { BitstreamFormat } from '../shared/bitstream-format.model';
import { HttpOptions } from '../dspace-rest/dspace-rest.service';
import { sendRequest } from '../shared/operators';
import { createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';
import { PageInfo } from '../shared/page-info.model';
import { RequestParam } from '../cache/models/request-param.model';

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
   * @param bundle                      the bundle to retrieve bitstreams from
   * @param options                     options for the find all request
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
   *                                    no valid cached version. Defaults to true
   * @param reRequestOnStale            Whether or not the request should automatically be re-
   *                                    requested after the response becomes stale
   * @param linksToFollow               List of {@link FollowLinkConfig} that indicate which
   *                                    {@link HALLink}s should be automatically resolved
   */
  findAllByBundle(bundle: Bundle, options?: FindListOptions, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<Bitstream>[]): Observable<RemoteData<PaginatedList<Bitstream>>> {
    return this.findAllByHref(bundle._links.bitstreams.href, options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }

  /**
   * Retrieve all {@link Bitstream}s in a certain {@link Bundle}.
   *
   * The {@link Item} is technically redundant, but is available
   * in all current use cases, and having it simplifies this method
   *
   * @param item                        the {@link Item} the {@link Bundle} is a part of
   * @param bundleName                  the name of the {@link Bundle} we want to find
   *                                    {@link Bitstream}s for
   * @param options                     the {@link FindListOptions} for the request
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
   *                                    no valid cached version. Defaults to true
   * @param reRequestOnStale            Whether or not the request should automatically be re-
   *                                    requested after the response becomes stale
   * @param linksToFollow               List of {@link FollowLinkConfig} that indicate which
   *                                    {@link HALLink}s should be automatically resolved
   */
  public findAllByItemAndBundleName(item: Item, bundleName: string, options?: FindListOptions, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<Bitstream>[]): Observable<RemoteData<PaginatedList<Bitstream>>> {
    return this.bundleService.findByItemAndName(item, bundleName).pipe(
      switchMap((bundleRD: RemoteData<Bundle>) => {
        if (bundleRD.hasSucceeded && hasValue(bundleRD.payload)) {
          return this.findAllByBundle(bundleRD.payload, options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
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
      sendRequest(this.requestService),
      take(1)
    ).subscribe(() => {
      this.requestService.removeByHrefSubstring(bitstream.self + '/format');
    });

    return this.rdbService.buildFromRequestUUID(requestId);
  }

  /**
   * Returns an observable of {@link RemoteData} of a {@link Bitstream}, based on a handle and an
   * optional sequenceId or filename, with a list of {@link FollowLinkConfig}, to automatically
   * resolve {@link HALLink}s of the object
   *
   * @param handle                      The handle of the bitstream we want to retrieve
   * @param sequenceId                  The sequence id of the bitstream we want to retrieve
   * @param filename                    The filename of the bitstream we want to retrieve
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
   *                                    no valid cached version. Defaults to true
   * @param reRequestOnStale            Whether or not the request should automatically be re-
   *                                    requested after the response becomes stale
   * @param linksToFollow               List of {@link FollowLinkConfig} that indicate which
   *                                    {@link HALLink}s should be automatically resolved
   */
  findByItemHandle(
    handle: string,
    sequenceId?: string,
    filename?: string,
    useCachedVersionIfAvailable = true,
    reRequestOnStale = true,
    ...linksToFollow: FollowLinkConfig<Bitstream>[]
  ): Observable<RemoteData<Bitstream>> {
    const searchParams = [];
    searchParams.push(new RequestParam('handle', handle));
    if (hasValue(sequenceId)) {
      searchParams.push(new RequestParam('sequenceId', sequenceId));
    }
    if (hasValue(filename)) {
      searchParams.push(new RequestParam('filename', filename));
    }

    const hrefObs = this.getSearchByHref(
      'byItemHandle',
      { searchParams },
      ...linksToFollow
    );

    return this.findByHref(
      hrefObs,
      useCachedVersionIfAvailable,
      reRequestOnStale,
      ...linksToFollow
    );
  }

}
