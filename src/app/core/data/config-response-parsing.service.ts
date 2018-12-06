import { Inject, Injectable } from '@angular/core';

import { BaseResponseParsingService } from './base-response-parsing.service';
import { ResponseParsingService } from './parsing.service';
import { RestRequest } from './request.models';
import { GLOBAL_CONFIG } from '../../../config';
import { GlobalConfig } from '../../../config/global-config.interface';
import { isNotEmpty } from '../../shared/empty.util';
import { ObjectCacheService } from '../cache/object-cache.service';
import { ConfigSuccessResponse, ErrorResponse, RestResponse } from '../cache/response-cache.models';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';
import { ConfigObjectFactory } from '../shared/config/config-object-factory';
import { ConfigType } from '../shared/config/config-type';
import { ConfigObject } from '../shared/config/config.model';

@Injectable()
export class ConfigResponseParsingService extends BaseResponseParsingService implements ResponseParsingService {

  protected objectFactory = ConfigObjectFactory;
  protected toCache = false;

  constructor(
    @Inject(GLOBAL_CONFIG) protected EnvConfig: GlobalConfig,
    protected objectCache: ObjectCacheService,
  ) { super();
  }

  parse(request: RestRequest, data: DSpaceRESTV2Response): RestResponse {
    if (isNotEmpty(data.payload) && isNotEmpty(data.payload._links) && (data.statusCode === '201' || data.statusCode === '200' || data.statusCode === 'OK')) {
      const configDefinition = this.process<ConfigObject,ConfigType>(data.payload, request.href);
      return new ConfigSuccessResponse(configDefinition, data.statusCode, this.processPageInfo(data.payload));
    } else {
      return new ErrorResponse(
        Object.assign(
          new Error('Unexpected response from config endpoint'),
          {statusText: data.statusCode}
        )
      );
    }
  }

}
