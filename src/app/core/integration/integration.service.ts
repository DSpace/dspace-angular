import { Observable, of as observableOf, throwError as observableThrowError } from 'rxjs';
import { distinctUntilChanged, filter, map, mergeMap, tap } from 'rxjs/operators';
import { RequestService } from '../data/request.service';
import { IntegrationSuccessResponse } from '../cache/response.models';
import { GetRequest, IntegrationRequest } from '../data/request.models';
import { hasValue, isNotEmpty } from '../../shared/empty.util';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { IntegrationData } from './integration-data';
import { IntegrationSearchOptions } from './models/integration-options.model';
import { getResponseFromEntry } from '../shared/operators';

export abstract class IntegrationService {
  protected request: IntegrationRequest;
  protected abstract requestService: RequestService;
  protected abstract linkPath: string;
  protected abstract entriesEndpoint: string;
  protected abstract entryValueEndpoint: string;
  protected abstract halService: HALEndpointService;

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
            return observableThrowError(new Error(`Couldn't retrieve the integration data`));
          }
        }),
       distinctUntilChanged()
      );
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
    return this.halService.getEndpoint(this.linkPath).pipe(
      map((endpoint: string) => this.getEntriesHref(endpoint, options)),
      filter((href: string) => isNotEmpty(href)),
      distinctUntilChanged(),
      map((endpointURL: string) => new IntegrationRequest(this.requestService.generateRequestId(), endpointURL)),
      tap((request: GetRequest) => this.requestService.configure(request)),
      mergeMap((request: GetRequest) => this.getData(request)),
      distinctUntilChanged());
  }

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
