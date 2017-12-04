import { Inject, Injectable } from '@angular/core';

import { ResponseCacheService } from '../cache/response-cache.service';
import { RequestService } from '../data/request.service';
import { GLOBAL_CONFIG } from '../../../config';
import { GlobalConfig } from '../../../config/global-config.interface';
import { IntegrationService } from './integration.service';

@Injectable()
export class AuthorityService extends IntegrationService {
  protected linkName = 'authorities';
  protected browseEndpoint = 'entries';

  constructor(
    protected responseCache: ResponseCacheService,
    protected requestService: RequestService,
    @Inject(GLOBAL_CONFIG) protected EnvConfig: GlobalConfig) {
    super();
  }
}
