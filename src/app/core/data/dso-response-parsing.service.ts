import { Inject, Injectable } from '@angular/core';

import { ObjectCacheService } from '../cache/object-cache.service';
import { GlobalConfig } from '../../../config/global-config.interface';
import { GLOBAL_CONFIG } from '../../../config';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';
import { RestResponse, DSOSuccessResponse } from '../cache/response.models';
import { RestRequest } from './request.models';

import { ResponseParsingService } from './parsing.service';
import { BaseResponseParsingService } from './base-response-parsing.service';
import { hasNoValue, hasValue } from '../../shared/empty.util';
import { DSpaceObject } from '../shared/dspace-object.model';

@Injectable()
export class DSOResponseParsingService extends BaseResponseParsingService implements ResponseParsingService {
  protected toCache = true;

  constructor(
    @Inject(GLOBAL_CONFIG) protected EnvConfig: GlobalConfig,
    protected objectCache: ObjectCacheService,
  ) {
    super();
  }

  parse(request: RestRequest, data: DSpaceRESTV2Response): RestResponse {
    let processRequestDTO;
    // Prevent empty pages returning an error, initialize empty array instead.
    if (hasValue(data.payload) && hasValue(data.payload.page) && data.payload.page.totalElements === 0) {
      processRequestDTO = { page: [] };
    } else {
      processRequestDTO = this.process<DSpaceObject>(data.payload, request);
    }
    let objectList = processRequestDTO;

    if (hasNoValue(processRequestDTO)) {
      return new DSOSuccessResponse([], data.statusCode, data.statusText, undefined)
    }
    if (hasValue(processRequestDTO.page)) {
      objectList = processRequestDTO.page;
    } else if (!Array.isArray(processRequestDTO)) {
      objectList = [processRequestDTO];
    }
    const selfLinks = objectList.map((no) => no._links.self.href);
    return new DSOSuccessResponse(selfLinks, data.statusCode, data.statusText, this.processPageInfo(data.payload))
  }

}
