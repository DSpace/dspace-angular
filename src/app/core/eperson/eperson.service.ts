import { Observable } from 'rxjs/Observable';
import { RequestService } from '../data/request.service';
import { ResponseCacheService } from '../cache/response-cache.service';
import { GlobalConfig } from '../../../config/global-config.interface';
import {
  EpersonSuccessResponse, ErrorResponse,
  RestResponse
} from '../cache/response-cache.models';
import { EpersonRequest, RestRequest} from '../data/request.models';
import { ResponseCacheEntry } from '../cache/response-cache.reducer';
import { isNotEmpty } from '../../shared/empty.util';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { EpersonData } from './eperson-data';

export abstract class EpersonService extends HALEndpointService {
  protected request: EpersonRequest;
  protected abstract responseCache: ResponseCacheService;
  protected abstract requestService: RequestService;
  protected abstract linkName: string;
  protected abstract EnvConfig: GlobalConfig;
  protected abstract browseEndpoint: string;

  protected getEperson(request: RestRequest): Observable<EpersonData> {
    const [successResponse, errorResponse] =  this.responseCache.get(request.href)
      .map((entry: ResponseCacheEntry) => entry.response)
      .partition((response: RestResponse) => response.isSuccessful);
    return Observable.merge(
      errorResponse.flatMap((response: ErrorResponse) =>
        Observable.throw(new Error(`Couldn't retrieve the EPerson`))),
      successResponse
      .filter((response: EpersonSuccessResponse) => isNotEmpty(response))
      .map((response: EpersonSuccessResponse) => new EpersonData(response.pageInfo, response.epersonDefinition))
      .distinctUntilChanged());
  }

  public getDataByHref(href: string): Observable<EpersonData> {
    const request = new EpersonRequest(href);
    this.requestService.configure(request);

    return this.getEperson(request);
  }

  public getDataByUuid(uuid: string): Observable<EpersonData> {
    return this.getEndpoint()
      .map((endpoint: string) => this.getDataByIDHref(endpoint, uuid))
      .filter((href: string) => isNotEmpty(href))
      .distinctUntilChanged()
      .map((endpointURL: string) => new EpersonRequest(endpointURL))
      .do((request: RestRequest) => this.requestService.configure(request))
      .flatMap((request: RestRequest) => this.getEperson(request))
      .distinctUntilChanged();
  }

  protected getDataByIDHref(endpoint, resourceID): string {
    return `${endpoint}/${resourceID}`;
  }
}
