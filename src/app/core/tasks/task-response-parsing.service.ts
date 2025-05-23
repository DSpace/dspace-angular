import { Injectable } from '@angular/core';

import { ObjectCacheService } from '../cache/object-cache.service';
import { ParsedResponse } from '../cache/response.models';
import { BaseResponseParsingService } from '../data/base-response-parsing.service';
import { ResponseParsingService } from '../data/parsing.service';
import { RestRequest } from '../data/rest-request.model';
import { RawRestResponse } from '../dspace-rest/raw-rest-response.model';

/**
 * Provides methods to parse response for a task request.
 */
@Injectable({ providedIn: 'root' })
export class TaskResponseParsingService extends BaseResponseParsingService implements ResponseParsingService {

  protected toCache = false;

  /**
   * Initialize instance variables
   *
   * @param {ObjectCacheService} objectCache
   */
  constructor(protected objectCache: ObjectCacheService) {
    super();
  }

  /**
   * Parses data from the tasks endpoints
   *
   * @param {RestRequest} request
   * @param {RawRestResponse} data
   * @returns {RestResponse}
   */
  parse(request: RestRequest, data: RawRestResponse): ParsedResponse {
    if (this.isSuccessStatus(data.statusCode)) {
      return new ParsedResponse(data.statusCode);
    } else {
      throw new Error('Unexpected response from server');
    }
  }

}
