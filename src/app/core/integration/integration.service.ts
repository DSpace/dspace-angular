import { Observable } from 'rxjs/Observable';
import { RequestService } from '../data/request.service';
import { ResponseCacheService } from '../cache/response-cache.service';
import { ErrorResponse, IntegrationSuccessResponse, RestResponse } from '../cache/response-cache.models';
import { GetRequest, IntegrationRequest } from '../data/request.models';
import { ResponseCacheEntry } from '../cache/response-cache.reducer';
import { hasValue, isNotEmpty } from '../../shared/empty.util';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { IntegrationData } from './integration-data';
import { IntegrationSearchOptions } from './models/integration-options.model';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';

export abstract class IntegrationService {
  protected request: IntegrationRequest;
  protected abstract responseCache: ResponseCacheService;
  protected abstract requestService: RequestService;
  protected abstract rdbService: RemoteDataBuildService;
  protected abstract linkPath: string;
  protected abstract entriesEndpoint: string;
  protected abstract entryValueEndpoint: string;
  protected abstract halService: HALEndpointService;

  protected getData(request: GetRequest): Observable<IntegrationData> {
    const [successResponse, errorResponse] = this.responseCache.get(request.href)
      .map((entry: ResponseCacheEntry) => entry.response)
      .partition((response: RestResponse) => response.isSuccessful);
    return Observable.merge(
      errorResponse.flatMap((response: ErrorResponse) =>
        Observable.throw(new Error(`Couldn't retrieve the integration data`))),
      successResponse
        .filter((response: IntegrationSuccessResponse) => isNotEmpty(response))
        .map((response: IntegrationSuccessResponse) =>
          new IntegrationData(
            response.pageInfo,
            (response.dataDefinition) ? response.dataDefinition.page : []
          )
        )
        .distinctUntilChanged());
  }

  protected getEntriesHref(endpoint, options: IntegrationSearchOptions = new IntegrationSearchOptions()): string {
    let result;
    const args = [];

    if (hasValue(options.name)) {
      result = `${endpoint}/${options.name}/${this.entriesEndpoint}`;
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
      args.push(`sort=${options.sort.field},${options.sort.direction}`);
    }

    if (isNotEmpty(args)) {
      result = `${result}?${args.join('&')}`;
    }
    return result;
  }

  protected getEntryValueHref(endpoint, options: IntegrationSearchOptions = new IntegrationSearchOptions()): string {
    let result;
    const args = [];

    if (hasValue(options.name) && hasValue(options.query)) {
      result = `${endpoint}/${options.name}/${this.entryValueEndpoint}/${options.query}`;
    } else {
      result = endpoint;
    }

    if (hasValue(options.metadata)) {
      args.push(`metadata=${options.metadata}`);
    }

    if (isNotEmpty(args)) {
      result = `${result}?${args.join('&')}`;
    }

    return result;
  }

  public getEntriesByName(options: IntegrationSearchOptions): Observable<IntegrationData> {
    return this.halService.getEndpoint(this.linkPath)
      .map((endpoint: string) => this.getEntriesHref(endpoint, options))
      .filter((href: string) => isNotEmpty(href))
      .distinctUntilChanged()
      .map((endpointURL: string) => new IntegrationRequest(this.requestService.generateRequestId(), endpointURL))
      .do((request: GetRequest) => this.requestService.configure(request))
      .flatMap((request: GetRequest) => this.getData(request))
      .distinctUntilChanged();
  }

  public getEntryByValue(options: IntegrationSearchOptions): Observable<IntegrationData> {
    return this.halService.getEndpoint(this.linkPath)
      .map((endpoint: string) => this.getEntryValueHref(endpoint, options))
      .filter((href: string) => isNotEmpty(href))
      .distinctUntilChanged()
      .map((endpointURL: string) => new IntegrationRequest(this.requestService.generateRequestId(), endpointURL))
      .do((request: GetRequest) => this.requestService.configure(request))
      .flatMap((request: GetRequest) => this.getData(request))
      .distinctUntilChanged();
  }
}
