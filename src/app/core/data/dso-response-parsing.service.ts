import {
  Inject,
  Injectable,
} from '@angular/core';
import {
  APP_CONFIG,
  AppConfig,
} from '@dspace/config/app-config.interface';
import {
  hasNoValue,
  hasValue,
} from '@dspace/shared/utils/empty.util';

import { ObjectCacheService } from '../cache/object-cache.service';
import {
  DSOSuccessResponse,
  RestResponse,
} from '../cache/response.models';
import { RawRestResponse } from '../dspace-rest/raw-rest-response.model';
import { DSpaceObject } from '../shared/dspace-object.model';
import { BaseResponseParsingService } from './base-response-parsing.service';
import { ResponseParsingService } from './parsing.service';
import { RestRequest } from './rest-request.model';

/**
 * @deprecated use DspaceRestResponseParsingService for new code, this is only left to support a
 * few legacy use cases, and should get removed eventually
 */
@Injectable({ providedIn: 'root' })
export class DSOResponseParsingService extends BaseResponseParsingService implements ResponseParsingService {
  protected toCache = true;

  constructor(
    protected objectCache: ObjectCacheService,
    @Inject(APP_CONFIG) protected appConfig: AppConfig,
  ) {
    super();
  }

  parse(request: RestRequest, data: RawRestResponse): RestResponse {
    let processRequestDTO;
    // Prevent empty pages returning an error, initialize empty array instead.
    if (hasValue(data.payload) && hasValue(data.payload.page) && data.payload.page.totalElements === 0) {
      processRequestDTO = { page: [] };
    } else {
      processRequestDTO = this.process<DSpaceObject>(data.payload, request);
    }
    let objectList = processRequestDTO;

    if (hasNoValue(processRequestDTO)) {
      return new DSOSuccessResponse([], data.statusCode, data.statusText, undefined);
    }
    if (hasValue(processRequestDTO.page)) {
      objectList = processRequestDTO.page;
    } else if (!Array.isArray(processRequestDTO)) {
      objectList = [processRequestDTO];
    }
    const selfLinks = objectList.map((no) => no._links.self.href);
    return new DSOSuccessResponse(selfLinks, data.statusCode, data.statusText, this.processPageInfo(data.payload));
  }

}
