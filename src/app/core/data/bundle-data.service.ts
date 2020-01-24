import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Bundle } from '../shared/bundle.model';
import { RequestService } from './request.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { NormalizedObjectBuildService } from '../cache/builders/normalized-object-build.service';
import { Store } from '@ngrx/store';
import { CoreState } from '../core.reducers';
import { ObjectCacheService } from '../cache/object-cache.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { HttpClient } from '@angular/common/http';
import { DefaultChangeAnalyzer } from './default-change-analyzer.service';
import { FindListOptions, GetRequest } from './request.models';
import { Observable } from 'rxjs/internal/Observable';
import { map, switchMap, take } from 'rxjs/operators';
import { RemoteData } from './remote-data';
import { PaginatedList } from './paginated-list';
import { Bitstream } from '../shared/bitstream.model';
import { PaginatedSearchOptions } from '../../shared/search/paginated-search-options.model';

/**
 * A service responsible for fetching/sending data from/to the REST API on the bundles endpoint
 */
@Injectable()
export class BundleDataService extends DataService<Bundle> {
  protected linkPath = 'bundles';
  protected bitstreamsEndpoint = 'bitstreams';
  protected forceBypassCache = false;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected dataBuildService: NormalizedObjectBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DefaultChangeAnalyzer<Bundle>) {
    super();
  }

  /**
   * Get the endpoint for browsing bundles
   * @param {FindListOptions} options
   * @returns {Observable<string>}
   */
  getBrowseEndpoint(options: FindListOptions = {}, linkPath?: string): Observable<string> {
    return this.halService.getEndpoint(this.linkPath);
  }

  /**
   * Get the bitstreams endpoint for a bundle
   * @param bundleId
   */
  getBitstreamsEndpoint(bundleId: string): Observable<string> {
    return this.getBrowseEndpoint().pipe(
      switchMap((href: string) => this.halService.getEndpoint(this.bitstreamsEndpoint, `${href}/${bundleId}`))
    );
  }

  /**
   * Get a bundle's bitstreams using paginated search options
   * @param bundleId        The bundle's ID
   * @param searchOptions   The search options to use
   */
  getBitstreams(bundleId: string, searchOptions?: PaginatedSearchOptions): Observable<RemoteData<PaginatedList<Bitstream>>> {
    const hrefObs = this.getBitstreamsEndpoint(bundleId).pipe(
      map((href) => searchOptions ? searchOptions.toRestUrl(href) : href)
    );
    hrefObs.pipe(
      take(1)
    ).subscribe((href) => {
      const request = new GetRequest(this.requestService.generateRequestId(), href);
      this.requestService.configure(request);
    });

    return this.rdbService.buildList<Bitstream>(hrefObs);
  }
}
