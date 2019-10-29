import { Observable, of as observableOf, combineLatest as observableCombineLatest } from 'rxjs';
import {
  distinctUntilChanged, first,
  map,
  mergeMap,
  startWith,
  switchMap, take,
  tap
} from 'rxjs/operators';
import { RequestEntry } from '../data/request.reducer';
import { RequestService } from '../data/request.service';
import { GlobalConfig } from '../../../config/global-config.interface';
import { EndpointMapRequest } from '../data/request.models';
import { hasNoValue, hasValue, isEmpty, isNotEmpty } from '../../shared/empty.util';
import { RESTURLCombiner } from '../url-combiner/rest-url-combiner';
import { Inject, Injectable } from '@angular/core';
import { GLOBAL_CONFIG } from '../../../config';
import { EndpointMap, EndpointMapSuccessResponse } from '../cache/response.models';
import { getResponseFromEntry } from './operators';
import { URLCombiner } from '../url-combiner/url-combiner';

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

    if (!this.requestService.isCachedOrPending(request)) {
      // don't bother configuring the request if it's already cached or pending.
      this.requestService.configure(request);
    }

    return this.requestService.getByHref(request.href).pipe(
      getResponseFromEntry(),
      map((response: EndpointMapSuccessResponse) => response.endpointMap),
      );
  }

  public getEndpoint(linkPath: string, startHref?: string): Observable<string> {
    return this.getEndpointAt(startHref || this.getRootHref(), ...linkPath.split('/')).pipe(take(1));
  }

  /**
   * Resolve the actual hal url based on a list of hal names
   * @param {string} href The root url to start from
   * @param {string} halNames List of hal names for which a url should be resolved
   * @returns {Observable<string>} Observable that emits the found hal url
   */
  private getEndpointAt(href: string, ...halNames: string[]): Observable<string> {
    if (isEmpty(halNames)) {
      throw new Error('cant\'t fetch the URL without the HAL link names')
    }

    const nextHref$ = this.getEndpointMapAt(href).pipe(
      map((endpointMap: EndpointMap): string => {
        /*TODO remove if/else block once the rest response contains _links for facets*/
        const nextName = halNames[0];
        if (hasValue(endpointMap) && hasValue(endpointMap[nextName])) {
          return endpointMap[nextName];
        } else {
          return new URLCombiner(href, nextName).toString();
        }
      })
    ) as Observable<string>;

    if (halNames.length === 1) {
      return nextHref$.pipe(take(1));
    } else {
      return nextHref$.pipe(
        switchMap((nextHref) => this.getEndpointAt(nextHref, ...halNames.slice(1))),
        take(1)
      );
    }
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
