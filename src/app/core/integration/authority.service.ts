import { Injectable } from '@angular/core';

import { RequestService } from '../data/request.service';
import { IntegrationService } from './integration.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';

@Injectable()
export class AuthorityService extends IntegrationService {
  protected linkPath = 'authorities';
  protected browseEndpoint = 'entries';

  constructor(
    protected requestService: RequestService,
    protected halService: HALEndpointService) {
    super();
  }
}
