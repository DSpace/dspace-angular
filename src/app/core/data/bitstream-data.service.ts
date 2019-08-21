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
import { HttpClient } from '@angular/common/http';
import { DSOChangeAnalyzer } from './dso-change-analyzer.service';
import { FindAllOptions } from './request.models';
import { Observable } from 'rxjs/internal/Observable';
import { RestResponse } from '../cache/response.models';

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
    protected comparator: DSOChangeAnalyzer<Bitstream>) {
    super();
  }

  /**
   * Get the endpoint for browsing bitstreams
   * @param {FindAllOptions} options
   * @param linkPath
   * @returns {Observable<string>}
   */
  getBrowseEndpoint(options: FindAllOptions = {}, linkPath: string = this.linkPath): Observable<string> {
    return this.halService.getEndpoint(linkPath);
  }

  /**
   * Delete an existing DSpace Object on the server
   * @param bitstream The Bitstream to be removed
   * De-cache the removed bitstream from Object and Request cache
   * Return an observable of the completed response
   */
  deleteAndReturnResponse(bitstream: Bitstream): Observable<RestResponse> {
    const response$ = super.deleteAndReturnResponse(bitstream);
    this.objectCache.remove(bitstream.self);
    this.requestService.removeByHrefSubstring(bitstream.self);
    return response$;
  }
}
