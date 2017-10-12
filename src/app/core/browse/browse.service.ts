import { Inject, Injectable } from '@angular/core';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { ResponseCacheService } from '../cache/response-cache.service';
import { RequestService } from '../data/request.service';
import { GlobalConfig } from '../../../config/global-config.interface';
import { GLOBAL_CONFIG } from '../../../config';
import { BrowseEndpointRequest, RestRequest } from '../data/request.models';
import { ResponseCacheEntry } from '../cache/response-cache.reducer';
import { BrowseSuccessResponse } from '../cache/response-cache.models';
import { isNotEmpty } from '../../shared/empty.util';
import { BrowseDefinition } from '../shared/browse-definition.model';
import { Observable } from 'rxjs/Observable';

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
      .map((endpointURL: string) => new BrowseEndpointRequest(endpointURL))
      .do((request: RestRequest) => {
        setTimeout(() => {
          this.requestService.configure(request);
        }, 0);
      })
      .flatMap((request: RestRequest) => this.responseCache.get(request.href)
        .map((entry: ResponseCacheEntry) => entry.response)
        .filter((response: BrowseSuccessResponse) => isNotEmpty(response) && isNotEmpty(response.browseDefinitions))
        .map((response: BrowseSuccessResponse) => response.browseDefinitions)
        .map((browseDefinitions: BrowseDefinition[]) => browseDefinitions
          .find((def: BrowseDefinition) => {
            const matchingKeys = def.metadataKeys.find((key: string) => searchKeyArray.indexOf(key) >= 0);
            return matchingKeys.length > 0
          })
        ).map((def: BrowseDefinition) => def._links[linkName])
      );
  }

}
