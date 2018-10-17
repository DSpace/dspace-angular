import { Observable, of as observableOf } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  flatMap,
  map,
  startWith,
  switchMap,
  tap
} from 'rxjs/operators';
import { RequestService } from '../data/request.service';
import { GlobalConfig } from '../../../config/global-config.interface';
import { EndpointMapRequest } from '../data/request.models';
import { hasValue, isEmpty, isNotEmpty, isNotUndefined } from '../../shared/empty.util';
import { RESTURLCombiner } from '../url-combiner/rest-url-combiner';
import { Inject, Injectable } from '@angular/core';
import { GLOBAL_CONFIG } from '../../../config';
import { EndpointMap, EndpointMapSuccessResponse } from '../cache/response.models';
import { getResponseFromEntry } from './operators';

@Injectable()
export class HALEndpointService {

  constructor(private requestService: RequestService,
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

    this.requestService.getByUUID(request.uuid).pipe(
      getResponseFromEntry(),
      map((response: EndpointMapSuccessResponse) => response.endpointMap),
      distinctUntilChanged()).subscribe((t) => console.log('uuid', t));
    this.requestService.getByHref(request.href).pipe(
      getResponseFromEntry(),
      map((response: EndpointMapSuccessResponse) => response.endpointMap),
      distinctUntilChanged()).subscribe((t) => console.log('href', t));

    this.requestService.configure(request);
    return this.requestService.getByHref(request.href).pipe( /*<-- changing this to UUID breaks it */
      getResponseFromEntry(),
      map((response: EndpointMapSuccessResponse) => response.endpointMap),
      distinctUntilChanged());

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
        switchMap((href: string) => this.getEndpointMapAt(href)),
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
