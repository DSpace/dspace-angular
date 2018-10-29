import { Injectable } from '@angular/core';

import { ConfigService } from './config.service';
import { RequestService } from '../data/request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';

@Injectable()
export class SubmissionSectionsConfigService extends ConfigService {
  protected linkPath = 'submissionsections';
  protected browseEndpoint = '';

  constructor(
    protected requestService: RequestService,
    protected halService: HALEndpointService) {
    super();
  }

}
