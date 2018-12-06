import { Inject, Injectable } from '@angular/core';

import { AuthObjectFactory } from './auth-object-factory';
import { AuthType } from './auth-type';
import { AuthStatus } from './models/auth-status.model';
import { NormalizedAuthStatus } from './models/normalized-auth-status.model';
import { GLOBAL_CONFIG } from '../../../config';
import { GlobalConfig } from '../../../config/global-config.interface';
import { isNotEmpty } from '../../shared/empty.util';
import { ObjectCacheService } from '../cache/object-cache.service';
import { AuthStatusResponse, RestResponse } from '../cache/response-cache.models';
import { BaseResponseParsingService } from '../data/base-response-parsing.service';
import { ResponseParsingService } from '../data/parsing.service';
import { RestRequest } from '../data/request.models';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';

@Injectable()
export class AuthResponseParsingService extends BaseResponseParsingService implements ResponseParsingService {

  protected objectFactory = AuthObjectFactory;
  protected toCache = true;

  constructor(@Inject(GLOBAL_CONFIG) protected EnvConfig: GlobalConfig,
              protected objectCache: ObjectCacheService) {
    super();
  }

  parse(request: RestRequest, data: DSpaceRESTV2Response): RestResponse {
    if (isNotEmpty(data.payload) && isNotEmpty(data.payload._links) && (data.statusCode === '200' || data.statusCode === 'OK')) {
      const response = this.process<NormalizedAuthStatus, AuthType>(data.payload, request.href);
      return new AuthStatusResponse(response, data.statusCode);
    } else {
      return new AuthStatusResponse(data.payload as AuthStatus, data.statusCode);
    }
  }

}
