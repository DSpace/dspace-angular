import { Observable } from 'rxjs/Observable';
import { distinctUntilChanged, map, flatMap, startWith } from 'rxjs/operators';
import { RequestService } from '../data/request.service';
import { ResponseCacheService } from '../cache/response-cache.service';
import { GlobalConfig } from '../../../config/global-config.interface';
import { EndpointMap, EndpointMapSuccessResponse } from '../cache/response-cache.models';
import { EndpointMapRequest } from '../data/request.models';
import { ResponseCacheEntry } from '../cache/response-cache.reducer';
import { isEmpty, isNotEmpty } from '../../shared/empty.util';
import { RESTURLCombiner } from '../url-combiner/rest-url-combiner';
import { Inject, Injectable } from '@angular/core';
import { GLOBAL_CONFIG } from '../../../config';

@Injectable()
export class HALEndpointService {

  protected linkPath: string;

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
    return this.responseCache.get(request.href)
      .map((entry: ResponseCacheEntry) => entry.response)
      .filter((response: EndpointMapSuccessResponse) => isNotEmpty(response) && isNotEmpty(response.endpointMap))
      .map((response: EndpointMapSuccessResponse) => response.endpointMap)
      .distinctUntilChanged();
  }

  public getEndpoint(linkPath: string): Observable<string> {
    return this.getEndpointAt(...linkPath.split('/'));
  }

  private getEndpointAt(...path: string[]): Observable<string> {
    if (isEmpty(path)) {
      path = ['/'];
    }
    const pipeArguments = path
      .map((subPath: string) => [
        flatMap((href: string) => this.getEndpointMapAt(href)),
        map((endpointMap: EndpointMap) => endpointMap[subPath]),
      ])
      .reduce((combined, thisElement) => [...combined, ...thisElement], []);
    return Observable.of(this.getRootHref()).pipe(...pipeArguments, distinctUntilChanged());
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
