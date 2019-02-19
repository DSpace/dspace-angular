import { Injectable } from '@angular/core';

import { RequestService } from '../data/request.service';
import { IntegrationService } from './integration.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';

@Injectable()
export class AuthorityService extends IntegrationService {
  protected linkPath = 'authorities';
  protected entriesEndpoint = 'entries';
  protected entryValueEndpoint = 'entryValues';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected halService: HALEndpointService) {
    super();
  }

}
