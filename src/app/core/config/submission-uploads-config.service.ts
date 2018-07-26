import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { ResponseCacheService } from '../cache/response-cache.service';
import { RequestService } from '../data/request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';

@Injectable()
export class SubmissionUploadsConfigService extends ConfigService {
  protected linkPath = 'submissionuploads';
  protected browseEndpoint = '';

  constructor(
    protected responseCache: ResponseCacheService,
    protected requestService: RequestService,
    protected halService: HALEndpointService) {
    super();
  }
}
