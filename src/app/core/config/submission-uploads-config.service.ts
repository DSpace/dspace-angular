import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { RequestService } from '../data/request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { ObjectCacheService } from '../cache/object-cache.service';

/**
 * Provides methods to retrieve, from REST server, bitstream access conditions configurations applicable during the submission process.
 */
@Injectable()
export class SubmissionUploadsConfigService extends ConfigService {
  protected linkPath = 'submissionuploads';
  protected browseEndpoint = '';

  constructor(
    protected objectCache: ObjectCacheService,
    protected requestService: RequestService,
    protected halService: HALEndpointService) {
    super();
  }
}
