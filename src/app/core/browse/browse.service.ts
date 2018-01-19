import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { GLOBAL_CONFIG } from '../../../config';
import { GlobalConfig } from '../../../config/global-config.interface';
import { isEmpty, isNotEmpty } from '../../shared/empty.util';
import { BrowseSuccessResponse, ErrorResponse, RestResponse } from '../cache/response-cache.models';
import { ResponseCacheEntry } from '../cache/response-cache.reducer';
import { ResponseCacheService } from '../cache/response-cache.service';
import { BrowseEndpointRequest, RestRequest } from '../data/request.models';
import { RequestService } from '../data/request.service';
import { BrowseDefinition } from '../shared/browse-definition.model';
import { HALEndpointService } from '../shared/hal-endpoint.service';

@Injectable()
export class BrowseService extends HALEndpointService {
  protected linkName = 'browses';

  private static toSearchKeyArray(metadatumKey: string): string[] {
    const keyParts = metadatumKey.split('.');
    const searchFor = [];
    searchFor.push('*');
    for (let i = 0; i < keyParts.length - 1; i++) {
      const prevParts = keyParts.slice(0, i + 1);
      const nextPart = [...prevParts, '*'].join('.');
      searchFor.push(nextPart);
    }
    searchFor.push(metadatumKey);
    return searchFor;
  }

  constructor(
    protected responseCache: ResponseCacheService,
    protected requestService: RequestService,
    @Inject(GLOBAL_CONFIG) protected EnvConfig: GlobalConfig) {
    super();
  }

  getBrowseURLFor(metadatumKey: string, linkName: string): Observable<string> {
    const searchKeyArray = BrowseService.toSearchKeyArray(metadatumKey);
    return this.getEndpoint()
      .filter((href: string) => isNotEmpty(href))
      .distinctUntilChanged()
      .map((endpointURL: string) => new BrowseEndpointRequest(this.requestService.generateRequestId(), endpointURL))
      .do((request: RestRequest) => this.requestService.configure(request))
      .flatMap((request: RestRequest) => {
        const [successResponse, errorResponse] = this.responseCache.get(request.href)
          .map((entry: ResponseCacheEntry) => entry.response)
          .partition((response: RestResponse) => response.isSuccessful);

        return Observable.merge(
          errorResponse.flatMap((response: ErrorResponse) =>
            Observable.throw(new Error(`Couldn't retrieve the browses endpoint`))),
          successResponse
            .filter((response: BrowseSuccessResponse) => isNotEmpty(response.browseDefinitions))
            .map((response: BrowseSuccessResponse) => response.browseDefinitions)
            .map((browseDefinitions: BrowseDefinition[]) => browseDefinitions
              .find((def: BrowseDefinition) => {
                const matchingKeys = def.metadataKeys.find((key: string) => searchKeyArray.indexOf(key) >= 0);
                return isNotEmpty(matchingKeys);
              })
            ).map((def: BrowseDefinition) => {
            if (isEmpty(def) || isEmpty(def._links) || isEmpty(def._links[linkName])) {
              throw new Error(`A browse endpoint for ${linkName} on ${metadatumKey} isn't configured`);
            } else {
              return def._links[linkName];
            }
          })
        );
      }).startWith(undefined)
      .distinctUntilChanged();
  }

}
