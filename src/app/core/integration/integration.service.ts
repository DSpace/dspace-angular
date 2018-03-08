import { Observable } from 'rxjs/Observable';
import { RequestService } from '../data/request.service';
import { ResponseCacheService } from '../cache/response-cache.service';
import { GlobalConfig } from '../../../config/global-config.interface';
import { ErrorResponse, IntegrationSuccessResponse, RestResponse } from '../cache/response-cache.models';
import { EpersonRequest, IntegrationRequest, GetRequest } from '../data/request.models';
import { ResponseCacheEntry } from '../cache/response-cache.reducer';
import { hasValue, isNotEmpty } from '../../shared/empty.util';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { IntegrationData } from './integration-data';
import { IntegrationSearchOptions } from './models/integration-options.model';

export abstract class IntegrationService extends HALEndpointService {
  protected request: EpersonRequest;
  protected abstract responseCache: ResponseCacheService;
  protected abstract requestService: RequestService;
  protected abstract linkName: string;
  protected abstract EnvConfig: GlobalConfig;
  protected abstract browseEndpoint: string;

  protected getData(request: GetRequest): Observable<IntegrationData> {
    const [successResponse, errorResponse] = this.responseCache.get(request.href)
      .map((entry: ResponseCacheEntry) => entry.response)
      .partition((response: RestResponse) => response.isSuccessful);
    return Observable.merge(
      errorResponse.flatMap((response: ErrorResponse) =>
        Observable.throw(new Error(`Couldn't retrieve the integration data`))),
      successResponse
        .filter((response: IntegrationSuccessResponse) => isNotEmpty(response))
        .map((response: IntegrationSuccessResponse) => new IntegrationData(response.pageInfo, response.dataDefinition))
        .distinctUntilChanged());
  }

  protected getIntegrationHref(endpoint, options: IntegrationSearchOptions = new IntegrationSearchOptions()): string {
    let result;
    const args = [];

    if (hasValue(options.name)) {
      result = `${endpoint}/${options.name}/${this.browseEndpoint}`;
    } else {
      result = endpoint;
    }

    if (hasValue(options.query)) {
      args.push(`query=${options.query}`);
    }

    if (hasValue(options.metadata)) {
      args.push(`metadata=${options.metadata}`);
    }

    if (hasValue(options.uuid)) {
      args.push(`uuid=${options.uuid}`);
    }

    if (hasValue(options.currentPage) && typeof options.currentPage === 'number') {
      /* TODO: this is a temporary fix for the pagination start index (0 or 1) discrepancy between the rest and the frontend respectively */
      args.push(`page=${options.currentPage - 1}`);
    }

    if (hasValue(options.elementsPerPage)) {
      args.push(`size=${options.elementsPerPage}`);
    }

    if (hasValue(options.sort)) {
      let direction = 'asc';
      if (options.sort.direction === 1) {
        direction = 'desc';
      }
      args.push(`sort=${options.sort.field},${direction}`);
    }

    if (isNotEmpty(args)) {
      result = `${result}?${args.join('&')}`;
    }
    return result;
  }

  public getEntriesByName(options: IntegrationSearchOptions): Observable<IntegrationData> {
    return this.getEndpoint()
      .map((endpoint: string) => this.getIntegrationHref(endpoint, options))
      .filter((href: string) => isNotEmpty(href))
      .distinctUntilChanged()
      .map((endpointURL: string) => new IntegrationRequest(this.requestService.generateRequestId(), endpointURL))
      .do((request: GetRequest) => this.requestService.configure(request))
      .flatMap((request: GetRequest) => this.getData(request))
      .distinctUntilChanged();
  }

  // /integration/authorities/${authorityOptions.name}/entries?query=${authorityOptions.query}&metadata=${authorityOptions.metadata}&uuid=${authorityOptions.uuid}${queryPage}
}
