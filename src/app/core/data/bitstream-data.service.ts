import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Bitstream } from '../shared/bitstream.model';
import { RequestService } from './request.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { NormalizedObjectBuildService } from '../cache/builders/normalized-object-build.service';
import { Store } from '@ngrx/store';
import { CoreState } from '../core.reducers';
import { BrowseService } from '../browse/browse.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DSOChangeAnalyzer } from './dso-change-analyzer.service';
import { FindListOptions, PutRequest } from './request.models';
import { Observable } from 'rxjs/internal/Observable';
import { RestResponse } from '../cache/response.models';
import { BitstreamFormatDataService } from './bitstream-format-data.service';
import { map, switchMap } from 'rxjs/operators';
import { combineLatest as observableCombineLatest } from 'rxjs';
import { HttpOptions } from '../dspace-rest-v2/dspace-rest-v2.service';
import {
  configureRequest,
  getResponseFromEntry,
} from '../shared/operators';
import { BitstreamFormat } from '../shared/bitstream-format.model';

/**
 * A service responsible for fetching/sending data from/to the REST API on the bitstreams endpoint
 */
@Injectable()
export class BitstreamDataService extends DataService<Bitstream> {
  protected linkPath = 'bitstreams';
  protected forceBypassCache = false;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected dataBuildService: NormalizedObjectBuildService,
    protected store: Store<CoreState>,
    protected bs: BrowseService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DSOChangeAnalyzer<Bitstream>,
    protected bitstreamFormatService: BitstreamFormatDataService) {
    super();
  }

  /**
   * Get the endpoint for browsing bitstreams
   * @param {FindListOptions} options
   * @param linkPath
   * @returns {Observable<string>}
   */
  getBrowseEndpoint(options: FindListOptions = {}, linkPath: string = this.linkPath): Observable<string> {
    return this.halService.getEndpoint(linkPath);
  }

  /**
   * Set the format of a bitstream
   * @param bitstream
   * @param format
   */
  updateFormat(bitstream: Bitstream, format: BitstreamFormat): Observable<RestResponse> {
    const requestId = this.requestService.generateRequestId();
    const bitstreamHref$ = this.getBrowseEndpoint().pipe(
      map((href: string) => `${href}/${bitstream.id}`),
      switchMap((href: string) => this.halService.getEndpoint('format', href))
    );
    const formatHref$ = this.bitstreamFormatService.getBrowseEndpoint().pipe(
      map((href: string) => `${href}/${format.id}`)
    );
    observableCombineLatest(bitstreamHref$, formatHref$).pipe(
      map(([bitstreamHref, formatHref]) => {
        const options: HttpOptions = Object.create({});
        let headers = new HttpHeaders();
        headers = headers.append('Content-Type', 'text/uri-list');
        options.headers = headers;
        return new PutRequest(requestId, bitstreamHref, formatHref, options);
      }),
      configureRequest(this.requestService)
    ).subscribe();

    return this.requestService.getByUUID(requestId).pipe(
      getResponseFromEntry()
    );
  }
}
