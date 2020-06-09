import { Observable, of as observableOf, throwError as observableThrowError } from 'rxjs';
import { distinctUntilChanged, filter, first, map, mergeMap, tap } from 'rxjs/operators';

import { RequestService } from '../data/request.service';
import { IntegrationSuccessResponse } from '../cache/response.models';
import { FindListOptions, GetRequest, IntegrationRequest } from '../data/request.models';
import { hasValue, isNotEmpty } from '../../shared/empty.util';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { IntegrationData } from './integration-data';
import { IntegrationSearchOptions } from './models/integration-options.model';
import { getResponseFromEntry } from '../shared/operators';
import { DataService } from '../data/data.service';
import { CacheableObject } from '../cache/object-cache.reducer';
import { RequestParam } from '../cache/models/request-param.model';

/**
 * An abstract class that provides methods to make REST requests with integration endpoint.
 */
export abstract class IntegrationService<T extends CacheableObject> extends DataService<T> {
  protected request: IntegrationRequest;
  protected abstract requestService: RequestService;
  protected abstract linkPath: string;
  protected abstract entriesEndpoint: string;
  protected abstract entryValueEndpoint: string;
  protected abstract halService: HALEndpointService;

  getBrowseEndpoint(options: FindListOptions, linkPath?: string): Observable<string> {
    return undefined;
  }

  /**
   * Fetch a RestRequest
   *
   * @param request
   *    The get request
   * @return Observable<IntegrationData>
   *     server response
   */
  protected getData(request: GetRequest): Observable<IntegrationData> {
    return this.requestService.getByHref(request.href).pipe(
      getResponseFromEntry(),
      mergeMap((response: IntegrationSuccessResponse) => {
        if (response.isSuccessful && isNotEmpty(response)) {
          return observableOf(new IntegrationData(
            response.pageInfo,
            (response.dataDefinition) ? response.dataDefinition.page : []
          ));
        } else if (!response.isSuccessful) {
          console.log((response as any).errorMessage);
          return observableThrowError(new Error(`Couldn't retrieve the integration data`));
        }
      }),
      distinctUntilChanged()
    );
  }

  /**
   * Create the entries HREF with given options object
   *
   * @param endpoint The endpoint for the object
   * @param options The [[IntegrationSearchOptions]] object
   * @return {Observable<string>}
   *    Return an observable that emits created HREF
   */
  protected getEntriesHref(endpoint, options: IntegrationSearchOptions = new IntegrationSearchOptions()): string {
    let href;
    const args = [];

    if (hasValue(options.name)) {
      href = `${endpoint}/${options.name}/${this.entriesEndpoint}`;
    } else {
      href = endpoint;
    }

    if (hasValue(options.searchParams)) {
      options.searchParams.forEach((param: RequestParam) => {
        args.push(`${param.fieldName}=${param.fieldValue}`);
      })
    }

    return this.buildHrefFromFindOptions(href, options, args);
  }

  /**
   * Create the entryValue HREF with given options object
   *
   * @param endpoint The endpoint for the object
   * @param options The [[IntegrationSearchOptions]] object
   * @return {Observable<string>}
   *    Return an observable that emits created HREF
   */
  protected getEntryValueHref(endpoint, options: IntegrationSearchOptions = new IntegrationSearchOptions()): string {
    let href;
    const args = [];

    if (hasValue(options.name) && hasValue(options.query)) {
      href = `${endpoint}/${options.name}/${this.entryValueEndpoint}/${options.query}`;
    } else {
      href = endpoint;
    }

    if (hasValue(options.searchParams)) {
      options.searchParams
        .filter((param: RequestParam) => param.fieldName !== 'query')
        .forEach((param: RequestParam) => {
          args.push(`${param.fieldName}=${param.fieldValue}`);
        })
    }

    return this.buildHrefFromFindOptions(href, options, args);
  }

  /**
   * Create the HREF for a specific object's search method with given options object
   *
   * @param endpoint The endpoint for the object
   * @param searchMethod The search method for the object
   * @param options The [[IntegrationSearchOptions]] object
   * @return {Observable<string>}
   *    Return an observable that emits created HREF
   */
  protected getEntriesSearchByHref(
    endpoint: string,
    searchMethod: string,
    options: IntegrationSearchOptions = new IntegrationSearchOptions()): Observable<string> {

    const args = [];

    if (hasValue(options.searchParams)) {
      options.searchParams.forEach((param: RequestParam) => {
        args.push(`${param.fieldName}=${param.fieldValue}`);
      })
    }

    return this.getEntriesSearchEndpoint(endpoint, searchMethod, options.name).pipe(
      map((href) => this.buildHrefFromFindOptions(href, options, args))
    );
  }

  /**
   * Return object search endpoint by given search method
   *
   * @param endpoint The endpoint for the object
   * @param searchMethod The search method for the object
   * @param name The resource name
   */
  protected getEntriesSearchEndpoint(endpoint: string, searchMethod: string, name: string): Observable<string> {
    return this.halService.getEndpoint(endpoint).pipe(
      filter((href: string) => isNotEmpty(href)),
      map((href: string) => `${href}/${name}/${this.entriesEndpoint}/search/${searchMethod}`));
  }

  /**
   * Make a new entries search request with given search method
   *
   * @param searchMethod The search method for the object
   * @param options The [[IntegrationSearchOptions]] object
   * @return {Observable<IntegrationData>}
   *    Return an observable that emits response from the server
   */
  protected searchEntriesBy(
    searchMethod: string,
    options: IntegrationSearchOptions = new IntegrationSearchOptions()): Observable<IntegrationData> {

    return this.getEntriesSearchByHref(this.linkPath, searchMethod, options).pipe(
      first((href: string) => hasValue(href)),
      map((endpointURL: string) => new IntegrationRequest(this.requestService.generateRequestId(), endpointURL)),
      tap((request: GetRequest) => this.requestService.configure(request)),
      mergeMap((request: GetRequest) => this.getData(request)),
      distinctUntilChanged()
    );
  }

  /**
   * Make a new entries request
   *
   * @param options The [[IntegrationSearchOptions]] object
   * @return {Observable<IntegrationData>}
   *    Return an observable that emits response from the server
   */
  public getEntriesByName(options: IntegrationSearchOptions): Observable<IntegrationData> {
    return this.halService.getEndpoint(this.linkPath).pipe(
      map((endpoint: string) => this.getEntriesHref(endpoint, options)),
      filter((href: string) => isNotEmpty(href)),
      distinctUntilChanged(),
      map((endpointURL: string) => new IntegrationRequest(this.requestService.generateRequestId(), endpointURL)),
      tap((request: GetRequest) => this.requestService.configure(request)),
      mergeMap((request: GetRequest) => this.getData(request)),
      distinctUntilChanged());
  }

  /**
   * Make a new entryValue request
   *
   * @param options The [[IntegrationSearchOptions]] object
   * @return {Observable<IntegrationData>}
   *    Return an observable that emits response from the server
   */
  public getEntryByValue(options: IntegrationSearchOptions): Observable<IntegrationData> {
    return this.halService.getEndpoint(this.linkPath).pipe(
      map((endpoint: string) => this.getEntryValueHref(endpoint, options)),
      filter((href: string) => isNotEmpty(href)),
      distinctUntilChanged(),
      map((endpointURL: string) => new IntegrationRequest(this.requestService.generateRequestId(), endpointURL)),
      tap((request: GetRequest) => this.requestService.configure(request)),
      mergeMap((request: GetRequest) => this.getData(request)),
      distinctUntilChanged());
  }

}
