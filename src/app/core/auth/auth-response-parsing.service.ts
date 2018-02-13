import { Inject, Injectable } from '@angular/core';

import { AuthObjectFactory } from './auth-object-factory';
import { BaseResponseParsingService } from '../data/base-response-parsing.service';
import {
  AuthErrorResponse,
  AuthStatusResponse,
  AuthSuccessResponse, ConfigSuccessResponse, ErrorResponse,
  RestResponse
} from '../cache/response-cache.models';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';
import { ConfigObject } from '../shared/config/config.model';
import { ConfigType } from '../shared/config/config-type';
import { GLOBAL_CONFIG } from '../../../config';
import { GlobalConfig } from '../../../config/global-config.interface';
import { isEmpty, isNotEmpty } from '../../shared/empty.util';
import { ObjectCacheService } from '../cache/object-cache.service';
import { ResponseParsingService } from '../data/parsing.service';
import { RestRequest } from '../data/request.models';
import { AuthType } from './auth-type';
import { NormalizedObject } from '../cache/models/normalized-object.model';
import { AuthTokenInfo } from './models/auth-token-info.model';
import { NormalizedAuthStatus } from './models/normalized-auth-status.model';
import { AuthStatus } from './models/auth-status.model';

@Injectable()
export class AuthResponseParsingService extends BaseResponseParsingService implements ResponseParsingService {

  protected objectFactory = AuthObjectFactory;
  protected toCache = false;

  constructor(
    @Inject(GLOBAL_CONFIG) protected EnvConfig: GlobalConfig,
    protected objectCache: ObjectCacheService,
  ) { super();
  }

  parse(request: RestRequest, data: DSpaceRESTV2Response): RestResponse {
    if (isNotEmpty(data.payload) && isNotEmpty(data.payload._links) && (data.statusCode === '200' || data.statusCode === 'OK')) {
      const response = this.process<AuthStatus,AuthType>(data.payload, request.href);
      return new AuthStatusResponse(response[Object.keys(response)[0]][0], data.statusCode);
    } else if (isEmpty(data.payload) && isNotEmpty(data.headers.get('authorization')) && (data.statusCode === '200' || data.statusCode === 'OK')) {
      return new AuthSuccessResponse(new AuthTokenInfo(data.headers.get('authorization')), data.statusCode);
    } else {
      return new AuthStatusResponse(data.payload as AuthStatus, data.statusCode);
    }
  }

}
