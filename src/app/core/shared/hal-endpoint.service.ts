import { Observable } from 'rxjs/Observable';
import { RequestService } from '../data/request.service';
import { ResponseCacheService } from '../cache/response-cache.service';
import { GlobalConfig } from '../../../config/global-config.interface';
import { EndpointMap, RootSuccessResponse } from '../cache/response-cache.models';
import { RootEndpointRequest } from '../data/request.models';
import { ResponseCacheEntry } from '../cache/response-cache.reducer';
import { isNotEmpty } from '../../shared/empty.util';

export abstract class HALEndpointService {
  protected abstract responseCache: ResponseCacheService;
  protected abstract requestService: RequestService;
  protected abstract linkName: string;
  protected abstract EnvConfig: GlobalConfig;

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

  public getEndpoint(): Observable<string> {
    return this.getEndpointMap()
      .do((map: EndpointMap) => {
      if (!this.linkName) {
        console.log('map', this)
      }
    })
      .map((map: EndpointMap) => map[this.linkName])
      .distinctUntilChanged();
  }

  public isEnabledOnRestApi(): Observable<boolean> {
    return this.getEndpointMap()
      .map((map: EndpointMap) => isNotEmpty(map[this.linkName]))
      .startWith(undefined)
      .distinctUntilChanged();
  }

}
