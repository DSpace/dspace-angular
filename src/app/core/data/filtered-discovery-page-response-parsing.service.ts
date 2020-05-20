import { Inject, Injectable } from '@angular/core';
import { ResponseParsingService } from './parsing.service';
import { RestRequest } from './request.models';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';
import { BaseResponseParsingService } from './base-response-parsing.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { FilteredDiscoveryQueryResponse, RestResponse } from '../cache/response.models';

/**
 * A ResponseParsingService used to parse DSpaceRESTV2Response coming from the REST API to a discovery query (string)
 * wrapped in a FilteredDiscoveryQueryResponse
 */
@Injectable()
export class FilteredDiscoveryPageResponseParsingService extends BaseResponseParsingService implements ResponseParsingService {
  objectFactory = {};
  toCache = false;
  constructor(
    protected objectCache: ObjectCacheService,
  ) { super();
  }

  /**
   * Parses data from the REST API to a discovery query wrapped in a FilteredDiscoveryQueryResponse
   * @param {RestRequest} request
   * @param {DSpaceRESTV2Response} data
   * @returns {RestResponse}
   */
  parse(request: RestRequest, data: DSpaceRESTV2Response): RestResponse {
    const query = data.payload['discovery-query'];
    return new FilteredDiscoveryQueryResponse(query, data.statusCode, data.statusText);
  }
}
