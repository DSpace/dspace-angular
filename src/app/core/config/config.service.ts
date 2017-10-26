import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { RequestService } from '../data/request.service';
import { ResponseCacheService } from '../cache/response-cache.service';
import { GlobalConfig } from '../../../config/global-config.interface';
import { ConfigSuccessResponse, EndpointMap, RootSuccessResponse } from '../cache/response-cache.models';
import { ConfigRequest, FindAllOptions, RestRequest, RootEndpointRequest } from '../data/request.models';
import { ResponseCacheEntry } from '../cache/response-cache.reducer';
import { hasValue, isNotEmpty } from '../../shared/empty.util';
import { ConfigObject } from '../shared/config/config.model';

@Injectable()
export abstract class ConfigService {
  protected request: ConfigRequest;
  protected abstract responseCache: ResponseCacheService;
  protected abstract requestService: RequestService;
  protected abstract linkName: string;
  protected abstract EnvConfig: GlobalConfig;
  protected abstract browseEndpoint: string;

  protected getConfig(request: RestRequest): Observable<ConfigObject[]> {
    return this.responseCache.get(request.href)
      .map((entry: ResponseCacheEntry) => entry.response)
      .filter((response: ConfigSuccessResponse) => isNotEmpty(response) && isNotEmpty(response.configDefinition))
      .map((response: ConfigSuccessResponse) =>  response.configDefinition)
      .distinctUntilChanged();
  }

  protected getConfigByIDHref(endpoint, resourceID): string {
    return `${endpoint}/${resourceID}`;
  }

  protected getConfigSearchHref(endpoint, options: FindAllOptions = {}): string {
    let result;
    const args = [];

    if (hasValue(options.scopeID)) {
      result = `${endpoint}/${this.browseEndpoint}`
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

  protected getEndpointMap(): Observable<EndpointMap> {
    const request = new RootEndpointRequest(this.EnvConfig);
    setTimeout(() => {
      this.requestService.configure(request);
    }, 0);
    return this.responseCache.get(request.href)
      .map((entry: ResponseCacheEntry) => entry.response)
      .filter((response: RootSuccessResponse) => isNotEmpty(response) && isNotEmpty(response.endpointMap))
      .map((response: RootSuccessResponse) => response.endpointMap)
      .distinctUntilChanged();
  }

  public getConfigAll(): Observable<ConfigObject[]> {
    return this.getEndpoint()
      .filter((href: string) => isNotEmpty(href))
      .distinctUntilChanged()
      .map((endpointURL: string) => new ConfigRequest(endpointURL))
      .do((request: RestRequest) => {
        setTimeout(() => {
          this.requestService.configure(request);
        }, 0);
      })
      .flatMap((request: RestRequest) => this.getConfig(request))
      .distinctUntilChanged();
  }

  public getConfigByHref(href: string): Observable<ConfigObject[]> {
    const request = new ConfigRequest(href);
    this.requestService.configure(request);

    return this.getConfig(request);
  }

  public getConfigById(id: string): Observable<ConfigObject[]> {
    return this.getEndpoint()
      .map((endpoint: string) => this.getConfigByIDHref(endpoint, id))
      .filter((href: string) => isNotEmpty(href))
      .distinctUntilChanged()
      .map((endpointURL: string) => new ConfigRequest(endpointURL))
      .do((request: RestRequest) => {
        setTimeout(() => {
          this.requestService.configure(request);
        }, 0);
      })
      .flatMap((request: RestRequest) => this.getConfig(request))
      .distinctUntilChanged();
  }

  public getConfigBySearch(options: FindAllOptions = {}): Observable<ConfigObject[]> {
    return this.getEndpoint()
      .map((endpoint: string) => this.getConfigSearchHref(endpoint, options))
      .filter((href: string) => isNotEmpty(href))
      .distinctUntilChanged()
      .map((endpointURL: string) => new ConfigRequest(endpointURL))
      .do((request: RestRequest) => {
        setTimeout(() => {
          this.requestService.configure(request);
        }, 0);
      })
      .flatMap((request: RestRequest) => this.getConfig(request))
      .distinctUntilChanged();
  }

  public getEndpoint(): Observable<string> {
    return this.getEndpointMap()
      .map((map: EndpointMap) => map[this.linkName])
      .distinctUntilChanged();
  }

}
