import { merge as observableMerge, Observable, throwError as observableThrowError } from 'rxjs';
import { distinctUntilChanged, filter, map, mergeMap, tap } from 'rxjs/operators';
import { RequestService } from '../data/request.service';
import { ConfigSuccessResponse } from '../cache/response.models';
import { ConfigRequest, FindListOptions, RestRequest } from '../data/request.models';
import { hasValue, isNotEmpty } from '../../shared/empty.util';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { ConfigData } from './config-data';
import { getResponseFromEntry } from '../shared/operators';

export abstract class ConfigService {
  protected request: ConfigRequest;
  protected abstract requestService: RequestService;
  protected abstract linkPath: string;
  protected abstract browseEndpoint: string;
  protected abstract halService: HALEndpointService;

  protected getConfig(request: RestRequest): Observable<ConfigData> {
    const responses = this.requestService.getByHref(request.href).pipe(
      getResponseFromEntry()
    );
    const errorResponses = responses.pipe(
      filter((response) => !response.isSuccessful),
      mergeMap(() => observableThrowError(new Error(`Couldn't retrieve the config`)))
    );
    const successResponses = responses.pipe(
      filter((response) => response.isSuccessful && isNotEmpty(response) && isNotEmpty((response as ConfigSuccessResponse).configDefinition)),
      map((response: ConfigSuccessResponse) => new ConfigData(response.pageInfo, response.configDefinition))
    );
    return observableMerge(errorResponses, successResponses);

  }

  protected getConfigByNameHref(endpoint, resourceName): string {
    return `${endpoint}/${resourceName}`;
  }

  protected getConfigSearchHref(endpoint, options: FindListOptions = {}): string {
    let result;
    const args = [];

    if (hasValue(options.scopeID)) {
      result = `${endpoint}/${this.browseEndpoint}`;
      args.push(`uuid=${options.scopeID}`);
    } else {
      result = endpoint;
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

  public getConfigAll(): Observable<ConfigData> {
    return this.halService.getEndpoint(this.linkPath).pipe(
      filter((href: string) => isNotEmpty(href)),
      distinctUntilChanged(),
      map((endpointURL: string) => new ConfigRequest(this.requestService.generateRequestId(), endpointURL)),
      tap((request: RestRequest) => this.requestService.configure(request)),
      mergeMap((request: RestRequest) => this.getConfig(request)),
      distinctUntilChanged());
  }

  public getConfigByHref(href: string): Observable<ConfigData> {
    const request = new ConfigRequest(this.requestService.generateRequestId(), href);
    this.requestService.configure(request);

    return this.getConfig(request);
  }

  public getConfigByName(name: string): Observable<ConfigData> {
    return this.halService.getEndpoint(this.linkPath).pipe(
      map((endpoint: string) => this.getConfigByNameHref(endpoint, name)),
      filter((href: string) => isNotEmpty(href)),
      distinctUntilChanged(),
      map((endpointURL: string) => new ConfigRequest(this.requestService.generateRequestId(), endpointURL)),
      tap((request: RestRequest) => this.requestService.configure(request)),
      mergeMap((request: RestRequest) => this.getConfig(request)),
      distinctUntilChanged());
  }

  public getConfigBySearch(options: FindListOptions = {}): Observable<ConfigData> {
    return this.halService.getEndpoint(this.linkPath).pipe(
      map((endpoint: string) => this.getConfigSearchHref(endpoint, options)),
      filter((href: string) => isNotEmpty(href)),
      distinctUntilChanged(),
      map((endpointURL: string) => new ConfigRequest(this.requestService.generateRequestId(), endpointURL)),
      tap((request: RestRequest) => this.requestService.configure(request)),
      mergeMap((request: RestRequest) => this.getConfig(request)),
      distinctUntilChanged());
  }

}
