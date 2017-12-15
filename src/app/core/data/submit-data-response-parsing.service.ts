import { Inject, Injectable } from '@angular/core';

import { ResponseParsingService } from './parsing.service';
import { RestRequest } from './request.models';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';
import {
  ConfigSuccessResponse, ErrorResponse, RestResponse,
  SubmitDataSuccessResponse
} from '../cache/response-cache.models';
import { isNotEmpty } from '../../shared/empty.util';
import { ConfigObjectFactory } from '../shared/config/config-object-factory';

import { ConfigObject } from '../shared/config/config.model';
import { ConfigType } from '../shared/config/config-type';
import { BaseResponseParsingService } from './base-response-parsing.service';
import { GLOBAL_CONFIG } from '../../../config';
import { GlobalConfig } from '../../../config/global-config.interface';
import { ObjectCacheService } from '../cache/object-cache.service';
import { DSpaceRESTv2Serializer } from '../dspace-rest-v2/dspace-rest-v2.serializer';
import { SubmitDataResponseDefinitionObject } from '../shared/submit-data-response-definition.model';
import { NormalizedSubmissionObjectFactory } from '../../submission/normalized-submission-object-factory';
import { NormalizedObject } from '../cache/models/normalized-object.model';
import { ResourceType } from '../shared/resource-type';
import { SubmissionResourceType } from '../../submission/submission-resource-type';

@Injectable()
export class SubmitDataResponseParsingService extends BaseResponseParsingService implements ResponseParsingService {

  protected objectFactory = NormalizedSubmissionObjectFactory;
  protected toCache = false;

  constructor(
    @Inject(GLOBAL_CONFIG) protected EnvConfig: GlobalConfig,
    protected objectCache: ObjectCacheService,
  ) {
    super();
  }

  parse(request: RestRequest, data: DSpaceRESTV2Response): RestResponse {
    if (isNotEmpty(data.payload) && isNotEmpty(data.payload._links)
      && (data.statusCode === '201' || data.statusCode === '200' || data.statusCode === 'OK' || data.statusCode === 'Created')) {
      const dataDefinition = this.process<NormalizedObject|ConfigObject,SubmissionResourceType>(data.payload, request.href);
      return new SubmitDataSuccessResponse(dataDefinition[Object.keys(dataDefinition)[0]], data.statusCode, this.processPageInfo(data.payload.page));
    } else {
      return new ErrorResponse(
        Object.assign(
          new Error('Unexpected response from server'),
          {statusText: data.statusCode}
        )
      );
    }
  }

}
