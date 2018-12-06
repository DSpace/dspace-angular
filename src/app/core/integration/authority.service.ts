import { Injectable } from '@angular/core';

import { IntegrationService } from './integration.service';
import { ResponseCacheService } from '../cache/response-cache.service';
import { RequestService } from '../data/request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';

@Injectable()
export class AuthorityService extends IntegrationService {
  protected linkPath = 'authorities';
  protected browseEndpoint = 'entries';

  constructor(
    protected responseCache: ResponseCacheService,
    protected requestService: RequestService,
    protected halService: HALEndpointService) {
    super();
  }
}
