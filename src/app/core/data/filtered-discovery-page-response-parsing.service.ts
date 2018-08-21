import { Inject, Injectable } from '@angular/core';
import { FilteredDiscoveryQueryResponse, RestResponse } from '../cache/response-cache.models';
import { ResponseParsingService } from './parsing.service';
import { RestRequest } from './request.models';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';
import { BaseResponseParsingService } from './base-response-parsing.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { GlobalConfig } from '../../../config/global-config.interface';
import { GLOBAL_CONFIG } from '../../../config';

@Injectable()
export class FilteredDiscoveryPageResponseParsingService extends BaseResponseParsingService implements ResponseParsingService {
  objectFactory = {};
  toCache = false;
  constructor(
    @Inject(GLOBAL_CONFIG) protected EnvConfig: GlobalConfig,
    protected objectCache: ObjectCacheService,
  ) { super();
  }
  parse(request: RestRequest, data: DSpaceRESTV2Response): RestResponse {
    const query = data.payload['discovery-query'];
    return new FilteredDiscoveryQueryResponse(query, data.statusCode);
  }
}
