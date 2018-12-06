import { Inject, Injectable } from '@angular/core';

import { Observable, of as observableOf } from 'rxjs';
import { distinctUntilChanged, filter, flatMap, map, startWith, tap } from 'rxjs/operators';

import { GLOBAL_CONFIG } from '../../../config';
import { GlobalConfig } from '../../../config/global-config.interface';
import { hasValue, isEmpty, isNotEmpty } from '../../shared/empty.util';
import { EndpointMap, EndpointMapSuccessResponse } from '../cache/response-cache.models';
import { ResponseCacheEntry } from '../cache/response-cache.reducer';
import { ResponseCacheService } from '../cache/response-cache.service';
import { EndpointMapRequest } from '../data/request.models';
import { RequestService } from '../data/request.service';
import { RESTURLCombiner } from '../url-combiner/rest-url-combiner';

@Injectable()
export class HALEndpointService {

  constructor(private responseCache: ResponseCacheService,
              private requestService: RequestService,
              @Inject(GLOBAL_CONFIG) private EnvConfig: GlobalConfig) {
  }

  protected getRootHref(): string {
    return new RESTURLCombiner(this.EnvConfig, '/').toString();
  }

  protected getRootEndpointMap(): Observable<EndpointMap> {
    return this.getEndpointMapAt(this.getRootHref());
  }

  private getEndpointMapAt(href): Observable<EndpointMap> {
    const request = new EndpointMapRequest(this.requestService.generateRequestId(), href);
    this.requestService.configure(request);
    return this.responseCache.get(request.href).pipe(
      map((entry: ResponseCacheEntry) => entry.response),
      filter((response: EndpointMapSuccessResponse) => isNotEmpty(response)),
      map((response: EndpointMapSuccessResponse) => response.endpointMap),
      distinctUntilChanged(),);
  }

  public getEndpoint(linkPath: string): Observable<string> {
    return this.getEndpointAt(...linkPath.split('/'));
  }

  private getEndpointAt(...path: string[]): Observable<string> {
    if (isEmpty(path)) {
      path = ['/'];
    }
    let currentPath;
    const pipeArguments = path
      .map((subPath: string, index: number) => [
        flatMap((href: string) => this.getEndpointMapAt(href)),
        map((endpointMap: EndpointMap) => {
          if (hasValue(endpointMap) && hasValue(endpointMap[subPath])) {
            currentPath = endpointMap[subPath];
            return endpointMap[subPath];
          } else {
            /*TODO remove if/else block once the rest response contains _links for facets*/
            currentPath += '/' + subPath;
            return currentPath;
          }
        }),
      ])
      .reduce((combined, thisElement) => [...combined, ...thisElement], []);
    return observableOf(this.getRootHref()).pipe(...pipeArguments, distinctUntilChanged());
  }

  public isEnabledOnRestApi(linkPath: string): Observable<boolean> {
    return this.getRootEndpointMap().pipe(
      // TODO this only works when there's no / in linkPath
      map((endpointMap: EndpointMap) => isNotEmpty(endpointMap[linkPath])),
      startWith(undefined),
      distinctUntilChanged()
    )
  }

}
