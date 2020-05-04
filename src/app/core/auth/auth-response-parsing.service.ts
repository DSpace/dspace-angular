import { Inject, Injectable } from '@angular/core';

import { BaseResponseParsingService } from '../data/base-response-parsing.service';
import { AuthStatusResponse, RestResponse } from '../cache/response.models';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';
import { GLOBAL_CONFIG } from '../../../config';
import { GlobalConfig } from '../../../config/global-config.interface';
import { isNotEmpty } from '../../shared/empty.util';
import { ObjectCacheService } from '../cache/object-cache.service';
import { ResponseParsingService } from '../data/parsing.service';
import { RestRequest } from '../data/request.models';
import { AuthStatus } from './models/auth-status.model';

@Injectable()
export class AuthResponseParsingService extends BaseResponseParsingService implements ResponseParsingService {

  protected toCache = true;

  constructor(@Inject(GLOBAL_CONFIG) protected EnvConfig: GlobalConfig,
              protected objectCache: ObjectCacheService) {
    super();
  }

  parse(request: RestRequest, data: DSpaceRESTV2Response): RestResponse {
    if (isNotEmpty(data.payload) && isNotEmpty(data.payload._links) && (data.statusCode === 200)) {
      const response = this.process<AuthStatus>(data.payload, request);
      return new AuthStatusResponse(response, data.statusCode, data.statusText);
    } else {
      return new AuthStatusResponse(data.payload as AuthStatus, data.statusCode, data.statusText);
    }
  }
}
