import { Observable } from 'rxjs/Observable';
import { RequestService } from '../data/request.service';
import { ResponseCacheService } from '../cache/response-cache.service';
import { EpersonRequest, FindAllOptions } from '../data/request.models';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { NormalizedObject } from '../cache/models/normalized-object.model';
import { DataService } from '../data/data.service';

export abstract class EpersonService<TNormalized extends NormalizedObject, TDomain> extends DataService<TNormalized, TDomain> {
  protected request: EpersonRequest;
  protected abstract responseCache: ResponseCacheService;
  protected abstract requestService: RequestService;
  protected abstract linkPath: string;
  protected abstract browseEndpoint: string;
  protected abstract halService: HALEndpointService;

  public getBrowseEndpoint(options: FindAllOptions): Observable<string> {
    return this.halService.getEndpoint(this.linkPath);
  }
}
