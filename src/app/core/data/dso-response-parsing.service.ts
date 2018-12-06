import { Inject, Injectable } from '@angular/core';

import { BaseResponseParsingService } from './base-response-parsing.service';
import { ResponseParsingService } from './parsing.service';
import { RestRequest } from './request.models';
import { GLOBAL_CONFIG } from '../../../config';
import { GlobalConfig } from '../../../config/global-config.interface';
import { hasNoValue, hasValue } from '../../shared/empty.util';
import { NormalizedObjectFactory } from '../cache/models/normalized-object-factory';
import { NormalizedObject } from '../cache/models/normalized-object.model';
import { ObjectCacheService } from '../cache/object-cache.service';
import { DSOSuccessResponse, RestResponse } from '../cache/response-cache.models';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';
import { ResourceType } from '../shared/resource-type';

@Injectable()
export class DSOResponseParsingService extends BaseResponseParsingService implements ResponseParsingService {

  protected objectFactory = NormalizedObjectFactory;
  protected toCache = true;

  constructor(
    @Inject(GLOBAL_CONFIG) protected EnvConfig: GlobalConfig,
    protected objectCache: ObjectCacheService,
  ) { super();
  }

  parse(request: RestRequest, data: DSpaceRESTV2Response): RestResponse {
    const processRequestDTO = this.process<NormalizedObject,ResourceType>(data.payload, request.href);
    let objectList = processRequestDTO;
    if (hasNoValue(processRequestDTO)) {
      return new DSOSuccessResponse([], data.statusCode, undefined)
    }
    if (hasValue(processRequestDTO.page)) {
      objectList = processRequestDTO.page;
    } else if (!Array.isArray(processRequestDTO)) {
      objectList = [processRequestDTO];
    }
    const selfLinks = objectList.map((no) => no.self);
    return new DSOSuccessResponse(selfLinks, data.statusCode, this.processPageInfo(data.payload))
  }

}
