import { Inject, Injectable } from '@angular/core';

import { RestRequest } from '../data/request.models';
import { ResponseParsingService } from '../data/parsing.service';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';
import { EpersonSuccessResponse, ErrorResponse, RestResponse } from '../cache/response.models';
import { isNotEmpty } from '../../shared/empty.util';
import { BaseResponseParsingService } from '../data/base-response-parsing.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { DSpaceObject } from '../shared/dspace-object.model';

/**
 * Provides method to parse response from eperson endpoint.
 */
@Injectable()
export class EpersonResponseParsingService extends BaseResponseParsingService implements ResponseParsingService {

  protected toCache = false;

  constructor(
    protected objectCache: ObjectCacheService,
  ) {
    super();
  }

  parse(request: RestRequest, data: DSpaceRESTV2Response): RestResponse {
    if (isNotEmpty(data.payload) && isNotEmpty(data.payload._links)) {
      const epersonDefinition = this.process<DSpaceObject>(data.payload, request);
      return new EpersonSuccessResponse(epersonDefinition[Object.keys(epersonDefinition)[0]], data.statusCode, data.statusText, this.processPageInfo(data.payload));
    } else {
      return new ErrorResponse(
        Object.assign(
          new Error('Unexpected response from EPerson endpoint'),
          {statusCode: data.statusCode, statusText: data.statusText}
        )
      );
    }
  }

}
