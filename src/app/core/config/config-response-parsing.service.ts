import { Inject, Injectable } from '@angular/core';

import { ResponseParsingService } from '../data/parsing.service';
import { RestRequest } from '../data/request.models';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';
import { ConfigSuccessResponse, ErrorResponse, RestResponse } from '../cache/response.models';
import { isNotEmpty } from '../../shared/empty.util';

import { ConfigObject } from './models/config.model';
import { BaseResponseParsingService } from '../data/base-response-parsing.service';
import { GLOBAL_CONFIG } from '../../../config';
import { GlobalConfig } from '../../../config/global-config.interface';
import { ObjectCacheService } from '../cache/object-cache.service';

@Injectable()
export class ConfigResponseParsingService extends BaseResponseParsingService implements ResponseParsingService {
  protected toCache = false;
  protected shouldDirectlyAttachEmbeds = true;

  constructor(
    @Inject(GLOBAL_CONFIG) protected EnvConfig: GlobalConfig,
    protected objectCache: ObjectCacheService,
  ) { super();
  }

  parse(request: RestRequest, data: DSpaceRESTV2Response): RestResponse {
    if (isNotEmpty(data.payload) && isNotEmpty(data.payload._links) && (data.statusCode === 201 || data.statusCode === 200)) {
      const configDefinition = this.process<ConfigObject>(data.payload, request);
      return new ConfigSuccessResponse(configDefinition, data.statusCode, data.statusText, this.processPageInfo(data.payload));
    } else {
      return new ErrorResponse(
        Object.assign(
          new Error('Unexpected response from config endpoint'),
          { statusCode: data.statusCode, statusText: data.statusText }
        )
      );
    }
  }

}
