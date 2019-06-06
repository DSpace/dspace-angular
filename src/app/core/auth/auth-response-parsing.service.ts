import { Inject, Injectable } from '@angular/core';

import { AuthObjectFactory } from './auth-object-factory';
import { BaseResponseParsingService } from '../data/base-response-parsing.service';
import { AuthStatusResponse, RestResponse } from '../cache/response.models';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';
import { GLOBAL_CONFIG } from '../../../config';
import { GlobalConfig } from '../../../config/global-config.interface';
import { isNotEmpty } from '../../shared/empty.util';
import { ObjectCacheService } from '../cache/object-cache.service';
import { ResponseParsingService } from '../data/parsing.service';
import { RestRequest } from '../data/request.models';
import { AuthType } from './auth-type';
import { AuthStatus } from './models/auth-status.model';
import { NormalizedAuthStatus } from './models/normalized-auth-status.model';
import { NormalizedObject } from '../cache/models/normalized-object.model';

@Injectable()
export class AuthResponseParsingService extends BaseResponseParsingService implements ResponseParsingService {

  protected objectFactory = AuthObjectFactory;
  protected toCache = true;

  constructor(@Inject(GLOBAL_CONFIG) protected EnvConfig: GlobalConfig,
              protected objectCache: ObjectCacheService) {
    super();
  }

  parse(request: RestRequest, data: DSpaceRESTV2Response): RestResponse {
    if (isNotEmpty(data.payload) && isNotEmpty(data.payload._links) && (data.statusCode === 200)) {
      const response = this.process<NormalizedObject<AuthStatus>, AuthType>(data.payload, request.uuid);
      return new AuthStatusResponse(response, data.statusCode, data.statusText);
    } else {
      return new AuthStatusResponse(data.payload as NormalizedAuthStatus, data.statusCode, data.statusText);
    }
  }
}
