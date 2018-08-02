import { Inject, Injectable } from '@angular/core';
import { RestRequest } from '../data/request.models';
import { ResponseParsingService } from '../data/parsing.service';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';
import {
  ErrorResponse,
  IntegrationSuccessResponse,
  RestResponse
} from '../cache/response-cache.models';
import { isNotEmpty } from '../../shared/empty.util';
import { IntegrationObjectFactory } from './integration-object-factory';

import { BaseResponseParsingService } from '../data/base-response-parsing.service';
import { GLOBAL_CONFIG } from '../../../config';
import { GlobalConfig } from '../../../config/global-config.interface';
import { ObjectCacheService } from '../cache/object-cache.service';
import { IntegrationModel } from './models/integration.model';
import { IntegrationType } from './intergration-type';

@Injectable()
export class IntegrationResponseParsingService extends BaseResponseParsingService implements ResponseParsingService {

  protected objectFactory = IntegrationObjectFactory;
  protected toCache = false;

  constructor(
    @Inject(GLOBAL_CONFIG) protected EnvConfig: GlobalConfig,
    protected objectCache: ObjectCacheService,
  ) {
    super();
  }

  parse(request: RestRequest, data: DSpaceRESTV2Response): RestResponse {
    if (isNotEmpty(data.payload) && isNotEmpty(data.payload._links)) {
      const dataDefinition = this.process<IntegrationModel,IntegrationType>(data.payload, request.href);
      return new IntegrationSuccessResponse(dataDefinition, data.statusCode, this.processPageInfo(data.payload.page));
    } else {
      return new ErrorResponse(
        Object.assign(
          new Error('Unexpected response from Integration endpoint'),
          {statusText: data.statusCode}
        )
      );
    }
  }

}
