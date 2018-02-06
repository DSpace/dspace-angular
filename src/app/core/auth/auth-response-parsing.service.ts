import { Inject, Injectable } from '@angular/core';

import { AuthObjectFactory } from './auth-object-factory';
import { BaseResponseParsingService } from '../data/base-response-parsing.service';
import {
  AuthSuccessResponse, ConfigSuccessResponse, ErrorResponse,
  RestResponse
} from '../cache/response-cache.models';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';
import { ConfigObject } from '../shared/config/config.model';
import { ConfigType } from '../shared/config/config-type';
import { GLOBAL_CONFIG } from '../../../config';
import { GlobalConfig } from '../../../config/global-config.interface';
import { isNotEmpty } from '../../shared/empty.util';
import { ObjectCacheService } from '../cache/object-cache.service';
import { ResponseParsingService } from '../data/parsing.service';
import { RestRequest } from '../data/request.models';

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
    /*if (isNotEmpty(data.payload) && isNotEmpty(data.payload._links) && data.statusCode === '200') {
      const configDefinition = this.process<ConfigObject,ConfigType>(data.payload, request.href);
      return new ConfigSuccessResponse(configDefinition[Object.keys(configDefinition)[0]], data.statusCode, this.processPageInfo(data.payload.page));
    } else {
      return new ErrorResponse(
        Object.assign(
          new Error('Unexpected response from config endpoint'),
          {statusText: data.statusCode}
        )
      );
    }*/
    console.log(data);
    return new AuthSuccessResponse(data.payload, data.statusCode)
  }

}
