/* eslint-disable max-classes-per-file */
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { ResponseParsingService } from './parsing.service';
import { RemoteData } from './remote-data';
import { GetRequest } from './request.models';
import { RequestService } from './request.service';
import { GenericConstructor } from '../shared/generic-constructor';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { SearchResponseParsingService } from './search-response-parsing.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { RestRequest } from './rest-request.model';
import { BaseDataService } from './base/base-data.service';
import { FindListOptions } from './find-list-options.model';
import { Duplicate } from '../../shared/object-list/duplicate-data/duplicate.model';
import { PaginatedList } from './paginated-list.model';
import { RequestParam } from '../cache/models/request-param.model';
import { ObjectCacheService } from '../cache/object-cache.service';


/**
 * Service that performs all general actions that have to do with the search page
 */
@Injectable()
export class DuplicateDataService extends BaseDataService<Duplicate> {

  /**
   * The ResponseParsingService constructor name
   */
  private parser: GenericConstructor<ResponseParsingService> = SearchResponseParsingService;

  /**
   * The RestRequest constructor name
   */
  private request: GenericConstructor<RestRequest> = GetRequest;

  /**
   * Subscription to unsubscribe from
   */
  private sub;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
  ) {
    super('duplicates', requestService, rdbService, objectCache, halService);
  }

  protected getEndpoint(): Observable<string> {
    return this.halService.getEndpoint(this.linkPath);
  }

  /**
   * Method to set service options
   * @param {GenericConstructor<ResponseParsingService>} parser The ResponseParsingService constructor name
   * @param {boolean} request The RestRequest constructor name
   */
  setServiceOptions(parser: GenericConstructor<ResponseParsingService>, request: GenericConstructor<RestRequest>) {
    if (parser) {
      this.parser = parser;
    }
    if (request) {
      this.request = request;
    }
  }

  private getSearchUrl(): Observable<string> {
    const href$ = this.getEndpoint();
    return href$.pipe(
      map((href) => href + '/search')
    );
  }

  public findDuplicates(uuid: string, options?: FindListOptions, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<Duplicate>[]): Observable<RemoteData<PaginatedList<Duplicate>>> {
    const searchParams = [new RequestParam('uuid', uuid)];
    let findListOptions = new FindListOptions();
    if (options) {
      findListOptions = Object.assign(new FindListOptions(), options);
    }
    if (findListOptions.searchParams) {
      findListOptions.searchParams = [...findListOptions.searchParams, ...searchParams];
    } else {
      findListOptions.searchParams = searchParams;
    }

    return this.findListByHref(this.getSearchUrl(), findListOptions, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }

  /**
   * Unsubscribe from the subscription
   */
  ngOnDestroy(): void {
    if (this.sub !== undefined) {
      this.sub.unsubscribe();
    }
  }
}
