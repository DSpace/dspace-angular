import { Inject, Injectable } from '@angular/core';

import { ConfigService } from './config.service';
import { ResponseCacheService } from '../cache/response-cache.service';
import { RequestService } from '../data/request.service';
import { GLOBAL_CONFIG } from '../../../config';
import { GlobalConfig } from '../../../config/global-config.interface';

@Injectable()
export class SubmissionSectionsConfigService extends ConfigService {
  protected linkPath = 'submissionsections';
  protected browseEndpoint = '';

  constructor(
    protected responseCache: ResponseCacheService,
    protected requestService: RequestService,
    @Inject(GLOBAL_CONFIG) protected EnvConfig: GlobalConfig) {
    super();
  }

}
