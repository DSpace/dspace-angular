import { Inject, Injectable } from '@angular/core';

import { ResponseParsingService } from '../data/parsing.service';
import { RestRequest } from '../data/request.models';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';
import {
  ErrorResponse, MessageResponse, RestResponse,
  SubmissionSuccessResponse
} from '../cache/response-cache.models';
import { BaseResponseParsingService } from '../data/base-response-parsing.service';
import { GLOBAL_CONFIG } from '../../../config';
import { GlobalConfig } from '../../../config/global-config.interface';
import { ObjectCacheService } from '../cache/object-cache.service';
import { NormalizedSubmissionObjectFactory } from '../submission/normalized-submission-object-factory';

@Injectable()
export class MessageResponseParsingService extends BaseResponseParsingService implements ResponseParsingService {

  protected objectFactory = NormalizedSubmissionObjectFactory;
  protected toCache = false;

  constructor(@Inject(GLOBAL_CONFIG) protected EnvConfig: GlobalConfig,
              protected objectCache: ObjectCacheService,) {
    super();
  }

  parse(request: RestRequest, data: DSpaceRESTV2Response): RestResponse {
    if (this.isSuccessStatus(data.statusCode)) {
      return new MessageResponse( data.statusCode);
    } else {
      console.log(data);
      return new ErrorResponse(
        Object.assign(
          new Error('Unexpected response from server'),
          {statusText: data.statusCode}
        )
      );
    }
  }

}
