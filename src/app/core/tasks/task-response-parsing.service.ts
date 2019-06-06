import { Inject, Injectable } from '@angular/core';

import { ResponseParsingService } from '../data/parsing.service';
import { RestRequest } from '../data/request.models';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';

import { BaseResponseParsingService } from '../data/base-response-parsing.service';
import { GLOBAL_CONFIG } from '../../../config';
import { GlobalConfig } from '../../../config/global-config.interface';
import { ObjectCacheService } from '../cache/object-cache.service';
import { NormalizedObjectFactory } from '../cache/models/normalized-object-factory';
import { ErrorResponse, RestResponse, TaskResponse } from '../cache/response.models';

/**
 * Provides methods to parse response for a task request.
 */
@Injectable()
export class TaskResponseParsingService extends BaseResponseParsingService implements ResponseParsingService {

  protected objectFactory = NormalizedObjectFactory;
  protected toCache = false;

  /**
   * Initialize instance variables
   *
   * @param {GlobalConfig} EnvConfig
   * @param {ObjectCacheService} objectCache
   */
  constructor(@Inject(GLOBAL_CONFIG) protected EnvConfig: GlobalConfig,
              protected objectCache: ObjectCacheService,) {
    super();
  }

  /**
   * Parses data from the tasks endpoints
   *
   * @param {RestRequest} request
   * @param {DSpaceRESTV2Response} data
   * @returns {RestResponse}
   */
  parse(request: RestRequest, data: DSpaceRESTV2Response): RestResponse {
    if (this.isSuccessStatus(data.statusCode)) {
      return new TaskResponse( data.statusCode, data.statusText);
    } else {
      return new ErrorResponse(
        Object.assign(
          new Error('Unexpected response from server'),
          { statusCode: data.statusCode, statusText: data.statusText }
        )
      );
    }
  }

}
