import { Inject, Injectable } from '@angular/core';
import { ResponseParsingService } from './parsing.service';
import { BaseResponseParsingService } from './base-response-parsing.service';
import { GlobalConfig } from '../../../config/global-config.interface';
import { GLOBAL_CONFIG } from '../../../config';
import { ObjectCacheService } from '../cache/object-cache.service';
import { RestRequest } from './request.models';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';
import {
  DSOSuccessResponse,
  GenericSuccessResponse,
  RestResponse
} from '../cache/response-cache.models';
import { NormalizedObjectFactory } from '../cache/models/normalized-object-factory';
import { DSpaceRESTv2Serializer } from '../dspace-rest-v2/dspace-rest-v2.serializer';
import { DSpaceObject } from '../shared/dspace-object.model';
import { NormalizedObject } from '../cache/models/normalized-object.model';
import { ResourceType } from '../shared/resource-type';
import { hasNoValue, hasValue } from '../../shared/empty.util';

@Injectable()
export class SingleDsoResponseParsingService  extends BaseResponseParsingService implements ResponseParsingService {
  protected objectFactory = NormalizedObjectFactory;
  protected toCache = true;

  constructor(
    @Inject(GLOBAL_CONFIG) protected EnvConfig: GlobalConfig,
    protected objectCache: ObjectCacheService,
  ) { super();
  }

  parse(request: RestRequest, data: DSpaceRESTV2Response): RestResponse {
    const processRequestDTO = this.process<NormalizedObject,ResourceType>(data.payload, request.href);
    if (hasNoValue(processRequestDTO)) {
      return new GenericSuccessResponse<DSpaceObject>(undefined, data.statusCode)
    }
    return new GenericSuccessResponse<DSpaceObject>(processRequestDTO, data.statusCode);
  }

}
