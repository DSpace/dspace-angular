import { Inject, Injectable } from '@angular/core';
import { RestRequest } from '../data/request.models';
import { ResponseParsingService } from '../data/parsing.service';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';
import {
  EpersonSuccessResponse, ErrorResponse,
  RestResponse
} from '../cache/response-cache.models';
import { isNotEmpty } from '../../shared/empty.util';
import { EpersonObjectFactory } from './eperson-object-factory';
import { EpersonType } from './eperson-type';

import { BaseResponseParsingService } from '../data/base-response-parsing.service';
import { GLOBAL_CONFIG } from '../../../config';
import { GlobalConfig } from '../../../config/global-config.interface';
import { ObjectCacheService } from '../cache/object-cache.service';
import { DSpaceObject } from '../shared/dspace-object.model';
import { NormalizedObject } from '../cache/models/normalized-object.model';

@Injectable()
export class EpersonResponseParsingService extends BaseResponseParsingService implements ResponseParsingService {

  protected objectFactory = EpersonObjectFactory;
  protected toCache = false;

  constructor(
    @Inject(GLOBAL_CONFIG) protected EnvConfig: GlobalConfig,
    protected objectCache: ObjectCacheService,
  ) {
    super();
  }

  parse(request: RestRequest, data: DSpaceRESTV2Response): RestResponse {
    if (isNotEmpty(data.payload) && isNotEmpty(data.payload._links)) {
      const epersonDefinition = this.process<NormalizedObject,EpersonType>(data.payload, request.href);
      return new EpersonSuccessResponse(epersonDefinition[Object.keys(epersonDefinition)[0]], data.statusCode, this.processPageInfo(data.payload.page));
    } else {
      return new ErrorResponse(
        Object.assign(
          new Error('Unexpected response from EPerson endpoint'),
          {statusText: data.statusCode}
        )
      );
    }
  }

}
